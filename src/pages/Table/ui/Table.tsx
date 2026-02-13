import { Button } from '@mui/material';
import { ChartsLocalizationProvider } from '@mui/x-charts-premium';
import {
	ChartsRenderer,
	configurationOptions,
} from '@mui/x-charts-premium/ChartsRenderer';
import { useMockServer } from '@mui/x-data-grid-generator';
import {
	DataGridPremium,
	type DataGridPremiumProps,
	GridChartsIntegrationContextProvider,
	GridChartsPanel,
	GridChartsRendererProxy,
	type GridDataSource,
	type GridEventListener,
	gridColumnGroupsUnwrappedModelSelector,
	gridPivotModelSelector,
	useGridApiRef,
} from '@mui/x-data-grid-premium';
import { ruRU } from '@mui/x-data-grid-premium/locales';
import { useEffect, useMemo, useRef, useState } from 'react';
import styles from './styles.module.scss';

const pivotingColDef: DataGridPremiumProps['pivotingColDef'] = (
	originalColumnField,
	columnGroupPath,
) => ({
	field: columnGroupPath.concat(originalColumnField).join('>->'),
});

const aggregationFunctions = {
	sum: { columnTypes: ['number'] },
	avg: { columnTypes: ['number'] },
	min: { columnTypes: ['number', 'date', 'dateTime'] },
	max: { columnTypes: ['number', 'date', 'dateTime'] },
	size: {},
};

export const Table = () => {
	const apiRef = useGridApiRef();
	const [savedState, setSavedState] = useState<any>(null);

	const { columns, fetchRows } = useMockServer(
		{ rowLength: 1000, dataSet: 'Commodity', maxColumns: 20 },
		{ useCursorPagination: false },
	);

	const dataSource: GridDataSource = useMemo(
		() => ({
			// Основное
			// https://mui.com/x/react-data-grid/server-side-data/
			getRows: async (params) => {
				const urlParams = new URLSearchParams({
					// https://mui.com/x/react-data-grid/pagination/#server-side-pagination
					paginationModel: JSON.stringify(params.paginationModel),

					// https://mui.com/x/react-data-grid/filtering/server-side/
					filterModel: JSON.stringify(params.filterModel),

					// https://mui.com/x/react-data-grid/sorting/#server-side-sorting
					sortModel: JSON.stringify(params.sortModel),

					// Группировка
					// https://mui.com/x/react-data-grid/server-side-data/row-grouping/
					groupKeys: JSON.stringify(params.groupKeys),
					groupFields: JSON.stringify(params.groupFields),

					// Агрегация
					// https://mui.com/x/react-data-grid/server-side-data/aggregation/
					aggregationModel: JSON.stringify(params.aggregationModel),

					// Режим сводной таблицы
					// https://mui.com/x/react-data-grid/server-side-data/pivoting/
					pivotModel: JSON.stringify(params.pivotModel),
				});

				// https://github.com/mui/mui-x/blob/master/packages/x-data-grid-generator/src/hooks/useMockServer.ts#L132
				const rowsResponse = await fetchRows(
					`https://mui.com/x/api/data-grid?${urlParams.toString()}`,
				);

				return {
					rows: rowsResponse.rows,
					rowCount: rowsResponse.rowCount,
					aggregateRow: rowsResponse.aggregateRow,
					pivotColumns: rowsResponse.pivotColumns,
				};
			},

			// Группировка
			getGroupKey: (row) => row.group,
			getChildrenCount: (row) => row.descendantCount,

			// Агрегация
			getAggregatedValue: (row, field) => row[field],
		}),
		[fetchRows],
	);

	// Графики
	// https://mui.com/x/react-data-grid/charts-integration/
	const hasInitializedPivotingSeries = useRef(false);
	useEffect(() => {
		const handleColumnsChange: GridEventListener<'columnsChange'> = () => {
			if (!apiRef.current || hasInitializedPivotingSeries.current) {
				return;
			}

			const unwrappedGroupingModel = Object.keys(
				gridColumnGroupsUnwrappedModelSelector(apiRef),
			);
			// wait until pivoting creates column grouping model
			if (unwrappedGroupingModel.length === 0) {
				return;
			}

			const pivotModel = gridPivotModelSelector(apiRef);
			const targetField = pivotModel.values.find(
				(value) => value.hidden !== true,
			)?.field;

			hasInitializedPivotingSeries.current = true;

			if (targetField) {
				apiRef.current.updateChartValuesData(
					'main',
					unwrappedGroupingModel
						.filter((field) => field.endsWith(targetField))
						.map((field) => ({ field })),
				);
			}
		};

		return apiRef.current?.subscribeEvent('columnsChange', handleColumnsChange);
	}, [apiRef]);

	const handleSaveState = () => {
		if (apiRef.current) {
			const fullState = apiRef.current.exportState();
			const chartsConfig = fullState.chartsIntegration;

			setSavedState(chartsConfig);
			console.log('savedState: ', chartsConfig);
		}
	};

	const handleRestoreState = () => {
		if (apiRef.current && savedState) {
			apiRef.current.restoreState({
				chartsIntegration: savedState,
			});
		}
	};

	return (
		<>
			<div>
				<Button onClick={handleSaveState}>Сохрнаить состояние</Button>
				<Button onClick={handleRestoreState}>Установить состояние</Button>
			</div>

			<ChartsLocalizationProvider>
				<GridChartsIntegrationContextProvider>
					<div className={styles.container}>
						<GridChartsRendererProxy id="main" renderer={ChartsRenderer} />
						<DataGridPremium
							apiRef={apiRef}
							columns={columns}
							dataSource={dataSource}
							pagination
							pivotingColDef={pivotingColDef}
							showToolbar
							aggregationFunctions={aggregationFunctions}
							localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
							// Графики
							experimentalFeatures={{
								charts: true,
							}}
							chartsIntegration
							slots={{
								chartsPanel: GridChartsPanel,
							}}
							slotProps={{
								chartsPanel: {
									schema: configurationOptions,
								},
							}}
							// initialState={{
							// 	chartsIntegration: {
							// 		activeChartId: 'main',
							// 		charts: {
							// 			main: {
							// 				chartType: 'column',
							// 				dimensions: [
							// 					{
							// 						field: 'id',
							// 					},
							// 				],
							// 				values: [
							// 					{
							// 						field: 'feeRate',
							// 					},
							// 				],
							// 				configuration: {
							// 					colors: 'redPalette',
							// 				},
							// 			},
							// 		},
							// 	},
							// }}
						/>
					</div>
				</GridChartsIntegrationContextProvider>
			</ChartsLocalizationProvider>
		</>
	);
};

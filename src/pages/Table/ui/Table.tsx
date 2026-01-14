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
import { useEffect, useMemo, useRef } from 'react';

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

	const { columns, fetchRows } = useMockServer(
		{ rowLength: 1000, dataSet: 'Commodity', maxColumns: 20 },
		{ useCursorPagination: false },
	);

	const dataSource: GridDataSource = useMemo(
		() => ({
			// Основное
			// https://mui.com/x/react-data-grid/server-side-data/
			getRows: async (params) => {
				console.log('rows params: ', params);

				const urlParams = new URLSearchParams({
					paginationModel: JSON.stringify(params.paginationModel),
					filterModel: JSON.stringify(params.filterModel),
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

	return (
		<ChartsLocalizationProvider>
			<GridChartsIntegrationContextProvider>
				<div className={styles.container}>
					<GridChartsRendererProxy id="main" renderer={ChartsRenderer} />
					<DataGridPremium
						columns={columns}
						dataSource={dataSource}
						pagination
						pivotingColDef={pivotingColDef}
						pageSizeOptions={[10, 20, 50]}
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
					/>
				</div>
			</GridChartsIntegrationContextProvider>
		</ChartsLocalizationProvider>
	);
};

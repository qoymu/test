import {
	DataGridPremium,
	type GridColDef,
	type GridDataSource,
} from '@mui/x-data-grid-premium';
import { ruRU } from '@mui/x-data-grid-premium/locales';
import { useMemo } from 'react';
import { queryClient } from '../../../shared/api/queryClient';
import {
	animalsApi,
	type IAnimalsApiQueryParams,
	type IField,
} from '../model/api';
import styles from './styles.module.scss';

interface Props {
	isLoading: boolean;
	settings: IAnimalsApiQueryParams | null;
	fields: IField[];
}

export const Table = ({ isLoading, settings, fields }: Props) => {
	// data
	const columns = useMemo(() => {
		return fields.map(
			(field) =>
				({
					field: field.identifier,
					headerName: field.label,
					type: 'string',
				}) as GridColDef,
		);
	}, [fields]);

	const dataSource: GridDataSource = useMemo(() => {
		return {
			getRows: async (params) => {
				if (!settings?.fields || !settings.forDate)
					return { rows: [], rowCount: 0 };

				const aggregation = Object.entries(params.aggregationModel || {}).map(
					([field, aggregation]) => ({ field, aggregation }),
				);

				const result = await queryClient.fetchQuery(
					animalsApi.getAnimals({
						fields: settings?.fields,

						forDate: settings?.forDate,

						pagination: params.paginationModel,

						...(Boolean(params.filterModel.items.length) && {
							filters: params.filterModel,
						}),

						...(Boolean(params.sortModel.length) && {
							ordering: params.sortModel,
						}),

						...(Boolean(aggregation.length) && {
							aggregation,
						}),

						...(Boolean(params.groupFields?.length) && {
							groupFields: params.groupFields,
						}),

						...(Boolean(params.groupKeys?.length) && {
							groupKeys: params.groupKeys,
						}),
					}),
				);

				return {
					rows: result.data,
					rowCount: result.rowCount,
				};
			},

			getGroupKey: (row) => row.groupKey,
			getChildrenCount: (row) => (row.groupKey ? -1 : 0),
		};
	}, [settings]);

	return (
		<div className={styles.table}>
			<DataGridPremium
				columns={columns}
				dataSource={dataSource}
				pagination
				showToolbar
				localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
				loading={isLoading}
			/>
		</div>
	);
};

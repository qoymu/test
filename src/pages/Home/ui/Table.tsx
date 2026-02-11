import { DataGridPremium, type GridColDef } from '@mui/x-data-grid-premium';
import { ruRU } from '@mui/x-data-grid-premium/locales';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
	animalsApi,
	fieldsApi,
	type IAnimalsApiQueryParams,
} from '../model/api';
import styles from './styles.module.scss';

interface Props {
	settings: IAnimalsApiQueryParams | null;
}

export const Table = ({ settings }: Props) => {
	const { data: fields, isPending: fieldsPending } = useQuery(
		fieldsApi.getFields(),
	);
	const { data: animals, isPending: animalsPending } = useQuery(
		animalsApi.getAnimals(settings),
	);

	const columns = useMemo(() => {
		return fields
			?.filter((field) => settings?.fields?.includes(field.identifier))
			?.map(
				(field) =>
					({
						field: field.identifier,
						headerName: field.label,
						type: 'string',
					}) as GridColDef,
			);
	}, [fields, settings?.fields]);

	return (
		<div className={styles.table}>
			<DataGridPremium
				columns={columns || []}
				rows={animals || []}
				// dataSource={dataSource}
				pagination
				showToolbar
				localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
				loading={fieldsPending || animalsPending}
			/>
		</div>
	);
};

import { DataGridPremium, type GridColDef } from '@mui/x-data-grid-premium';
import { ruRU } from '@mui/x-data-grid-premium/locales';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
	animalsApi,
	fieldsApi,
	type IAnimalsApiQueryParams,
} from '../model/api';
import type { TSettings } from '../model/types';
import styles from './styles.module.scss';

interface Props {
	settings: TSettings | null;
}

export const Table = ({ settings }: Props) => {
	const { data: fields, isPending: fieldsPending } = useQuery(
		fieldsApi.getFields(),
	);

	let animalsQueryParams: IAnimalsApiQueryParams | null = null;
	if (settings?.type === 'animals') {
		animalsQueryParams = {
			fields: settings.fields?.map((field) => field.identifier),
			for_date: settings.date,
		};
	}

	const { data: animals, isPending: animalsPending } = useQuery(
		animalsApi.getAnimals(animalsQueryParams),
	);

	const selectedFields = useMemo(() => {
		return settings?.fields?.map((field) => field.identifier);
	}, [settings?.fields]);

	const columns = useMemo(() => {
		return fields
			?.filter((field) => selectedFields?.includes(field.identifier))
			?.map(
				(field) =>
					({
						field: field.identifier,
						headerName: field.label,
						type: 'string',
					}) as GridColDef,
			);
	}, [fields, selectedFields]);

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

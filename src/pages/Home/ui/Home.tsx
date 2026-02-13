import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { fieldsApi, type IAnimalsApiQueryParams } from '../model/api';
import type { TSettings } from '../model/types';
import { Filters } from './Filters';
import { Settings } from './Settings';
import styles from './styles.module.scss';
import { Table } from './Table';

export const Home = () => {
	// states
	const [savedSettings, setSavedSettings] = useState<TSettings | null>(null);
	const [_savedFilters, setSavedFilters] = useState<string | null>(null);

	// api
	const { data: allFields, isPending: fieldsPending } = useQuery(
		fieldsApi.getFields(),
	);

	let animalsQueryParams: IAnimalsApiQueryParams | null = null;
	if (savedSettings?.type === 'animals') {
		animalsQueryParams = {
			fields: savedSettings.fields?.map((field) => field.identifier),
			for_date: savedSettings.date,
			// ...(savedFilters && { filters: savedFilters }),
		};
	}

	// data
	const selectedFields = useMemo(() => {
		return savedSettings?.fields?.map((field) => field.identifier);
	}, [savedSettings?.fields]);

	const fields = useMemo(() => {
		if (!allFields || !selectedFields) return [];

		return allFields?.filter((field) =>
			selectedFields?.includes(field.identifier),
		);
	}, [allFields, selectedFields]);

	return (
		<div className={styles.home}>
			<Settings setSavedSettings={setSavedSettings} />
			<Filters fields={fields} setSavedFilters={setSavedFilters} />
			<Table
				fields={fields}
				isLoading={fieldsPending}
				settings={animalsQueryParams}
			/>
		</div>
	);
};

import { useMemo, useState } from 'react';
import {
	type Field,
	QueryBuilder,
	type RuleGroupType,
} from 'react-querybuilder';
import 'react-querybuilder/dist/query-builder.css';
import { Button } from '@mui/material';
import type { IField } from '../model/api';
import styles from './styles.module.scss';

const initialQuery: RuleGroupType = { combinator: 'and', rules: [] };

interface Props {
	fields: IField[];
	setSavedFilters: React.Dispatch<React.SetStateAction<string | null>>;
}

export const Filters = ({ fields, setSavedFilters }: Props) => {
	const [query, setQuery] = useState(initialQuery);

	// const fieldsOptions = useMemo(() => {
	// 	const uniqueValues: Record<string, Set<string | number>> = {};

	// 	animals.forEach((animal) => {
	// 		Object.entries(animal).forEach(([fieldName, value]) => {
	// 			if (value) {
	// 				if (!(fieldName in uniqueValues)) uniqueValues[fieldName] = new Set();

	// 				uniqueValues[fieldName].add(value);
	// 			}
	// 		});
	// 	});

	// 	return uniqueValues;
	// }, [animals]);

	const queryBuilderFields = useMemo(() => {
		return fields.map(
			(field) =>
				({
					label: field.label,
					name: field.identifier,
					// values: Array.from(fieldsOptions[field.identifier] || []).map(
					// 	(value) => ({
					// 		label: value.toString(),
					// 		value,
					// 	}),
					// ),
					// valueEditorType: 'select',
				}) as Field,
		);
	}, [fields]);

	return (
		<div className={styles.filters}>
			<QueryBuilder
				fields={queryBuilderFields}
				query={query}
				onQueryChange={setQuery}
			/>
			<Button
				onClick={() => {
					setSavedFilters(JSON.stringify(query));
				}}
			>
				Применить
			</Button>
		</div>
	);
};

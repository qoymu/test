import { queryOptions } from '@tanstack/react-query';
import { jsonApiInstance } from '../../../shared/api/jsonApiInstance';

export interface IField {
	id: number;
	label: string;
	identifier: string;
}

export const fieldsApi = {
	getFields: () => {
		return queryOptions({
			queryKey: ['fields'],
			queryFn: () => jsonApiInstance<IField[]>('/animal_fields/'),
		});
	},
};

export interface IAnimalsApiQueryParams {
	for_date?: string;
	fields?: string[];
}

export const animalsApi = {
	getAnimals: (params: IAnimalsApiQueryParams | null) => {
		return queryOptions({
			queryKey: ['animals', params],
			queryFn: () => jsonApiInstance<IField[]>('/animal/', params || {}),
			enabled: params != null,
		});
	},
};

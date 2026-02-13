import type {
	GridFilterModel,
	GridPaginationModel,
	GridSortModel,
} from '@mui/x-data-grid-premium';
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

interface IAggregation {
	field: string;
	aggregation: string;
}

export interface IAnimalsApiQueryParams {
	for_date?: string;
	fields?: string[];
	// filters?: string;
	ordering?: GridSortModel;
	filters?: GridFilterModel;
	pagination?: GridPaginationModel;
	aggregation?: IAggregation[];
	groupKeys?: string[];
	groupFields?: string[];
}

export interface IAnimal {
	[fieldName: string]: string | number | null;
	id: number;
}

interface IAnimalsApiQueryResponse {
	data: IAnimal[];
	rowCount: number;
}

export const animalsApi = {
	getAnimals: (params: IAnimalsApiQueryParams | null) => {
		return queryOptions({
			queryKey: ['animals', params],
			queryFn: () =>
				jsonApiInstance<IAnimalsApiQueryResponse>('/animal/', params || {}),
			enabled: params != null,
		});
	},
};

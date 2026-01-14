import type { SETTINGS_OPTIONS } from '../config/constants';

export type TOption = (typeof SETTINGS_OPTIONS)[number];

interface IBaseSettings {
	type: TOption['id'];
}

export interface IAnimalsSettings extends IBaseSettings {
	type: 'animals';
	date?: string;
	alive?: boolean;
	fields?: string[];
}

export interface IEventsSettings extends IBaseSettings {
	type: 'events';
	events?: string[];
	dateFor?: string;
	dateTo?: string;
	fields?: string[];
}

export type TSettings = IAnimalsSettings | IEventsSettings | null;

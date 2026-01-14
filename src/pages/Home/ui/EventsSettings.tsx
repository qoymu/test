import { Autocomplete, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';

import type { IEventsSettings, TSettings } from '../model/types';

interface Props {
	settings: IEventsSettings;
	setSettings: React.Dispatch<React.SetStateAction<TSettings>>;
}
export const EventsSettings = ({ settings, setSettings }: Props) => {
	return (
		<>
			<Autocomplete
				options={[]}
				noOptionsText="Нет событий"
				multiple
				renderInput={(params) => <TextField {...params} label="События" />}
				onChange={(_event, value) => {
					setSettings({
						...settings,
						events: value,
					});
				}}
			/>
			<Autocomplete
				options={[]}
				noOptionsText="Нет параметров"
				multiple
				renderInput={(params) => <TextField {...params} label="Параметры" />}
				onChange={(_event, value) => {
					setSettings({
						...settings,
						fields: value,
					});
				}}
			/>
			<DatePicker
				label="от"
				onChange={(value) => {
					setSettings({
						...settings,
						dateFor: value ? format(value, 'yyyy-MM-dd') : undefined,
					});
				}}
				slotProps={{
					field: { clearable: true },
				}}
			/>
			<DatePicker
				label="до"
				onChange={(value) => {
					setSettings({
						...settings,
						dateTo: value ? format(value, 'yyyy-MM-dd') : undefined,
					});
				}}
				slotProps={{
					field: { clearable: true },
				}}
			/>
		</>
	);
};

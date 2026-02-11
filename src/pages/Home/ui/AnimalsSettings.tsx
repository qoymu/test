import {
	Autocomplete,
	Checkbox,
	FormControlLabel,
	TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { fieldsApi } from '../model/api';
import type { IAnimalsSettings, TSettings } from '../model/types';

interface Props {
	settings: IAnimalsSettings;
	setSettings: React.Dispatch<React.SetStateAction<TSettings>>;
}

export const AnimalsSettings = ({ settings, setSettings }: Props) => {
	const { data: fields } = useQuery(fieldsApi.getFields());

	return (
		<>
			<DatePicker
				label="Дата"
				onChange={(value) => {
					setSettings((prev) => {
						return {
							...prev,
							date: value ? format(value, 'yyyy-MM-dd') : undefined,
						} as IAnimalsSettings;
					});
				}}
				slotProps={{
					field: { clearable: true },
				}}
			/>
			<Autocomplete
				options={fields || []}
				value={settings.fields || []}
				noOptionsText="Нет параметров"
				multiple
				renderInput={(params) => <TextField {...params} label="Параметры" />}
				onChange={(_event, value) => {
					setSettings((prev) => {
						return { ...prev, fields: value } as IAnimalsSettings;
					});
				}}
				getOptionKey={(option) => option.id}
				getOptionLabel={(option) => option.label}
				disableCloseOnSelect
			/>
			<FormControlLabel
				sx={{ marginLeft: 0, userSelect: 'none' }}
				control={
					<Checkbox
						value={false}
						onChange={(_event, checked) => {
							setSettings((prev) => {
								return { ...prev, alive: checked } as IAnimalsSettings;
							});
						}}
					/>
				}
				label="Отсутствующие"
			/>
		</>
	);
};

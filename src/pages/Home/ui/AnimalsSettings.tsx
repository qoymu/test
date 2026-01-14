import {
	Autocomplete,
	Checkbox,
	FormControlLabel,
	TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';

import type { IAnimalsSettings, TSettings } from '../model/types';

interface Props {
	settings: IAnimalsSettings;
	setSettings: React.Dispatch<React.SetStateAction<TSettings>>;
}

export const AnimalsSettings = ({ settings, setSettings }: Props) => {
	return (
		<>
			<DatePicker
				label="Дата"
				onChange={(value) => {
					setSettings({
						...settings,
						date: value ? format(value, 'yyyy-MM-dd') : undefined,
					});
				}}
				slotProps={{
					field: { clearable: true },
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
			<FormControlLabel
				sx={{ marginLeft: 0, userSelect: 'none' }}
				control={
					<Checkbox
						value={false}
						onChange={(_event, checked) => {
							setSettings({
								...settings,
								alive: checked,
							});
						}}
					/>
				}
				label="Отсутствующие"
			/>
		</>
	);
};

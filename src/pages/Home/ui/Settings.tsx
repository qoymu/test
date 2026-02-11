import { Autocomplete, Button, TextField } from '@mui/material';
import { useState } from 'react';
import { SETTINGS_OPTIONS } from '../config/constants';
import type { IAnimalsApiQueryParams } from '../model/api';
import type { TOption, TSettings } from '../model/types';
import { AnimalsSettings } from './AnimalsSettings';
import { EventsSettings } from './EventsSettings';
import styles from './styles.module.scss';
import { Table } from './Table';

export const Settings = () => {
	// states
	const [settings, setSettings] = useState<TSettings>(null);
	const [savedSettings, setSavedSettings] =
		useState<IAnimalsApiQueryParams | null>(null);

	const handleChangeType = (
		_event: React.SyntheticEvent<Element, Event>,
		value: TOption | null,
	) => {
		setSettings(value ? { type: value.id } : null);
	};

	return (
		<div className={styles.settings}>
			<Autocomplete
				options={SETTINGS_OPTIONS}
				getOptionKey={(option) => option.id}
				renderInput={(params) => <TextField {...params} label="Тип данных" />}
				onChange={handleChangeType}
			/>
			{settings != null && (
				<>
					<div className={styles.fields}>
						{settings.type === 'animals' ? (
							<AnimalsSettings settings={settings} setSettings={setSettings} />
						) : (
							<EventsSettings settings={settings} setSettings={setSettings} />
						)}
					</div>
					<Button
						onClick={() => {
							if (settings.type === 'animals') {
								setSavedSettings(
									settings.type === 'animals'
										? {
												for_date: settings.date,
												fields: settings.fields?.map(
													(field) => field.identifier,
												),
											}
										: null,
								);
							}
						}}
					>
						Принять
					</Button>
				</>
			)}
			{savedSettings != null && <Table settings={savedSettings} />}
		</div>
	);
};

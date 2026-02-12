import { useState } from 'react';
import type { TSettings } from '../model/types';
import { Filters } from './Filters';
import { Settings } from './Settings';
import styles from './styles.module.scss';
import { Table } from './Table';

export const Home = () => {
	const [savedSettings, setSavedSettings] = useState<TSettings | null>(null);

	return (
		<div className={styles.home}>
			<Settings setSavedSettings={setSavedSettings} />
			<Filters />
			<Table settings={savedSettings} />
		</div>
	);
};

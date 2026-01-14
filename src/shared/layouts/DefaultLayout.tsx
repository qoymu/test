import { Outlet } from '@tanstack/react-router';

import styles from './styles.module.scss';

export const DefaultLayout = () => {
	return (
		<main className={styles.container}>
			<Outlet />
		</main>
	);
};

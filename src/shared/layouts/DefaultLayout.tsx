import { Link, Outlet } from '@tanstack/react-router';

import styles from './styles.module.scss';

export const DefaultLayout = () => {
	return (
		<main className={styles.container}>
			<div className={styles.navigation}>
				<Link to="/home">Home</Link>
				<Link to="/table">Table</Link>
			</div>
			<Outlet />
		</main>
	);
};

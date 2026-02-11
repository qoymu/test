import { Settings } from './Settings';

import styles from './styles.module.scss';

export const Home = () => {
	return (
		<div className={styles.home}>
			<Settings />
		</div>
	);
};

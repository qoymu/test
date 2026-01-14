import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { router } from './app/router/router.tsx';

import './index.css';

const root = document.getElementById('root');

if (root) {
	createRoot(root).render(
		<StrictMode>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<RouterProvider router={router} />
			</LocalizationProvider>
		</StrictMode>,
	);
}

import {
	createRootRoute,
	createRoute,
	createRouter,
	redirect,
} from '@tanstack/react-router';
import { Home } from '../../pages/Home';
import { Table } from '../../pages/Table';
import { DefaultLayout } from '../../shared/layouts/DefaultLayout';

const rootRoute = createRootRoute({
	component: () => <DefaultLayout />,
});

const indexRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: '/',
	component: () => undefined,
	beforeLoad: () => {
		throw redirect({
			to: '/home',
		});
	},
});

const homeRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: 'home',
	component: () => <Home />,
});

const tableRoute = createRoute({
	getParentRoute: () => rootRoute,
	path: 'table',
	component: () => <Table />,
});

const routeTree = rootRoute.addChildren([indexRoute, homeRoute, tableRoute]);

export const router = createRouter({
	routeTree,
});

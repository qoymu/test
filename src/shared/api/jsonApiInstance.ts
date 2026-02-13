const BASE_URL = 'http://31.129.109.10:8000/api';

type TQueryParams =
	| Record<
			string,
			string | number | boolean | undefined | null | string[] | number[]
	  >
	| {};

function basicAuthHeader(username: string, password: string) {
	const credentials = btoa(`${username}:${password}`);
	return `Basic ${credentials}`;
}

const queryParamsBuilder = (params: TQueryParams) => {
	const searchParams = new URLSearchParams();

	Object.entries(params).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			if (Array.isArray(value)) {
				value.forEach((item) => {
					searchParams.append(key, String(item));
				});
			} else if (typeof value === 'object') {
				searchParams.append(key, JSON.stringify(value));
			} else {
				searchParams.append(key, String(value));
			}
		}
	});

	return searchParams.toString();
};

const HEADERS = {
	'Content-Type': 'application/json',
	Authorization: basicAuthHeader('ytt', 'ytt_saas'),
};

export const jsonApiInstance = async <T>(
	url: string,
	params?: TQueryParams,
	init?: RequestInit & { json?: unknown },
) => {
	const headers = {
		...HEADERS,
		...(init?.headers || {}),
	};

	let fullUrl = `${BASE_URL}${url}`;

	if (init?.json) {
		init.body = JSON.stringify(init.json);
	}

	if (params) {
		fullUrl += `?${queryParamsBuilder(params)}`;
	}

	const result = await fetch(fullUrl, {
		...init,
		headers,
	});

	if (!result.ok) {
		throw new Error(`HTTP error ${result.status}`);
	}

	const data = (await result.json()) as Promise<T>;

	return data;
};

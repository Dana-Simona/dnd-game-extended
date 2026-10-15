const BASE_URL: string = import.meta.env.BASE_URL;

const EXTERNAL_URL = /^(?:[a-z][a-z\d+\-.]*:|\/\/)/i;

export const assetUrl = (path: string): string => {
	if (!path || EXTERNAL_URL.test(path)) return path;

	const base = BASE_URL.replace(/\/+$/, '');

	if (base && (path === base || path.startsWith(`${base}/`))) return path;

	return `${base}/${path.replace(/^\/+/, '')}`;
};

export default assetUrl;

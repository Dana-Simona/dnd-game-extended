import { useState, useEffect, useRef } from 'react';
import { API_BASE_URL } from '../../constants/apiUrl';

export const parseJsonLogs = (data: any): string[] => {
	if (Array.isArray(data)) return data;
	if (Array.isArray(data?.logs)) return data.logs;
	return [];
};

export const parseLogsResponse = async (res: Response): Promise<string[]> => {
	const contentType = res.headers.get('content-type');
	if (contentType?.includes('application/json')) {
		return parseJsonLogs(await res.json());
	}
	const text = await res.text();
	return text.split('\n').filter(Boolean);
};

export const fetchGameLogsApi = async (): Promise<string[]> => {
	const res = await fetch(`${API_BASE_URL}/api/logs`);
	if (!res.ok) throw new Error('Failed to fetch logs');
	return parseLogsResponse(res);
};

export const useGameLogs = (actionTrigger?: number | string) => {
	const [logs, setLogs] = useState<string[]>([]);
	const logEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		fetchGameLogsApi()
			.then(setLogs)
			.catch((err) => console.error('Error fetching game log:', err));
	}, [actionTrigger]);

	useEffect(() => {
		logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [logs]);

	return { logs, logEndRef };
};

import React, { useEffect, useState, useRef } from 'react';
import {
	LogBody,
	LogContainer,
	LogEntry,
	LogHeader,
	HighlightTeal,
	HighlightRed,
	HighlightBlue,
	HighlightPurple,
	HighlightGreen,
} from './GameLogStyles';
import { useCharacter } from '../../utils/characterContext/CharacterContext';

interface GameLogProps {
	actionTrigger?: number | string;
}

const colorizeLog = (text: string, playerName?: string) => {
	const escapedPlayerName = playerName
		? playerName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
		: null;

	const dynamicTargets = [
		'[-+]?\\d+\\s+(?:attack|damage|ability damage|defense|healed|health)',
		"Avenger's shield",
		'Blizzard',
		'arrow',
		'Fan of Knives',
		'Gold Cloak',
		'ability damage',
		'attack',
		'damage',
		'defense',
		'healed',
		'health',
	];

	if (escapedPlayerName) {
		dynamicTargets.push(escapedPlayerName);
	}

	const logRegex = new RegExp(`(${dynamicTargets.join('|')})`, 'gi');
	const parts = text.split(logRegex);

	return parts.map((part, i) => {
		const lower = part.toLowerCase();
		const lowerPlayerName = playerName?.toLowerCase();

		if (/[-+]?\d+\s+ability damage/i.test(part)) {
			return <HighlightPurple key={i}>{part}</HighlightPurple>;
		}
		if (/[-+]?\d+\s+(attack|damage)/i.test(part)) {
			return <HighlightRed key={i}>{part}</HighlightRed>;
		}
		if (/[-+]?\d+\s+defense/i.test(part)) {
			return <HighlightBlue key={i}>{part}</HighlightBlue>;
		}
		if (/[-+]?\d+\s+(healed|health)/i.test(part)) {
			return <HighlightGreen key={i}>{part}</HighlightGreen>;
		}

		if (lowerPlayerName && lower === lowerPlayerName) {
			return <HighlightTeal key={i}>{part}</HighlightTeal>;
		}

		switch (lower) {
			case "avenger's shield":
			case 'blizzard':
			case 'arrow':
			case 'fan of knives':
			case 'ability damage':
				return <HighlightPurple key={i}>{part}</HighlightPurple>;
			case 'gold cloak':
				return <HighlightTeal key={i}>{part}</HighlightTeal>;
			case 'attack':
			case 'damage':
				return <HighlightRed key={i}>{part}</HighlightRed>;
			case 'defense':
				return <HighlightBlue key={i}>{part}</HighlightBlue>;
			case 'healed':
			case 'health':
				return <HighlightGreen key={i}>{part}</HighlightGreen>;
			default:
				return part;
		}
	});
};

export const GameLog: React.FC<GameLogProps> = ({ actionTrigger }) => {
	const { character } = useCharacter();
	const [logs, setLogs] = useState<string[]>([]);
	const logEndRef = useRef<HTMLDivElement>(null);

	const fetchLogs = async () => {
		try {
			const res = await fetch('http://localhost:8080/api/logs');
			if (!res.ok) throw new Error('Failed to fetch logs');

			const contentType = res.headers.get('content-type');
			if (contentType && contentType.includes('application/json')) {
				const data = await res.json();
				if (Array.isArray(data)) {
					setLogs(data);
				} else if (data.logs && Array.isArray(data.logs)) {
					setLogs(data.logs);
				}
			} else {
				const text = await res.text();
				setLogs(text.split('\n').filter(Boolean));
			}
		} catch (err) {
			console.error('Error fetching game log:', err);
		}
	};

	useEffect(() => {
		fetchLogs();
	}, [actionTrigger]);

	useEffect(() => {
		logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
	}, [logs]);

	return (
		<LogContainer>
			<LogHeader>Game Log</LogHeader>
			<LogBody>
				{logs.length > 0 &&
					logs.map((log, index) => (
						<LogEntry key={index}>
							{colorizeLog(log, character?.name)}
						</LogEntry>
					))}
				<div ref={logEndRef} />
			</LogBody>
		</LogContainer>
	);
};

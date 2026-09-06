import {
	HighlightTeal,
	HighlightRed,
	HighlightBlue,
	HighlightPurple,
	HighlightGreen,
} from './GameLogStyles';

const BASE_TARGETS = [
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

export const escapeRegex = (str?: string): string | null =>
	str ? str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') : null;

export const buildLogRegex = (playerName?: string): RegExp => {
	const escaped = escapeRegex(playerName);
	const targets = escaped ? [...BASE_TARGETS, escaped] : BASE_TARGETS;
	return new RegExp(`(${targets.join('|')})`, 'gi');
};

export const getRegexHighlight = (part: string, key: number) => {
	if (/[-+]?\d+\s+ability damage/i.test(part))
		return <HighlightPurple key={key}>{part}</HighlightPurple>;
	if (/[-+]?\d+\s+(attack|damage)/i.test(part))
		return <HighlightRed key={key}>{part}</HighlightRed>;
	if (/[-+]?\d+\s+defense/i.test(part))
		return <HighlightBlue key={key}>{part}</HighlightBlue>;
	if (/[-+]?\d+\s+(healed|health)/i.test(part))
		return <HighlightGreen key={key}>{part}</HighlightGreen>;
	return null;
};

export const getKeywordHighlight = (
	part: string,
	key: number,
	playerName?: string,
) => {
	const lower = part.toLowerCase();
	if (playerName && lower === playerName.toLowerCase())
		return <HighlightTeal key={key}>{part}</HighlightTeal>;
	switch (lower) {
		case "avenger's shield":
		case 'blizzard':
		case 'arrow':
		case 'fan of knives':
		case 'ability damage':
			return <HighlightPurple key={key}>{part}</HighlightPurple>;
		case 'gold cloak':
			return <HighlightTeal key={key}>{part}</HighlightTeal>;
		case 'attack':
		case 'damage':
			return <HighlightRed key={key}>{part}</HighlightRed>;
		case 'defense':
			return <HighlightBlue key={key}>{part}</HighlightBlue>;
		case 'healed':
		case 'health':
			return <HighlightGreen key={key}>{part}</HighlightGreen>;
		default:
			return part;
	}
};

export const renderLogPart = (part: string, i: number, playerName?: string) => {
	const regexResult = getRegexHighlight(part, i);
	if (regexResult) return regexResult;
	return getKeywordHighlight(part, i, playerName);
};

export const colorizeLog = (text: string, playerName?: string) => {
	const regex = buildLogRegex(playerName);
	return text
		.split(regex)
		.map((part, i) => renderLogPart(part, i, playerName));
};

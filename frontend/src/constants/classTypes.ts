export const ClassTypes = {
	WARRIOR: 'warrior',
	MAGE: 'mage',
	ROGUE: 'rogue',
	HUNTER: 'hunter',
} as const;

export type ClassTypes = (typeof ClassTypes)[keyof typeof ClassTypes];

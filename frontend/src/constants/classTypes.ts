export const ClassTypes = {
	WARRIOR: 'warrior',
	MAGE: 'mage',
	ROGUE: 'rogue',
	HUNTER: 'hunter',
} as const;

export type ClassTypes = (typeof ClassTypes)[keyof typeof ClassTypes];

export const ClassAbilityDescription = {
	WARRIOR: 'Stabs a nearby enemy and restores health',
	MAGE: 'Strikes random enemies in range',
	ROGUE: 'Throws knives at all surrounding enemies',
	HUNTER: 'Fires an arrow at the closest enemy',
} as const;

export type ClassAbilityDescription =
	(typeof ClassAbilityDescription)[keyof typeof ClassAbilityDescription];

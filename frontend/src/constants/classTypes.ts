export const ClassTypes = {
	WARRIOR: 'warrior',
	MAGE: 'mage',
	ROGUE: 'rogue',
	HUNTER: 'hunter',
} as const;

export type ClassTypes = (typeof ClassTypes)[keyof typeof ClassTypes];

export const ClassAbilityDescription = {
	WARRIOR:
		'Smites a nearby enemy based on max health and restores health based on defense.',
	MAGE: 'Rains damage on random enemies in range, scaling with spell power. Costs mana.',
	ROGUE: 'Strikes all surrounding enemies based on attack power. Costs energy.',
	HUNTER: 'Fires at the closest enemy based on attack power. Consumes an arrow.',
} as const;

export type ClassAbilityDescription =
	(typeof ClassAbilityDescription)[keyof typeof ClassAbilityDescription];

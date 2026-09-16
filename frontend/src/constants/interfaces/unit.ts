export const UnitType = {
	PLAYER: 'Player',
	MONSTER: 'Monster',
	BOSS: 'Boss',
	TRAP: 'Trap',
} as const;

export type UnitType = (typeof UnitType)[keyof typeof UnitType];

export interface Unit {
	unitType: UnitType;
	id: string;
	character: string;
	name: string;
	attack: number;
	defense: number;
	health: number;
	currentHealth: number;
	x: number;
	y: number;
}

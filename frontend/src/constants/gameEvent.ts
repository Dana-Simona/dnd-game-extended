export const ActionType = {
	LEVEL_UP: 'LevelUp',
	NEXT_LEVEL: 'NextLevel',
	GAIN_XP: 'GainXP',
	COMBAT: 'Combat',
	ROLL_ATTACK: 'rollAttack',
	ROLL_DEFENSE: 'rollDefense',
	WIN: 'Win',
	LOSE: 'Lose',
	DIE: 'Die',
	MOVE: 'Move',
	MELEE: 'Melee',
	HEAL: 'Heal',
	ABILITY_CAST: 'AbilityCast',
	TAKE_DAMAGE: 'TakeDamage',
	TAKE_DAMAGE_FROM_ABILITY: 'TakeDamageFromAbility',
	BOSS_LEVEL: 'BossLevel',
} as const;

export type ActionType = (typeof ActionType)[keyof typeof ActionType];

export interface GameEvent {
	step: number;
	type: ActionType;
	sourceId: string;
	targetIds: string[];
	amount?: number;
}

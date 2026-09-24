export const SpritePresets = {
	DIE: 'die',
	IDLE: 'idle',
	MOVE: 'move',
	MELEE: 'melee',
	TAKE_DAMAGE: 'takedamage',
	ABILITY_CAST: 'abilitycast',
} as const;

export type SpritePresets = (typeof SpritePresets)[keyof typeof SpritePresets];

export interface SpriteAnimationCommand {
	type: SpritePresets;
	unitId: string;
	phase?: AnimationPhase;
}

export const AnimationPhase = {
	FULL: 'full',
	WINDUP: 'windup',
	FOLLOW_THROUGH: 'followThrough',
} as const;

export type AnimationPhase =
	(typeof AnimationPhase)[keyof typeof AnimationPhase];

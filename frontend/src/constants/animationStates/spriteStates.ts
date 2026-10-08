export const SpritePresets = {
	DIE: 'die',
	IDLE: 'idle',
	MOVE: 'move',
	MELEE: 'melee',
	TAKE_DAMAGE: 'takedamage',
	ABILITY_CAST: 'abilitycast',
	SPAWN: 'spawn',
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
	LOOP: 'loop',
} as const;

export type AnimationPhase =
	(typeof AnimationPhase)[keyof typeof AnimationPhase];

export interface TriggerSpriteAnimationAPI {
	play: (
		unitId: string,
		action: SpritePresets,
		phase?: AnimationPhase,
	) => Promise<void>;
	melee: (unitId: string, phase?: AnimationPhase) => Promise<void>;
	move: (unitId: string) => Promise<void>;
	takeDamage: (unitId: string, phase?: AnimationPhase) => Promise<void>;
	idle: (unitId: string) => Promise<void>;
	abilityCast: (unitId: string, phase?: AnimationPhase) => Promise<void>;
	die: (unitId: string, phase?: AnimationPhase) => Promise<void>;
	spawn: (unitId: string, phase?: AnimationPhase) => Promise<void>;
	loop: (unitId: string, action: SpritePresets) => Promise<void>;
	stopLoop: (unitId: string) => void;
}

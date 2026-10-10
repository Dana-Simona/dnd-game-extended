export interface TriggerSoundAPI {
	play: (preset: SoundPreset, volumeOverride?: number) => Promise<void>;
	stop: (preset: SoundPreset) => Promise<void>;
	stopAll: (fadeDuration?: number, includeMusic?: boolean) => Promise<void>;
	playMusic: (preset: SoundPreset) => Promise<void>;
	stopMusic: (fadeDuration?: number) => Promise<void>;
}

export const SoundPreset = {
	MAGE_RAISE_WAND: Symbol(),
	MAGE_WAND_CHARGE: Symbol(),
	MAGE_RAISE_WAND_BURST: Symbol(),
	MAGE_BLIZZARD_STORM: Symbol(),
	MAGE_BLIZZARD_HIT: Symbol(),
	MAGE_ICE_FEET: Symbol(),
	MAGE_MELEE: Symbol(),
	MAGE_GRUNT: Symbol(),
	MOVE: Symbol(),
	ENEMY_MELEE: Symbol(),
	KNOCKBACK: Symbol(),
	SWISH_SHORT: Symbol(),
	SWISH_MEDIUM: Symbol(),
	SWISH_BIG: Symbol(),
	ROLL: Symbol(),
	EXP: Symbol(),
	ENEMY_DIE: Symbol(),
	HUNTER_GRUNT: Symbol(),
	HUNTER_BOW: Symbol(),
	HUNTER_LAND: Symbol(),
	HUNTER_MELEE: Symbol(),
	BG_MUSIC_REGULAR: Symbol(),
	BG_MUSIC_BOSS: Symbol(),
	WARRIOR_GRUNT: Symbol(),
	WARRIOR_MELEE_START: Symbol(),
	WARRIOR_MELEE_END: Symbol(),
	WARRIOR_TAKE_DAMAGE: Symbol(),
} as const;

export type SoundPreset = (typeof SoundPreset)[keyof typeof SoundPreset];

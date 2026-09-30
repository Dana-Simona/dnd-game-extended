import { SoundPreset } from '../../../../constants/animationStates/soundStates';

export interface SoundConfig {
	files: string[];
	volume?: number;
	loop?: boolean;
}

export const soundRegistry: Record<SoundPreset, SoundConfig> = {
	[SoundPreset.MAGE_RAISE_WAND]: {
		files: ['/sfx/mage/raiseWand.mp3'],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.MAGE_WAND_CHARGE]: {
		files: ['/sfx/mage/wandCharge.mp3'],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.MAGE_RAISE_WAND_BURST]: {
		files: ['/sfx/mage/wandBurst.mp3'],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.MAGE_BLIZZARD_STORM]: {
		files: ['/sfx/mage/bgThunder.mp3'],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.MAGE_BLIZZARD_HIT]: {
		files: ['/sfx/mage/blizzardHit1.mp3', '/sfx/mage/blizzardHit2.mp3'],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.MAGE_ICE_FEET]: {
		files: ['/sfx/mage/iceFeet.mp3'],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.MAGE_MELEE]: {
		files: ['/sfx/mage/melee.mp3'],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.MAGE_GRUNT]: {
		files: ['/sfx/mage/grunt.mp3'],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.MOVE]: {
		files: ['/sfx/move1.mp3', '/sfx/move2.mp3'],
		volume: 0.3,
		loop: false,
	},
	[SoundPreset.ENEMY_MELEE]: {
		files: ['/sfx/enemies/melee.mp3'],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.KNOCKBACK]: {
		files: ['/sfx/knockback.mp3'],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.SWISH_SHORT]: {
		files: ['/sfx/swishShort.mp3'],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.SWISH_MEDIUM]: {
		files: ['/sfx/swishMedium.mp3'],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.SWISH_BIG]: {
		files: ['/sfx/swishBig.mp3'],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.ROLL]: {
		files: ['/sfx/roll.mp3'],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.EXP]: {
		files: ['/sfx/exp1.mp3'],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.ENEMY_DIE]: {
		files: ['/sfx/enemies/die.mp3'],
		volume: 0.8,
		loop: false,
	},
};

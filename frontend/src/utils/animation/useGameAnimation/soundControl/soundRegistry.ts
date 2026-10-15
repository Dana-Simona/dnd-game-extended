import { SoundPreset } from '../../../../constants/animationStates/soundStates';

import { assetUrl } from '../../../assetUrl';

export interface SoundConfig {
	files: string[];
	volume?: number;
	loop?: boolean;
}

export const soundRegistry: Record<SoundPreset, SoundConfig> = {
	[SoundPreset.MAGE_RAISE_WAND]: {
		files: [assetUrl('/sfx/mage/raiseWand.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.MAGE_WAND_CHARGE]: {
		files: [assetUrl('/sfx/mage/wandCharge.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.MAGE_RAISE_WAND_BURST]: {
		files: [assetUrl('/sfx/mage/wandBurst.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.MAGE_BLIZZARD_STORM]: {
		files: [assetUrl('/sfx/mage/bgThunder.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.MAGE_BLIZZARD_HIT]: {
		files: [assetUrl('/sfx/mage/blizzardHit1.mp3'), assetUrl('/sfx/mage/blizzardHit2.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.MAGE_ICE_FEET]: {
		files: [assetUrl('/sfx/mage/iceFeet.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.MAGE_MELEE]: {
		files: [assetUrl('/sfx/mage/melee.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.MAGE_GRUNT]: {
		files: [assetUrl('/sfx/mage/grunt.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.MOVE]: {
		files: [assetUrl('/sfx/move1.mp3'), assetUrl('/sfx/move2.mp3')],
		volume: 0.3,
		loop: false,
	},
	[SoundPreset.ENEMY_MELEE]: {
		files: [assetUrl('/sfx/enemies/melee.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.KNOCKBACK]: {
		files: [assetUrl('/sfx/knockback.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.SWISH_SHORT]: {
		files: [assetUrl('/sfx/swishShort.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.SWISH_MEDIUM]: {
		files: [assetUrl('/sfx/swishMedium.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.SWISH_BIG]: {
		files: [assetUrl('/sfx/swishBig.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.ROLL]: {
		files: [assetUrl('/sfx/roll.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.EXP]: {
		files: [assetUrl('/sfx/exp1.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.ENEMY_DIE]: {
		files: [assetUrl('/sfx/enemies/die.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.HUNTER_GRUNT]: {
		files: [assetUrl('/sfx/hunter/grunt.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.HUNTER_BOW]: {
		files: [assetUrl('/sfx/hunter/bow.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.HUNTER_LAND]: {
		files: [assetUrl('/sfx/hunter/land.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.HUNTER_MELEE]: {
		files: [assetUrl('/sfx/hunter/melee.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.BG_MUSIC_REGULAR]: {
		files: [assetUrl('/sfx/backgroundMusic/regular_bg.mp3')],
		volume: 0.1,
		loop: true,
	},
	[SoundPreset.BG_MUSIC_BOSS]: {
		files: [assetUrl('/sfx/backgroundMusic/boss_bg.mp3')],
		volume: 0.1,
		loop: true,
	},
	[SoundPreset.WARRIOR_GRUNT]: {
		files: [assetUrl('/sfx/warrior/grunt.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.WARRIOR_MELEE_END]: {
		files: [assetUrl('/sfx/warrior/meleeFollowThrough.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.WARRIOR_MELEE_START]: {
		files: [assetUrl('/sfx/warrior/meleeWindup.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.WARRIOR_TAKE_DAMAGE]: {
		files: [assetUrl('/sfx/warrior/takeDamage.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.WARRIOR_SLAM]: {
		files: [assetUrl('/sfx/warrior/slam.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.WARRIOR_FIRE_TRANSITION]: {
		files: [assetUrl('/sfx/warrior/fireTransition.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.WARRIOR_FIRE_AMBIANCE]: {
		files: [assetUrl('/sfx/warrior/fireAmbiance.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.WARRIOR_STAB]: {
		files: [assetUrl('/sfx/warrior/stab.mp3')],
		volume: 0.9,
		loop: false,
	},
	[SoundPreset.HEAL]: {
		files: [assetUrl('/sfx/heal.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.BOSS_SPAWN]: {
		files: [assetUrl('/sfx/boss/spawn.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.BOSS_SPELL]: {
		files: [assetUrl('/sfx/boss/spell.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.BOSS_STEP]: {
		files: [assetUrl('/sfx/boss/step.mp3')],
		volume: 0.8,
		loop: false,
	},
	[SoundPreset.BOSS_SPELL_HIT]: {
		files: [assetUrl('/sfx/boss/spellHit.mp3')],
		volume: 0.8,
		loop: false,
	},
};

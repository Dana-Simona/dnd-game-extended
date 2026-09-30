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
};

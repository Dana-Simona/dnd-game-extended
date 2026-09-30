export interface TriggerSoundAPI {
	play: (preset: SoundPreset, volumeOverride?: number) => Promise<void>;
	stop: (preset: SoundPreset) => Promise<void>;
	stopAll: () => Promise<void>;
}

export const SoundPreset = {
	MAGE_RAISE_WAND: Symbol(),
	MAGE_WAND_CHARGE: Symbol(),
	MAGE_RAISE_WAND_BURST: Symbol(),
	MAGE_BLIZZARD_STORM: Symbol(),
	MAGE_BLIZZARD_HIT: Symbol(),
	MAGE_ICE_FEET: Symbol(),
} as const;

export type SoundPreset = (typeof SoundPreset)[keyof typeof SoundPreset];

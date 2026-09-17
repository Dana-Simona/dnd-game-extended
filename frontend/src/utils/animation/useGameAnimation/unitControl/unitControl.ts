import type { TargetAndTransition } from 'framer-motion';

export type UnitTransform = Omit<TargetAndTransition, 'offset'> & {
	facing?: 'left' | 'right';
	offset?: { x: number; y: number };
};

export const UnitPreset = {
	FACE: 'FACE',
	DASH: 'DASH',
	RESET: 'RESET',
	FADE_OUT: 'FADE_OUT',
	FADE_IN: 'FADE_IN',
} as const;

export type UnitPreset = (typeof UnitPreset)[keyof typeof UnitPreset];

export type UnitCommand =
	| { type: typeof UnitPreset.FACE; sourceId: string; targetId: string }
	| {
			type: typeof UnitPreset.DASH;
			sourceId: string;
			targetId: string;
			distancePx?: number;
			durationMs?: number;
			delayMs?: number;
	  }
	| { type: typeof UnitPreset.RESET; unitId: string }
	| {
			type: typeof UnitPreset.FADE_OUT;
			unitId: string;
			durationMs?: number;
			delayMs?: number;
	  }
	| {
			type: typeof UnitPreset.FADE_IN;
			unitId: string;
			durationMs?: number;
			delayMs?: number;
	  };

export type TriggerUnit = (command: UnitCommand) => Promise<void>;

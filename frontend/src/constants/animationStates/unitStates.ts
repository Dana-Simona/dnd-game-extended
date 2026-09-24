import type { TargetAndTransition } from 'framer-motion';

export const UnitFacing = {
	LEFT: 'left',
	RIGHT: 'right',
} as const;

export type UnitFacing = (typeof UnitFacing)[keyof typeof UnitFacing];

export type UnitTransform = Omit<TargetAndTransition, 'offset'> & {
	facing?: UnitFacing;
	offset?: { x: number; y: number };
};

export const UnitPreset = {
	FACE: 'face',
	DASH: 'dash',
	RESET: 'reset',
	FADE_IN: 'fadeIn',
	FADE_OUT: 'fadeOut',
} as const;

export type UnitPreset = (typeof UnitPreset)[keyof typeof UnitPreset];

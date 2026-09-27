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

export interface TriggerUnitAPI {
	face: (sourceId: string, targetId: string) => Promise<void>;
	dash: (
		sourceId: string,
		targetId: string,
		distancePx?: number,
		durationMs?: number,
	) => Promise<void>;
	fadeOut: (
		unitId: string,
		delayMs?: number,
		durationMs?: number,
	) => Promise<void>;
	fadeIn: (
		unitId: string,
		delayMs?: number,
		durationMs?: number,
	) => Promise<void>;
	reset: (unitId: string) => Promise<void>;
	rotate: (
		unitId: string,
		degrees?: number,
		durationMs?: number,
	) => Promise<void>;
	jump: (
		sourceId: string,
		targetId: string,
		heightPx?: number,
		durationMs?: number,
	) => Promise<void>;
	leap: (
		unitId: string,
		heightPx?: number,
		durationMs?: number,
	) => Promise<void>;
	shake: (
		unitId: string,
		intensityPx?: number,
		durationMs?: number,
	) => Promise<void>;
}

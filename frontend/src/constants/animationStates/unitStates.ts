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

export interface TrapVisualState {
	revealed?: boolean;
	sway?: TargetAndTransition;
}

export type TrapVisualStateMap = Record<string, TrapVisualState>;

export interface TriggerUnitAPI {
	reveal: (unitId: string, durationMs?: number) => Promise<void>;
	plantRecoil: (
		defenderId: string,
		attackerId: string,
		durationMs?: number,
	) => Promise<void>;
	plantAttack: (
		attackerId: string,
		defenderId: string,
		durationMs?: number,
	) => Promise<void>;
	face: (sourceId: string, targetId: string) => Promise<void>;
	dash: (
		sourceId: string,
		targetId: string,
		distancePx?: number,
		durationMs?: number,
	) => Promise<void>;
	dashBy: (
		unitId: string,
		offsetX?: number,
		offsetY?: number,
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
		awayFromId?: string,
	) => Promise<void>;
	jump: (
		sourceId: string,
		targetId: string,
		heightPx?: number,
		durationMs?: number,
	) => Promise<void>;
	leap: (
		sourceId: string,
		targetId: string,
		heightAbove?: number,
		horizontalOffset?: number,
		durationMs?: number,
	) => Promise<void>;
	leapOffset: (
		sourceId: string,
		targetId: string,
		heightAbove?: number,
		horizontalOffset?: number,
	) => { x: number; y: number } | null;
	shake: (
		unitId: string,
		shakeAmount?: number,
		shakeWidth?: number,
		durationMs?: number,
	) => Promise<void>;
	grow: (
		unitId: string,
		scale?: number,
		durationMs?: number,
	) => Promise<void>;
}

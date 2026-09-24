import { useState, useCallback, useRef, useMemo } from 'react';
import type { Position } from './unitCalculations';
import {
	executeFaceTarget,
	executeDash,
	executeResetTransform,
	executeFadeOut,
	executeFadeIn,
	executeRotate,
	executeJump,
	executeLeap,
} from './unitAnimations';
import type { UnitTransform } from '../../../../constants/animationStates/unitStates';

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
}

export const useUnitControl = (visualPositions: Record<string, Position>) => {
	const [unitTransforms, setUnitTransforms] = useState<
		Record<string, UnitTransform>
	>({});

	const visualPositionsRef = useRef(visualPositions);
	visualPositionsRef.current = visualPositions;

	const faceTarget = useCallback(
		async (sourceId: string, targetId: string) => {
			await executeFaceTarget(
				sourceId,
				targetId,
				visualPositionsRef.current,
				setUnitTransforms,
			);
		},
		[],
	);

	const dash = useCallback(
		async (
			sourceId: string,
			targetId: string,
			distancePx = 24,
			durationMs = 200,
		) => {
			await executeDash(
				sourceId,
				targetId,
				distancePx,
				durationMs,
				visualPositionsRef.current,
				setUnitTransforms,
			);
		},
		[],
	);

	const fadeOut = useCallback(
		async (unitId: string, delayMs = 0, durationMs = 200) => {
			await executeFadeOut(
				unitId,
				delayMs,
				durationMs,
				setUnitTransforms,
			);
		},
		[],
	);

	const fadeIn = useCallback(
		async (unitId: string, delayMs = 0, durationMs = 200) => {
			await executeFadeIn(unitId, delayMs, durationMs, setUnitTransforms);
		},
		[],
	);

	const resetTransform = useCallback(async (unitId: string) => {
		await executeResetTransform(unitId, setUnitTransforms);
	}, []);

	const rotate = useCallback(
		async (unitId: string, degrees = 360, durationMs = 300) => {
			await executeRotate(unitId, degrees, durationMs, setUnitTransforms);
		},
		[],
	);

	const jump = useCallback(
		async (
			sourceId: string,
			targetId: string,
			heightPx = 30,
			durationMs = 300,
		) => {
			await executeJump(
				sourceId,
				targetId,
				heightPx,
				durationMs,
				visualPositionsRef.current,
				setUnitTransforms,
			);
		},
		[],
	);

	const leap = useCallback(
		async (unitId: string, heightPx = 30, durationMs = 300) => {
			await executeLeap(unitId, heightPx, durationMs, setUnitTransforms);
		},
		[],
	);

	const resetAllTransforms = useCallback(() => {
		setUnitTransforms({});
	}, []);

	const triggerUnit = useMemo<TriggerUnitAPI>(
		() => ({
			face: faceTarget,
			dash,
			fadeOut,
			fadeIn,
			reset: resetTransform,
			rotate,
			jump,
			leap,
		}),
		[faceTarget, dash, fadeOut, fadeIn, resetTransform, rotate, jump, leap],
	);

	return {
		triggerUnit,
		unitTransforms,
		resetAllTransforms,
		faceTarget,
		dash,
		fadeOut,
		fadeIn,
		resetTransform,
		rotate,
		jump,
		leap,
	};
};

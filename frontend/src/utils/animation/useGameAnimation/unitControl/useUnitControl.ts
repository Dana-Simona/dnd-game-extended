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
	executeShake,
} from './unitAnimations';
import type { TriggerUnitAPI, UnitTransform } from '../../../../constants/animationStates/unitStates';

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

	const shake = useCallback(
		async (unitId: string, intensityPx = 6, durationMs = 300) => {
			await executeShake(
				unitId,
				intensityPx,
				durationMs,
				setUnitTransforms,
			);
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
			shake,
		}),
		[
			faceTarget,
			dash,
			fadeOut,
			fadeIn,
			resetTransform,
			rotate,
			jump,
			leap,
			shake,
		],
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
		shake,
	};
};

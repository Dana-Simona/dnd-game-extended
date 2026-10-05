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
	executeReveal,
	executePlantRecoil,
	executePlantAttack,
} from './unitAnimations';
import type {
	TriggerUnitAPI,
	UnitTransform,
	TrapVisualStateMap,
} from '../../../../constants/animationStates/unitStates';

export const useUnitControl = (visualPositions: Record<string, Position>) => {
	const [unitTransforms, setUnitTransforms] = useState<
		Record<string, UnitTransform>
	>({});
	const [trapStates, setTrapStates] = useState<TrapVisualStateMap>({});

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

	const revealedRef = useRef<Set<string>>(new Set());

	const reveal = useCallback(async (unitId: string, durationMs = 350) => {
		if (revealedRef.current.has(unitId)) return;
		revealedRef.current.add(unitId);
		await executeReveal(unitId, durationMs, setTrapStates);
	}, []);

	const plantRecoil = useCallback(
		async (defenderId: string, attackerId: string, durationMs = 1000) => {
			await executePlantRecoil(
				defenderId,
				attackerId,
				durationMs,
				visualPositionsRef.current,
				setTrapStates,
			);
		},
		[],
	);

	const plantAttack = useCallback(
		async (attackerId: string, defenderId: string, durationMs = 1000) => {
			await executePlantAttack(
				attackerId,
				defenderId,
				durationMs,
				visualPositionsRef.current,
				setTrapStates,
			);
		},
		[],
	);

	const resetAllTransforms = useCallback(() => {
		setUnitTransforms({});
		setTrapStates({});
		revealedRef.current.clear();
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
			reveal,
			plantRecoil,
			plantAttack,
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
			reveal,
			plantRecoil,
			plantAttack,
		],
	);

	return {
		triggerUnit,
		unitTransforms,
		trapStates,
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
		reveal,
		plantRecoil,
		plantAttack,
	};
};

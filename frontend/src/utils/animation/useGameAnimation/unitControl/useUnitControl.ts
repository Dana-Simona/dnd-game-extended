import { useState, useCallback, useRef } from 'react';
import type { Position } from './unitCalculations';
import {
	UnitPreset,
	type UnitCommand,
	type UnitTransform,
	type TriggerUnit,
} from './unitControl';
import {
	executeFaceTarget,
	executeDashTowards,
	executeKnockbackFrom,
	executeResetTransform,
} from './unitAnimations';

export const useUnitControl = (visualPositions: Record<string, Position>) => {
	const [unitTransforms, setUnitTransforms] = useState<
		Record<string, UnitTransform>
	>({});

	const visualPositionsRef = useRef(visualPositions);
	visualPositionsRef.current = visualPositions;

	const faceTarget = useCallback(
		async (sourceId: string, targetId: string) => {
			executeFaceTarget(
				sourceId,
				targetId,
				visualPositionsRef.current,
				setUnitTransforms,
			);
		},
		[],
	);

	const dashTowards = useCallback(
		async (
			sourceId: string,
			targetId: string,
			distancePx = 24,
			durationMs = 200,
			delayMs = 0, // Default set to 0
		) => {
			await executeDashTowards(
				sourceId,
				targetId,
				distancePx,
				durationMs,
				delayMs,
				visualPositionsRef.current,
				setUnitTransforms,
			);
		},
		[],
	);

	const knockbackFrom = useCallback(
		async (
			targetId: string,
			sourceId: string,
			distancePx = 12,
			durationMs = 200,
			delayMs = 0, // Default set to 0
		) => {
			await executeKnockbackFrom(
				targetId,
				sourceId,
				distancePx,
				durationMs,
				delayMs,
				visualPositionsRef.current,
				setUnitTransforms,
			);
		},
		[],
	);

	const resetTransform = useCallback(async (unitId: string) => {
		executeResetTransform(unitId, setUnitTransforms);
	}, []);

	const resetAllTransforms = useCallback(() => {
		setUnitTransforms({});
	}, []);

	const triggerUnit: TriggerUnit = useCallback(
		async (command: UnitCommand) => {
			switch (command.type) {
				case UnitPreset.FACE:
					await faceTarget(command.sourceId, command.targetId);
					break;
				case UnitPreset.DASH:
					await dashTowards(
						command.sourceId,
						command.targetId,
						command.distancePx,
						command.durationMs,
						command.delayMs,
					);
					break;
				case UnitPreset.KNOCKBACK:
					await knockbackFrom(
						command.targetId,
						command.sourceId,
						command.distancePx,
						command.durationMs,
						command.delayMs,
					);
					break;
				case UnitPreset.RESET:
					await resetTransform(command.unitId);
					break;
			}
		},
		[faceTarget, dashTowards, knockbackFrom, resetTransform],
	);

	return {
		triggerUnit,
		unitTransforms,
		resetAllTransforms,
	};
};

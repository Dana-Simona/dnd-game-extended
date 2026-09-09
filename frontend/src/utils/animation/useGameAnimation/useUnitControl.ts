import { useState, useCallback, useRef } from 'react';
import {
	UnitPreset,
	type UnitCommand,
	type UnitTransform,
	type TriggerUnit,
} from '../../../constants/unitControl';

export const useUnitControl = (
	visualPositions: Record<string, { x: number; y: number }>,
) => {
	const [unitTransforms, setUnitTransforms] = useState<
		Record<string, UnitTransform>
	>({});

	const visualPositionsRef = useRef(visualPositions);
	visualPositionsRef.current = visualPositions;

	const faceTarget = useCallback(
		async (sourceId: string, targetId: string) => {
			const sourcePos = visualPositionsRef.current[sourceId];
			const targetPos = visualPositionsRef.current[targetId];

			if (!sourcePos || !targetPos) return;

			const dx = targetPos.x - sourcePos.x;
			const facing: 'left' | 'right' = dx < 0 ? 'left' : 'right';

			setUnitTransforms((prev) => ({
				...prev,
				[sourceId]: {
					facing,
					offset: prev[sourceId]?.offset ?? { x: 0, y: 0 },
				},
			}));
		},
		[],
	);

	const dashTowards = useCallback(
		async (
			sourceId: string,
			targetId: string,
			distancePx = 24,
			durationMs = 200,
		) => {
			const sourcePos = visualPositionsRef.current[sourceId];
			const targetPos = visualPositionsRef.current[targetId];

			if (!sourcePos || !targetPos) return;

			const dx = targetPos.x - sourcePos.x;
			const dy = targetPos.y - sourcePos.y;
			const length = Math.hypot(dx, dy) || 1;

			const offsetX = (dx / length) * distancePx;
			const offsetY = (dy / length) * distancePx;
			const facing: 'left' | 'right' = dx < 0 ? 'left' : 'right';

			setUnitTransforms((prev) => ({
				...prev,
				[sourceId]: { facing, offset: { x: offsetX, y: offsetY } },
			}));

			await new Promise((resolve) => setTimeout(resolve, durationMs));

			setUnitTransforms((prev) => ({
				...prev,
				[sourceId]: {
					facing: prev[sourceId]?.facing ?? facing,
					offset: { x: 0, y: 0 },
				},
			}));
		},
		[],
	);

	const knockbackFrom = useCallback(
		async (
			targetId: string,
			sourceId: string,
			distancePx = 12,
			durationMs = 200,
		) => {
			const targetPos = visualPositionsRef.current[targetId];
			const sourcePos = visualPositionsRef.current[sourceId];

			if (!targetPos || !sourcePos) return;

			const dx = targetPos.x - sourcePos.x;
			const dy = targetPos.y - sourcePos.y;
			const length = Math.hypot(dx, dy) || 1;

			const offsetX = (dx / length) * distancePx;
			const offsetY = (dy / length) * distancePx;

			setUnitTransforms((prev) => ({
				...prev,
				[targetId]: {
					facing: prev[targetId]?.facing ?? 'right',
					offset: { x: offsetX, y: offsetY },
				},
			}));

			await new Promise((resolve) => setTimeout(resolve, durationMs));

			setUnitTransforms((prev) => ({
				...prev,
				[targetId]: {
					facing: prev[targetId]?.facing ?? 'right',
					offset: { x: 0, y: 0 },
				},
			}));
		},
		[],
	);

	const resetTransform = useCallback(async (unitId: string) => {
		setUnitTransforms((prev) => ({
			...prev,
			[unitId]: {
				facing: prev[unitId]?.facing ?? 'right',
				offset: { x: 0, y: 0 },
			},
		}));
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
					);
					break;
				case UnitPreset.KNOCKBACK:
					await knockbackFrom(
						command.targetId,
						command.sourceId,
						command.distancePx,
						command.durationMs,
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

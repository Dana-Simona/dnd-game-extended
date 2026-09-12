import type { UnitTransform } from './unitControl';
import {
	calculateFacing,
	calculateVectorOffset,
	type Position,
} from './unitCalculations';
import {
	applyFacing,
	applyOffsetAndFacing,
	resetUnitOffset,
	resetUnitTransform,
} from './unitStateUpdaters';

type SetTransforms = React.Dispatch<
	React.SetStateAction<Record<string, UnitTransform>>
>;

export const executeFaceTarget = (
	sourceId: string,
	targetId: string,
	positions: Record<string, Position>,
	setTransforms: SetTransforms,
) => {
	const sourcePos = positions[sourceId];
	const targetPos = positions[targetId];
	if (!sourcePos || !targetPos) return;

	const facing = calculateFacing(sourcePos, targetPos);
	setTransforms(applyFacing(sourceId, facing));
};

export const executeDashTowards = async (
	sourceId: string,
	targetId: string,
	distancePx = 24,
	durationMs = 200,
	delayMs = 0,
	positions: Record<string, Position>,
	setTransforms: SetTransforms,
) => {
	const sourcePos = positions[sourceId];
	const targetPos = positions[targetId];

	if (!sourcePos || !targetPos) {
		console.warn(
			`Dash failed: Missing position for ${sourceId} or ${targetId}`,
		);
		return;
	}

	if (delayMs > 0) {
		await new Promise((resolve) => setTimeout(resolve, delayMs));
	}

	const { offsetX, offsetY } = calculateVectorOffset(
		sourcePos,
		targetPos,
		distancePx,
	);
	const facing = calculateFacing(sourcePos, targetPos);

	const halfDuration = Math.floor(durationMs / 2);

	setTransforms(
		applyOffsetAndFacing(sourceId, { x: offsetX, y: offsetY }, facing),
	);
	await new Promise((resolve) => setTimeout(resolve, halfDuration));

	setTransforms(resetUnitOffset(sourceId, facing));
	await new Promise((resolve) => setTimeout(resolve, halfDuration));
};

export const executeKnockbackFrom = async (
	targetId: string,
	sourceId: string,
	distancePx = 12,
	durationMs = 200,
	delayMs = 0,
	positions: Record<string, Position>,
	setTransforms: SetTransforms,
) => {
	const targetPos = positions[targetId];
	const sourcePos = positions[sourceId];
	if (!targetPos || !sourcePos) return;

	if (delayMs > 0) {
		await new Promise((resolve) => setTimeout(resolve, delayMs));
	}

	const { offsetX, offsetY } = calculateVectorOffset(
		sourcePos,
		targetPos,
		distancePx,
	);

	setTransforms(applyOffsetAndFacing(targetId, { x: offsetX, y: offsetY }));
	await new Promise((resolve) => setTimeout(resolve, durationMs));
	setTransforms(resetUnitOffset(targetId));
};

export const executeResetTransform = (
	unitId: string,
	setTransforms: SetTransforms,
) => {
	setTransforms(resetUnitTransform(unitId));
};

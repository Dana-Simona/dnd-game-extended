import {
	calculateFacing,
	calculateVectorOffset,
	type Position,
} from './unitCalculations';
import type { UnitTransform } from './unitControl';

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

	setTransforms((prev) => ({
		...prev,
		[sourceId]: {
			...prev[sourceId],
			scaleX: facing === 'left' ? -1 : 1,
			transition: { duration: 0.1, ease: 'easeOut' },
		},
	}));
};

export const executeDash = async (
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

	const dashVariant: UnitTransform = {
		x: offsetX,
		y: offsetY,
		scaleX: facing === 'left' ? -1 : 1,
		transition: {
			duration: durationMs / 1000,
			ease: [0, 0.85, 0.15, 1.0]
		},
	};

	setTransforms((prev) => ({
		...prev,
		[sourceId]: dashVariant,
	}));

	await new Promise((resolve) => setTimeout(resolve, durationMs));
};

export const executeFadeOut = async (
	unitId: string,
	durationMs = 200,
	delayMs = 0,
	setTransforms: SetTransforms,
) => {
	if (delayMs > 0) {
		await new Promise((resolve) => setTimeout(resolve, delayMs));
	}

	const fadeOutVariant: UnitTransform = {
		opacity: 0,
		transition: {
			duration: durationMs / 1000,
			ease: 'easeIn',
		},
	};

	setTransforms((prev) => ({
		...prev,
		[unitId]: { ...prev[unitId], ...fadeOutVariant },
	}));

	await new Promise((resolve) => setTimeout(resolve, durationMs));
};

export const executeFadeIn = async (
	unitId: string,
	durationMs = 200,
	delayMs = 0,
	setTransforms: SetTransforms,
) => {
	if (delayMs > 0) {
		await new Promise((resolve) => setTimeout(resolve, delayMs));
	}

	const fadeInVariant: UnitTransform = {
		opacity: 1,
		transition: {
			duration: durationMs / 1000,
			ease: 'easeOut',
		},
	};

	setTransforms((prev) => ({
		...prev,
		[unitId]: { ...prev[unitId], ...fadeInVariant },
	}));

	await new Promise((resolve) => setTimeout(resolve, durationMs));
};

export const executeResetTransform = (
	unitId: string,
	setTransforms: SetTransforms,
) => {
	const resetVariant: UnitTransform = {
		x: 0,
		y: 0,
		opacity: 1,
		transition: {
			duration: 0.15,
			ease: 'anticipate',
		},
	};

	setTransforms((prev) => ({
		...prev,
		[unitId]: {
			...prev[unitId],
			...resetVariant,
		},
	}));
};

import type { TargetAndTransition } from 'framer-motion';
import type {
	TrapVisualState,
	UnitTransform,
} from '../../../../constants/animationStates/unitStates';
import {
	calculateFacing,
	calculateVectorOffset,
	type Position,
} from './unitCalculations';

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
			ease: [0, 0.85, 0.15, 1.0],
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
	delayMs = 0,
	durationMs = 200,
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
	delayMs = 0,
	durationMs = 200,
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
		rotate: 0,
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

export const executeRotate = async (
	unitId: string,
	degrees = 360,
	durationMs = 300,
	setTransforms: SetTransforms,
) => {
	const rotateVariant: UnitTransform = {
		rotate: degrees,
		transition: {
			duration: durationMs / 1000,
			ease: 'easeInOut',
		},
	};

	setTransforms((prev) => ({
		...prev,
		[unitId]: { ...prev[unitId], ...rotateVariant },
	}));

	await new Promise((resolve) => setTimeout(resolve, durationMs));
};

export const executeJump = async (
	sourceId: string,
	targetId: string,
	heightPx = 30,
	durationMs = 300,
	positions: Record<string, Position>,
	setTransforms: SetTransforms,
) => {
	const sourcePos = positions[sourceId];
	const targetPos = positions[targetId];

	if (!sourcePos || !targetPos) {
		console.warn(
			`Jump failed: Missing position for ${sourceId} or ${targetId}`,
		);
		return;
	}

	const { offsetX, offsetY } = calculateVectorOffset(
		sourcePos,
		targetPos,
		24,
	);
	const facing = calculateFacing(sourcePos, targetPos);

	const jumpUpVariant: UnitTransform = {
		x: offsetX * 0.5,
		y: offsetY - heightPx,
		scaleX: facing === 'left' ? -1 : 1,
		transition: {
			duration: durationMs / 2000,
			ease: 'easeOut',
		},
	};

	setTransforms((prev) => ({
		...prev,
		[sourceId]: { ...prev[sourceId], ...jumpUpVariant },
	}));

	await new Promise((resolve) => setTimeout(resolve, durationMs / 2));

	const jumpDownVariant: UnitTransform = {
		x: offsetX,
		y: offsetY,
		scaleX: facing === 'left' ? -1 : 1,
		transition: {
			duration: durationMs / 2000,
			ease: 'easeIn',
		},
	};

	setTransforms((prev) => ({
		...prev,
		[sourceId]: { ...prev[sourceId], ...jumpDownVariant },
	}));

	await new Promise((resolve) => setTimeout(resolve, durationMs / 2));
};

export const executeLeap = async (
	unitId: string,
	heightPx = 30,
	durationMs = 300,
	setTransforms: SetTransforms,
) => {
	const leapUpVariant: UnitTransform = {
		y: -heightPx,
		transition: {
			duration: durationMs / 2000,
			ease: 'easeOut',
		},
	};

	setTransforms((prev) => ({
		...prev,
		[unitId]: { ...prev[unitId], ...leapUpVariant },
	}));

	await new Promise((resolve) => setTimeout(resolve, durationMs / 2));

	const leapDownVariant: UnitTransform = {
		y: 0,
		transition: {
			duration: durationMs / 2000,
			ease: 'easeIn',
		},
	};

	setTransforms((prev) => ({
		...prev,
		[unitId]: { ...prev[unitId], ...leapDownVariant },
	}));

	await new Promise((resolve) => setTimeout(resolve, durationMs / 2));
};

export const executeShake = async (
	unitId: string,
	intensityPx = 6,
	durationMs = 300,
	setTransforms: SetTransforms,
) => {
	let basePositionX = 0;

	setTransforms((prev) => {
		const currentTransform = prev[unitId] || {};
		const currentX =
			typeof currentTransform.x === 'number'
				? currentTransform.x
				: (currentTransform.offset?.x ?? 0);

		basePositionX = currentX;

		const keyframeX = [
			currentX,
			currentX - intensityPx,
			currentX + intensityPx,
			currentX - intensityPx * 0.6,
			currentX + intensityPx * 0.6,
			currentX,
		];

		return {
			...prev,
			[unitId]: {
				...currentTransform,
				x: keyframeX,
				transition: {
					duration: durationMs / 1000,
					ease: 'easeInOut',
				},
			},
		};
	});

	await new Promise((resolve) => setTimeout(resolve, durationMs));

	setTransforms((prev) => {
		const currentTransform = prev[unitId];
		if (!currentTransform) return prev;

		return {
			...prev,
			[unitId]: {
				...currentTransform,
				x: basePositionX,
			},
		};
	});
};

type SetTrapStates = React.Dispatch<
	React.SetStateAction<Record<string, TrapVisualState>>
>;

export const executeReveal = async (
	unitId: string,
	durationMs = 350,
	setTrapStates: SetTrapStates,
) => {
	setTrapStates((prev) => ({
		...prev,
		[unitId]: { ...prev[unitId], revealed: true },
	}));

	// give the trap's pop-in spring time to play before combat continues
	await new Promise((resolve) => setTimeout(resolve, durationMs));
};

/**
 * Knockback for rooted plants: instead of sliding away, the plant leans away
 * from the attacker and stretches like it's being yanked, then whips back
 * past upright and settles. Pivot is the plant's base (see TrapUnit).
 */
export const executePlantRecoil = async (
	defenderId: string,
	attackerId: string,
	durationMs = 1000,
	positions: Record<string, Position>,
	setTrapStates: SetTrapStates,
) => {
	const defenderPos = positions[defenderId];
	const attackerPos = positions[attackerId];

	// lean direction: +1 = lean right, -1 = lean left (away from attacker)
	let dir = 1;
	if (defenderPos && attackerPos) {
		const dx = defenderPos.x - attackerPos.x;
		if (dx !== 0) dir = Math.sign(dx);
	}

	const sway: TargetAndTransition = {
		rotate: [0, 32 * dir, 38 * dir, -14 * dir, 6 * dir, -2 * dir, 0],
		scaleY: [1, 1.35, 1.42, 0.85, 1.08, 0.98, 1],
		scaleX: [1, 0.78, 0.74, 1.15, 0.95, 1.02, 1],
		skewX: [0, -10 * dir, -12 * dir, 6 * dir, -2 * dir, 0, 0],
		transition: {
			duration: durationMs / 1000,
			times: [0, 0.12, 0.3, 0.5, 0.68, 0.84, 1],
			ease: 'easeOut',
		},
	};

	setTrapStates((prev) => ({
		...prev,
		[defenderId]: { ...prev[defenderId], sway },
	}));

	await new Promise((resolve) => setTimeout(resolve, durationMs));

	setTrapStates((prev) => ({
		...prev,
		[defenderId]: {
			...prev[defenderId],
			sway: {
				rotate: 0,
				scaleY: 1,
				scaleX: 1,
				skewX: 0,
				transition: { duration: 0 },
			},
		},
	}));
};

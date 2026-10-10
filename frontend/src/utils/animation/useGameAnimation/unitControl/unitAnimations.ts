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
export const calculateLeapOffset = (
	sourceId: string,
	targetId: string,
	heightAbove = 80,
	horizontalOffset = 40,
	positions: Record<string, Position>,
): Position | null => {
	const sourcePos = positions[sourceId];
	const targetPos = positions[targetId];
	if (!sourcePos || !targetPos) return null;

	const destY = targetPos.y - heightAbove;

	const isTargetRight = targetPos.x >= sourcePos.x;
	const destX = isTargetRight
		? targetPos.x - horizontalOffset
		: targetPos.x + horizontalOffset;

	return { x: destX - sourcePos.x, y: destY - sourcePos.y };
};

export const executeLeap = async (
	sourceId: string,
	targetId: string,
	heightAbove = 80,
	horizontalOffset = 40,
	durationMs = 300,
	positions: Record<string, Position>,
	setTransforms: SetTransforms,
) => {
	const sourcePos = positions[sourceId];
	const targetPos = positions[targetId];
	const offset = calculateLeapOffset(
		sourceId,
		targetId,
		heightAbove,
		horizontalOffset,
		positions,
	);

	if (!sourcePos || !targetPos || !offset) {
		console.warn(
			`Leap failed: Missing position for ${sourceId} or ${targetId}`,
		);
		return;
	}

	const { x: offsetX, y: offsetY } = offset;

	const facing = calculateFacing(sourcePos, targetPos);

	const leapVariant: UnitTransform = {
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
		[sourceId]: leapVariant,
	}));

	await new Promise((resolve) => setTimeout(resolve, durationMs));
};
export const executeShake = async (
	unitId: string,
	shakeAmount = 3,
	shakeWidth = 6,
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

		const keyframeX = [currentX];
		for (let i = 0; i < shakeAmount; i++) {
			keyframeX.push(currentX - shakeWidth);
			keyframeX.push(currentX + shakeWidth);
		}
		keyframeX.push(currentX); 

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

export const executeGrow = async (
	unitId: string,
	scale = 1.5,
	durationMs = 600,
	setTransforms: SetTransforms,
) => {
	const growVariant: UnitTransform = {
		scale,
		transition: {
			scale: {
				type: 'spring',
				stiffness: 180,
				damping: 9,
				mass: 0.9,
			},
		},
	};

	setTransforms((prev) => ({
		...prev,
		[unitId]: { ...prev[unitId], ...growVariant },
	}));

	await new Promise((resolve) => setTimeout(resolve, durationMs));
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

	await new Promise((resolve) => setTimeout(resolve, durationMs));
};
export const executePlantRecoil = async (
	defenderId: string,
	attackerId: string,
	durationMs = 1000,
	positions: Record<string, Position>,
	setTrapStates: SetTrapStates,
) => {
	const dir = getLeanDirection(attackerId, defenderId, positions);
	await executePlantSway(
		defenderId,
		dir,
		durationMs,
		setTrapStates,
		'recoil',
	);
};

export const executePlantAttack = async (
	attackerId: string,
	defenderId: string,
	durationMs = 1000,
	positions: Record<string, Position>,
	setTrapStates: SetTrapStates,
) => {
	const dir = getLeanDirection(attackerId, defenderId, positions);
	await executePlantSway(
		attackerId,
		dir,
		durationMs,
		setTrapStates,
		'attack',
	);
};

const getLeanDirection = (
	fromId: string,
	toId: string,
	positions: Record<string, Position>,
) => {
	const fromPos = positions[fromId];
	const toPos = positions[toId];
	if (!fromPos || !toPos) return 1;
	const dx = toPos.x - fromPos.x;
	return dx !== 0 ? Math.sign(dx) : 1;
};

const executePlantSway = async (
	unitId: string,
	dir: number,
	durationMs: number,
	setTrapStates: SetTrapStates,
	type: 'recoil' | 'attack' = 'recoil',
) => {
	const sway: TargetAndTransition =
		type === 'attack'
			? {
					rotate: [0, -22 * dir, 45 * dir, 45 * dir, -5 * dir, 0],
					scaleY: [1, 0.85, 1.4, 1.4, 0.95, 1],
					scaleX: [1, 1.15, 0.75, 0.75, 1.05, 1],
					skewX: [0, 8 * dir, -16 * dir, -16 * dir, 2 * dir, 0],
					transition: {
						duration: durationMs / 1000,
						times: [0, 0.22, 0.5, 0.58, 0.82, 1],
						ease: 'easeOut',
					},
				}
			: {
					rotate: [
						0,
						32 * dir,
						38 * dir,
						-14 * dir,
						6 * dir,
						-2 * dir,
						0,
					],
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
		[unitId]: { ...prev[unitId], sway },
	}));

	await new Promise((resolve) => setTimeout(resolve, durationMs));

	setTrapStates((prev) => ({
		...prev,
		[unitId]: {
			...prev[unitId],
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

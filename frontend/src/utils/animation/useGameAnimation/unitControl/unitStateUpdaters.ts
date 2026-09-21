import {
	UnitFacing,
	type UnitTransform,
} from '../../../../constants/animationStates/unitStates';

type TransformMap = Record<string, UnitTransform>;

export const applyFacing =
	(unitId: string, facing: UnitFacing) =>
	(prev: TransformMap): TransformMap => ({
		...prev,
		[unitId]: {
			...prev[unitId],
			scaleX: facing === UnitFacing.LEFT ? -1 : 1,
			transition: { duration: 0.1, ease: 'easeOut' },
		},
	});

export const applyOffsetAndFacing =
	(unitId: string, offset: { x: number; y: number }, facing?: UnitFacing) =>
	(prev: TransformMap): TransformMap => ({
		...prev,
		[unitId]: {
			...prev[unitId],
			x: offset.x,
			y: offset.y,
			...(facing && { scaleX: facing === UnitFacing.LEFT ? -1 : 1 }),
			transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] },
		},
	});

export const resetUnitTransform =
	(unitId: string) =>
	(prev: TransformMap): TransformMap => ({
		...prev,
		[unitId]: {
			...prev[unitId],
			x: 0,
			y: 0,
			opacity: 1,
			transition: { duration: 0.15, ease: 'easeOut' },
		},
	});

export const applyOpacity =
	(unitId: string, opacity: number) =>
	(prev: TransformMap): TransformMap => ({
		...prev,
		[unitId]: {
			...prev[unitId],
			opacity,
			transition: { duration: 0.2, ease: 'linear' },
		},
	});

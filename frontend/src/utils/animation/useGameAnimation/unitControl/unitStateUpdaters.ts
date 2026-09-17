import type { UnitTransform } from './unitControl';

type TransformMap = Record<string, UnitTransform>;

export const applyFacing =
	(unitId: string, facing: 'left' | 'right') =>
	(prev: TransformMap): TransformMap => ({
		...prev,
		[unitId]: {
			...prev[unitId],
			scaleX: facing === 'left' ? -1 : 1,
			transition: { duration: 0.1, ease: 'easeOut' },
		},
	});

export const applyOffsetAndFacing =
	(
		unitId: string,
		offset: { x: number; y: number },
		facing?: 'left' | 'right',
	) =>
	(prev: TransformMap): TransformMap => ({
		...prev,
		[unitId]: {
			...prev[unitId],
			x: offset.x,
			y: offset.y,
			...(facing && { scaleX: facing === 'left' ? -1 : 1 }),
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

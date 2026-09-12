import type { UnitTransform } from './unitControl';

type TransformMap = Record<string, UnitTransform>;

export const applyFacing =
	(unitId: string, facing: 'left' | 'right') =>
	(prev: TransformMap): TransformMap => ({
		...prev,
		[unitId]: {
			facing,
			offset: prev[unitId]?.offset ?? { x: 0, y: 0 },
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
			facing: facing ?? prev[unitId]?.facing ?? 'right',
			offset,
		},
	});

export const resetUnitOffset =
	(unitId: string, fallbackFacing: 'left' | 'right' = 'right') =>
	(prev: TransformMap): TransformMap => ({
		...prev,
		[unitId]: {
			facing: prev[unitId]?.facing ?? fallbackFacing,
			offset: { x: 0, y: 0 },
		},
	});

export const resetUnitTransform =
	(unitId: string) =>
	(prev: TransformMap): TransformMap => ({
		...prev,
		[unitId]: {
			facing: prev[unitId]?.facing ?? 'right',
			offset: { x: 0, y: 0 },
		},
	});

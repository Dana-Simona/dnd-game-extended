import { useState, useCallback, useRef } from 'react';
import {
	VfxCategory,
	VfxTypes,
	VfxTypeToCategoryMap,
	type VfxItem,
} from '../../../../constants/animationStates/vfxStates';
import type { Position } from '../unitControl/unitCalculations';

const CATEGORY_DURATIONS: Record<VfxCategory, number> = {
	[VfxCategory.BANNER]: 1600,
	[VfxCategory.STAT]: 900,
	[VfxCategory.ROLL]: 1000,
	[VfxCategory.EFFECTS]: 500,
	[VfxCategory.PARTICLES]: 500,
	[VfxCategory.PROJECTILES]: 500,
};

const TYPE_DURATIONS: Partial<Record<VfxTypes, number>> = {
	[VfxTypes.EFFECTS_EXP]: 3200,
};

export const useVfxControl = (
	visualPositions: Record<string, Position> = {},
	tileSize: number = 32,
) => {
	const [activeVfxList, setActiveVfxList] = useState<VfxItem[]>([]);
	const nextIdRef = useRef(0);

	const spawnVFX = useCallback(
		async (
			type: VfxTypes,
			targetIds: string[],
			amount?: number,
			sourceId?: string,
		): Promise<void> => {
			const category = VfxTypeToCategoryMap[type];

			const duration =
				TYPE_DURATIONS[type] ?? CATEGORY_DURATIONS[category];

			const sourcePos = sourceId ? visualPositions[sourceId] : undefined;
			const sourceX = sourcePos
				? (sourcePos.x + 0.5) * tileSize
				: undefined;
			const sourceY = sourcePos
				? (sourcePos.y + 0.5) * tileSize
				: undefined;

			const targets = targetIds.length > 0 ? targetIds : ['screen'];

			const newItems: VfxItem[] = targets.map((targetId) => {
				const pos = visualPositions[targetId] || { x: 0, y: 0 };
				return {
					id: `vfx-${type}-${Date.now()}-${nextIdRef.current++}`,
					type,
					category,
					targetId,
					sourceId,
					sourceX,
					sourceY,
					amount,
					x: (pos.x + 0.5) * tileSize,
					y: (pos.y + 0.5) * tileSize,
				};
			});

			setActiveVfxList((prev) => [...prev, ...newItems]);

			return new Promise((resolve) => {
				setTimeout(() => {
					const idsToRemove = new Set(
						newItems.map((item) => item.id),
					);
					setActiveVfxList((prev) =>
						prev.filter((item) => !idsToRemove.has(item.id)),
					);
					resolve();
				}, duration);
			});
		},
		[visualPositions, tileSize],
	);

	return { spawnVFX, activeVfxList };
};

export type UseVfxControlReturn = ReturnType<typeof useVfxControl>;
export type SpawnVfxFn = UseVfxControlReturn['spawnVFX'];

import { useState, useCallback, useRef } from 'react';
import type { Position } from '../../../constants/cameraControl';

export const VfxTypes = {
	ALERT_WIN: 'Win',
	ALERT_LEVEL_UP: 'LevelUp',
	ALERT_NEXT_LEVEL: 'NextLevel',
	ALERT_LOSE: 'Lose',
	ABILITY_CAST: 'AbilityCast',
	ROLL_ATTACK: 'RollAttack',
	ROLL_DEFENSE: 'RollDefense',
	STAT_DAMAGE: 'Damage',
	STAT_HEAL: 'Heal',
	STAT_EXP: 'Exp',
} as const;

export type VfxTypes = (typeof VfxTypes)[keyof typeof VfxTypes];

export interface VfxItem {
	id: string;
	type: VfxTypes;
	category: 'ALERT' | 'STAT' | 'ROLL' | 'ABILITY';
	targetId?: string;
	amount?: number;
	x: number;
	y: number;
}

const CATEGORY_DURATIONS = {
	ALERT: 1600,
	STAT: 900,
	ROLL: 1000,
	ABILITY: 500,
};

export const useVfxControl = (
	visualPositions: Record<string, Position> = {},
	tileSize: number = 32,
) => {
	const [activeVfxList, setActiveVfxList] = useState<VfxItem[]>([]);
	const nextIdRef = useRef(0);

	const getCategory = (type: VfxTypes): VfxItem['category'] => {
		if (type.startsWith('Roll')) return 'ROLL';
		if (type === 'Damage' || type === 'Heal' || type === 'Exp')
			return 'STAT';
		if (type === 'AbilityCast') return 'ABILITY';
		return 'ALERT';
	};

	const spawnVFX = useCallback(
		async (
			type: VfxTypes,
			targetIds: string[],
			amount?: number,
		): Promise<void> => {
			const category = getCategory(type);
			const duration = CATEGORY_DURATIONS[category];

			const targets = targetIds.length > 0 ? targetIds : ['screen'];

			const newItems: VfxItem[] = targets.map((targetId) => {
				const pos = visualPositions[targetId] || { x: 0, y: 0 };
				return {
					id: `vfx-${type}-${Date.now()}-${nextIdRef.current++}`,
					type,
					category,
					targetId,
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

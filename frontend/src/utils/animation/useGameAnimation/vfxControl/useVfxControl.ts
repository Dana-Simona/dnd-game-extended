import { useState, useCallback, useRef, useMemo } from 'react';
import type { Position } from '../unitControl/unitCalculations';
import {
	VfxCategory,
	VfxTypes,
	VfxTypeToCategoryMap,
	type VfxItem,
	type TriggerVfxAPI,
} from '../../../../constants/animationStates/vfxStates';

const CATEGORY_DURATIONS: Record<VfxCategory, number> = {
	[VfxCategory.SCREEN_COLOR]: 500,
	[VfxCategory.BACK]: 600,
	[VfxCategory.FRONT]: 800,
	[VfxCategory.PORTAL]: 1200,
};

const TYPE_DURATIONS: Partial<Record<VfxTypes, number>> = {
	[VfxTypes.EXP_ORBS]: 3200,
	[VfxTypes.LIGHTNING_STRIKE]: 800,
};

export interface UseVfxControlReturn {
	activeVfxList: VfxItem[];
	triggerVfx: TriggerVfxAPI;
	spawnVFX: (
		type: VfxTypes,
		targetIds: string[],
		amount?: number,
		sourceId?: string,
		extraProps?: Partial<VfxItem>,
		customDurationMs?: number,
		isPersistent?: boolean,
	) => Promise<void>;
	removeVfxType: (type: VfxTypes) => void;
	resetVfxList: () => void;
}

export const useVfxControl = (
	visualPositions: Record<string, Position> = {},
	tileSize: number = 32,
): UseVfxControlReturn => {
	const [activeVfxList, setActiveVfxList] = useState<VfxItem[]>([]);
	const nextIdRef = useRef(0);

	const spawnVFX = useCallback(
		async (
			type: VfxTypes,
			targetIds: string[],
			amount?: number,
			sourceId?: string,
			extraProps?: Partial<VfxItem>,
			customDurationMs?: number,
			isPersistent: boolean = false,
		): Promise<void> => {
			const category = VfxTypeToCategoryMap[type];

			const duration =
				customDurationMs ??
				TYPE_DURATIONS[type] ??
				CATEGORY_DURATIONS[category];

			const sourcePos = sourceId ? visualPositions[sourceId] : undefined;
			const sourceX = sourcePos
				? (sourcePos.x + 0.5) * tileSize
				: undefined;
			const sourceY = sourcePos
				? (sourcePos.y + 0.5) * tileSize
				: undefined;

			const targets =
				targetIds.length > 0
					? targetIds
					: sourceId
						? [sourceId]
						: ['screen'];

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
					...extraProps,
				};
			});

			setActiveVfxList((prev) => [...prev, ...newItems]);

			if (duration <= 0) {
				return Promise.resolve();
			}

			return new Promise((resolve) => {
				setTimeout(() => {
					if (!isPersistent) {
						const idsToRemove = new Set(
							newItems.map((item) => item.id),
						);
						setActiveVfxList((prev) =>
							prev.filter((item) => !idsToRemove.has(item.id)),
						);
					}
					resolve();
				}, duration);
			});
		},
		[visualPositions, tileSize],
	);

	const removeVfxType = useCallback((type: VfxTypes) => {
		setActiveVfxList((prev) => prev.filter((item) => item.type !== type));
	}, []);

	const resetVfxList = useCallback(() => {
		setActiveVfxList([]);
	}, []);

	const triggerVfx = useMemo<TriggerVfxAPI>(
		() => ({
			statDamage: (targetId, amount) =>
				spawnVFX(VfxTypes.STAT_DAMAGE, [targetId], amount),
			statHeal: (targetId, amount) =>
				spawnVFX(VfxTypes.STAT_HEAL, [targetId], amount),
			statExp: (targetId, amount) =>
				spawnVFX(VfxTypes.STAT_EXP, [targetId], amount),
			rollAttack: (targetId, amount) =>
				spawnVFX(VfxTypes.ROLL_ATTACK, [targetId], amount),
			rollDefense: (targetId, amount) =>
				spawnVFX(VfxTypes.ROLL_DEFENSE, [targetId], amount),
			bleed: (sourceId, targetId) =>
				spawnVFX(VfxTypes.BLEED, [targetId], undefined, sourceId),
			expOrbs: (sourceId, amount) =>
				spawnVFX(VfxTypes.EXP_ORBS, [], amount, sourceId),
			iceGather: (sourceId) =>
				spawnVFX(VfxTypes.ICE_GATHER, [], undefined, sourceId),
			iceExplode: (sourceId) =>
				spawnVFX(VfxTypes.ICE_EXPLODE, [], undefined, sourceId),
			bloodDrip: (targetId) => spawnVFX(VfxTypes.BLOOD_DRIP, [targetId]),

			toggleIceFeet: async (targetId: string, visible: boolean) => {
				if (visible) {
					await spawnVFX(
						VfxTypes.ICE_FEET,
						[targetId],
						undefined,
						undefined,
						undefined,
						0,
						true,
					);
				} else {
					removeVfxType(VfxTypes.ICE_FEET);
				}
			},
			lightningStrike: (targetId) =>
				spawnVFX(VfxTypes.LIGHTNING_STRIKE, [targetId]),
			groundBreak: (targetId) =>
				spawnVFX(VfxTypes.GROUND_BREAK, [targetId]),
			dustLeap: (unitId) => spawnVFX(VfxTypes.DUST_LEAP, [unitId]),
			landingDust: (unitId) => spawnVFX(VfxTypes.DUST_LAND, [unitId]),
			slash: (targetId) => spawnVFX(VfxTypes.SLASH, [targetId]),

			toggleTargetSwirl: async (targetId: string, visible: boolean) => {
				if (visible) {
					await spawnVFX(
						VfxTypes.TARGET_SWIRL,
						[targetId],
						undefined,
						undefined,
						undefined,
						0,
						true,
					);
				} else {
					removeVfxType(VfxTypes.TARGET_SWIRL);
				}
			},
			knivesProjectile: (sourceId, targetId) =>
				spawnVFX(
					VfxTypes.KNIVES_PROJECTILE,
					[targetId],
					undefined,
					sourceId,
				),
			arrowProjectile: (sourceId, targetId) =>
				spawnVFX(
					VfxTypes.ARROW_PROJECTILE,
					[targetId],
					undefined,
					sourceId,
				),

			screenDarken: (durationMs = 500) =>
				spawnVFX(
					VfxTypes.SCREEN_DARKEN,
					[],
					undefined,
					undefined,
					{ durationMs },
					durationMs,
					true,
				),
			screenRedHue: (durationMs = 500) =>
				spawnVFX(
					VfxTypes.SCREEN_RED_HUE,
					[],
					undefined,
					undefined,
					{ durationMs },
					durationMs,
					true,
				),
			screenDesaturate: (durationMs = 500) =>
				spawnVFX(
					VfxTypes.SCREEN_DESATURATE,
					[],
					undefined,
					undefined,
					{ durationMs },
					durationMs,
					true,
				),
			screenRestoreColor: async (durationMs = 500) => {
				removeVfxType(VfxTypes.SCREEN_DESATURATE);
				removeVfxType(VfxTypes.SCREEN_RED_HUE);
				removeVfxType(VfxTypes.SCREEN_DARKEN);
				return spawnVFX(
					VfxTypes.SCREEN_RESTORE_COLOR,
					[],
					undefined,
					undefined,
					{ durationMs },
					durationMs,
					false,
				);
			},
			bannerLevelUp: (amount) =>
				spawnVFX(VfxTypes.BANNER_LEVEL_UP, [], amount),
			bannerLose: (amount) => spawnVFX(VfxTypes.BANNER_LOSE, [], amount),
			blackClouds: async (visible) => {
				if (visible) {
					await spawnVFX(
						VfxTypes.BLIZZARD_CLOUDS,
						[],
						undefined,
						undefined,
						{ visible },
						0,
						true,
					);
				} else {
					removeVfxType(VfxTypes.BLIZZARD_CLOUDS);
				}
			},
			ravensFlying: (durationMs = 1000) =>
				spawnVFX(
					VfxTypes.RAVENS_FLYING,
					[],
					undefined,
					undefined,
					{ durationMs },
					durationMs,
				),
			letterbox: async (visible) => {
				if (visible) {
					await spawnVFX(
						VfxTypes.LETTERBOX,
						[],
						undefined,
						undefined,
						{ visible },
						0,
						true,
					);
				} else {
					removeVfxType(VfxTypes.LETTERBOX);
				}
			},
			ashSmokeAmbient: async (enabled) => {
				if (enabled) {
					await spawnVFX(
						VfxTypes.ASH_SMOKE_AMBIENT,
						[],
						undefined,
						undefined,
						{ enabled },
						0,
						true,
					);
				} else {
					removeVfxType(VfxTypes.ASH_SMOKE_AMBIENT);
				}
			},
		}),
		[spawnVFX, removeVfxType],
	);

	return {
		activeVfxList,
		triggerVfx,
		spawnVFX,
		removeVfxType,
		resetVfxList,
	};
};

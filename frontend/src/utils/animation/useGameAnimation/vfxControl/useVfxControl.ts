import { useState, useCallback, useRef, useMemo } from 'react';
import {
	getTransformOffset,
	type Position,
} from '../unitControl/unitCalculations';
import type { UnitTransform } from '../../../../constants/animationStates/unitStates';
import {
	ARROW_FADE_MS,
	ARROW_FLIGHT_MS,
	ARROW_HOLD_MS,
	LEVEL_TRANSITION_MS,
	NEXT_LEVEL_BANNER_MS,
	VfxCategory,
	VfxTypes,
	VfxTypeToCategoryMap,
	type VfxItem,
	type TriggerVfxAPI,
} from '../../../../constants/animationStates/vfxStates';

const CATEGORY_DURATIONS: Record<VfxCategory, number> = {
	[VfxCategory.SCREEN_COLOR]: 500,
	[VfxCategory.BACK]: 1000,
	[VfxCategory.FRONT]: 800,
	[VfxCategory.PORTAL]: 1200,
};

const TYPE_DURATIONS: Partial<Record<VfxTypes, number>> = {
	[VfxTypes.EXP_ORBS]: 3200,
	[VfxTypes.LIGHTNING_STRIKE]: 800,
	[VfxTypes.BLOOD_DRIP]: 5000,
	[VfxTypes.EFFECTS_HEAL]: 3000,
	[VfxTypes.BANNER_LEVEL_UP]: 3000,
	[VfxTypes.BANNER_NEXT_LEVEL]: NEXT_LEVEL_BANNER_MS,
	[VfxTypes.BOSS_SPELL]: 3000,
	[VfxTypes.ARROW_PROJECTILE]: 7000,
	[VfxTypes.GROUND_BREAK]: 5000,
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
	unitTransforms: Record<string, UnitTransform> = {},
): UseVfxControlReturn => {
	const [activeVfxList, setActiveVfxList] = useState<VfxItem[]>([]);
	const nextIdRef = useRef(0);

	const unitTransformsRef = useRef(unitTransforms);
	unitTransformsRef.current = unitTransforms;

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
			effectHeal: (targetId) => {
				const tile = visualPositions[targetId] ?? { x: 0, y: 0 };
				const offset = getTransformOffset(
					unitTransformsRef.current[targetId],
				);
				return spawnVFX(
					VfxTypes.EFFECTS_HEAL,
					[targetId],
					undefined,
					undefined,
					{
						x: (tile.x + 0.5) * tileSize + offset.x,
						y: (tile.y + 0.5) * tileSize + offset.y,
					},
				);
			},
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
			bossSpell: (targetId) => spawnVFX(VfxTypes.BOSS_SPELL, [targetId]),

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
			arrowProjectile: (sourceId, targetId, options = {}) => {
				const holdMs = options.holdMs ?? ARROW_HOLD_MS;
				const flightMs = options.flightMs ?? ARROW_FLIGHT_MS;
				return spawnVFX(
					VfxTypes.ARROW_PROJECTILE,
					[targetId],
					undefined,
					sourceId,
					{
						sourceOffsetX: options.sourceOffset?.x ?? 0,
						sourceOffsetY: options.sourceOffset?.y ?? 0,
						holdMs,
						flightMs,
					},
					holdMs + flightMs + ARROW_FADE_MS,
				);
			},
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
			bannerNextLevel: (amount) =>
				spawnVFX(VfxTypes.BANNER_NEXT_LEVEL, [], amount),
			bannerLose: (amount) => spawnVFX(VfxTypes.BANNER_LOSE, [], amount),
			levelTransition: async (covered, amount) => {
				if (covered) {
					await spawnVFX(
						VfxTypes.LEVEL_TRANSITION,
						[],
						amount,
						undefined,
						{ durationMs: LEVEL_TRANSITION_MS },
						LEVEL_TRANSITION_MS,
						true,
					);
				} else {
					setActiveVfxList((prev) =>
						prev.map((item) =>
							item.type === VfxTypes.LEVEL_TRANSITION
								? { ...item, visible: false }
								: item,
						),
					);
					await new Promise((resolve) =>
						setTimeout(resolve, LEVEL_TRANSITION_MS),
					);
					removeVfxType(VfxTypes.LEVEL_TRANSITION);
				}
			},
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
			bannerGoal: (bossName, isBossLevel) =>
				spawnVFX(VfxTypes.BANNER_GOAL, [], undefined, undefined, {
					text: bossName,
					isBoss: isBossLevel,
				}),
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
		[spawnVFX, removeVfxType, visualPositions, tileSize],
	);

	return {
		activeVfxList,
		triggerVfx,
		spawnVFX,
		removeVfxType,
		resetVfxList,
	};
};

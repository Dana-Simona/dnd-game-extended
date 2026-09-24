import { useState, useCallback, useRef, useMemo } from 'react';
import {
	VfxCategory,
	VfxTypes,
	VfxTypeToCategoryMap,
	type VfxItem,
	type TriggerVfxAPI,
	type BloodColor,
} from '../../../../constants/animationStates/vfxStates';
import type { Position } from '../unitControl/unitCalculations';

const CATEGORY_DURATIONS: Record<VfxCategory, number> = {
	[VfxCategory.BANNER]: 1600,
	[VfxCategory.STAT]: 900,
	[VfxCategory.ROLL]: 1000,
	[VfxCategory.EFFECTS]: 500,
	[VfxCategory.PARTICLES]: 500,
	[VfxCategory.PROJECTILES]: 500,
	[VfxCategory.WORLD]: 600,
	[VfxCategory.SCREEN]: 500,
	[VfxCategory.OVERLAY]: 1000,
};

const TYPE_DURATIONS: Partial<Record<VfxTypes, number>> = {
	[VfxTypes.EFFECTS_EXP]: 3200,
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
					...extraProps,
				};
			});

			setActiveVfxList((prev) => [...prev, ...newItems]);

			if (duration <= 0) {
				return Promise.resolve();
			}

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

	const removeVfxType = useCallback((type: VfxTypes) => {
		setActiveVfxList((prev) => prev.filter((item) => item.type !== type));
	}, []);

	const resetVfxList = useCallback(() => {
		setActiveVfxList([]);
	}, []);

	const triggerVfx = useMemo<TriggerVfxAPI>(
		() => ({
			// 1. Floating UI & Stat Popups
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

			// 2. Particle Systems
			bleed: (sourceId, targetId, color) =>
				spawnVFX(
					VfxTypes.BLEED,
					[targetId],
					undefined,
					sourceId,
					color ? { color: color as BloodColor } : undefined,
				),
			effectsExp: (sourceId, amount) =>
				spawnVFX(VfxTypes.EFFECTS_EXP, [], amount, sourceId),
			iceGather: (sourceId) =>
				spawnVFX(VfxTypes.ICE_GATHER, [], undefined, sourceId),
			iceExplode: (sourceId) =>
				spawnVFX(VfxTypes.ICE_EXPLODE, [], undefined, sourceId),
			bloodDrip: (targetId, color) =>
				spawnVFX(
					VfxTypes.BLOOD_DRIP_SPLASH,
					[targetId],
					undefined,
					undefined,
					{ color },
				),

			// 3. Spritesheet & World-Anchored Effects
			iceFeet: (targetId) => spawnVFX(VfxTypes.ICE_FEET, [targetId]),
			lightningStrike: (targetId) =>
				spawnVFX(VfxTypes.LIGHTNING_STRIKE, [targetId]),
			iceHit: (targetId) => spawnVFX(VfxTypes.ICE_HIT, [targetId]),
			groundBreak: (targetId) =>
				spawnVFX(VfxTypes.GROUND_BREAK, [targetId]),
			dustLeap: (unitId) => spawnVFX(VfxTypes.DUST_LEAP, [unitId]),
			landingSmoke: (unitId) =>
				spawnVFX(VfxTypes.LANDING_SMOKE, [unitId]),
			slash: (targetId) => spawnVFX(VfxTypes.SLASH, [targetId]),
			targetSwirl: (targetId) =>
				spawnVFX(VfxTypes.TARGET_SWIRL, [targetId]),
			projectile: (projectileType, sourceId, targetId) =>
				spawnVFX(VfxTypes.PROJECTILE, [targetId], undefined, sourceId, {
					projectileType,
				}),

			// 4. Screen Shaders & Post-Processing
			screenDarken: (durationMs = 500) =>
				spawnVFX(
					VfxTypes.SCREEN_DARKEN,
					[],
					undefined,
					undefined,
					{ durationMs },
					durationMs,
				),
			screenRedHue: (durationMs = 500) =>
				spawnVFX(
					VfxTypes.SCREEN_RED_HUE,
					[],
					undefined,
					undefined,
					{ durationMs },
					durationMs,
				),
			screenDesaturate: (excludeActiveLayer = false) =>
				spawnVFX(
					VfxTypes.SCREEN_DESATURATE,
					[],
					undefined,
					undefined,
					{ excludeActiveLayer },
					0,
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
				);
			},

			// 5. Banners & Portal Overlays
			bannerLevelUp: (amount) =>
				spawnVFX(VfxTypes.BANNER_LEVEL_UP, [], amount),
			bannerLose: (amount) => spawnVFX(VfxTypes.BANNER_LOSE, [], amount),
			blackClouds: async (visible) => {
				if (visible) {
					await spawnVFX(
						VfxTypes.BLACK_CLOUDS,
						[],
						undefined,
						undefined,
						{ visible },
						0,
					);
				} else {
					removeVfxType(VfxTypes.BLACK_CLOUDS);
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

import { AnimationPhase } from '../sprite/Sprite';
import { animationRegistry } from './animationRegistry';
import { VfxTypes } from './useGameAnimation/vfxControl/vfxTypes';
import { ActionType, type GameEvent } from '../../constants/gameEvent';
import type { SpawnVfxFn } from './useGameAnimation/vfxControl/useVfxControl';
import type { PlayUnitAnimationFn } from './useGameAnimation/spriteAnimationControl/useAnimationControl';
import {
	CameraPreset,
	type CameraCommand,
} from './useGameAnimation/cameraControl/cameraControl';
import {
	UnitPreset,
	type TriggerUnit,
} from './useGameAnimation/unitControl/unitControl';
import {
	HpBarPreset,
	type TriggerHpBar,
} from './useGameAnimation/hpBarControl/useHpBarControl';

export interface Controllers {
	playUnitAnimation: PlayUnitAnimationFn;
	spawnVFX: SpawnVfxFn;
	triggerCamera: (command: CameraCommand) => Promise<void>;
	triggerUnit: TriggerUnit;
	triggerHpBar: TriggerHpBar;
}

export const setupAnimations = (controllers: Controllers) => {
	animationRegistry.register(ActionType.MOVE, async (event: GameEvent) => {
		if (!event.sourceId) return;
		await controllers.playUnitAnimation(event.sourceId, ActionType.MOVE);
	});

	animationRegistry.register(ActionType.DIE, async (event: GameEvent) => {
		if (!event.sourceId) return;
		await Promise.all([
			controllers.playUnitAnimation(event.sourceId, ActionType.DIE),
			controllers.triggerCamera({
				type: CameraPreset.SHAKE,
				intensity: 15,
				duration: 300,
			}),
			controllers.triggerUnit({
				type: UnitPreset.FADE_OUT,
				unitId: event.sourceId,
				delayMs: 400,
				durationMs: 200,
			}),
		]);
	});

	animationRegistry.register(ActionType.MELEE, async (event: GameEvent) => {
		const defender = event.targetIds?.[0];
		const attacker = event.sourceId;
		if (!event.sourceId || !defender) return;

		await Promise.all([
			controllers.triggerUnit({
				type: UnitPreset.FACE,
				sourceId: attacker,
				targetId: defender,
			}),
			controllers.triggerUnit({
				type: UnitPreset.FACE,
				sourceId: defender,
				targetId: attacker,
			}),
		]);

		await Promise.all([
			controllers.playUnitAnimation(
				attacker,
				ActionType.MELEE,
				AnimationPhase.WINDUP,
			),
			controllers.playUnitAnimation(
				defender,
				ActionType.TAKE_DAMAGE,
				AnimationPhase.WINDUP,
			),
			controllers.triggerHpBar?.({
				type: HpBarPreset.SHOW_DAMAGE_PREVIEW,
				unitId: defender,
				damage: event.amount || 0,
			}),
		]);

		await Promise.all([
			controllers.playUnitAnimation(
				defender,
				ActionType.TAKE_DAMAGE,
				AnimationPhase.FOLLOW_THROUGH,
			),
			controllers.triggerCamera({ type: CameraPreset.SHAKE }),
			controllers.spawnVFX(
				VfxTypes.PARTICLES_DAMAGE,
				[defender],
				event.amount,
				attacker,
			),
			controllers.triggerUnit({
				sourceId: defender,
				type: UnitPreset.DASH,
				targetId: attacker,
				distancePx: -25,
				durationMs: 1000,
			}),
		]);

		await Promise.all([
			controllers.playUnitAnimation(
				attacker,
				ActionType.MELEE,
				AnimationPhase.FOLLOW_THROUGH,
			),
			controllers.triggerUnit({
				type: UnitPreset.RESET,
				unitId: defender,
			}),
			controllers.triggerHpBar?.({
				type: HpBarPreset.DEPLETE_HP,
				unitId: defender,
			}),
		]);
	});

	animationRegistry.register(ActionType.COMBAT, async (event: GameEvent) => {
		const targetId = event.targetIds?.[0];
		if (!event.sourceId || !targetId) return;
		await controllers.triggerCamera({
			type: CameraPreset.ZOOM_TWO_TARGETS,
			targetIds: [event.sourceId, ...event.targetIds],
		});
		await Promise.all([
			controllers.triggerUnit({
				type: UnitPreset.FACE,
				sourceId: event.sourceId,
				targetId,
			}),
			controllers.triggerUnit({
				type: UnitPreset.FACE,
				sourceId: targetId,
				targetId: event.sourceId,
			}),
		]);
	});

	animationRegistry.register(
		ActionType.ABILITY_CAST,
		async (event: GameEvent) => {
			if (
				!event.sourceId ||
				!event.targetIds ||
				event.targetIds.length === 0
			)
				return;

			await controllers.triggerCamera({
				type: CameraPreset.ZOOM_IN,
				targetIds: [event.sourceId],
			});

			await controllers.playUnitAnimation(
				event.sourceId,
				ActionType.ABILITY_CAST,
			);

			for (const targetId of event.targetIds) {
				if (event.amount) {
					controllers.triggerHpBar?.({
						type: HpBarPreset.SHOW_DAMAGE_PREVIEW,
						unitId: targetId,
						damage: event.amount,
					});
				}

				await controllers.triggerCamera({
					type: CameraPreset.FOCUS_TARGET,
					targetIds: [targetId],
				});

				await controllers.spawnVFX(
					VfxTypes.EFFECTS_ABILITY_CAST,
					[targetId],
					event.amount,
				);

				controllers.triggerHpBar?.({
					type: HpBarPreset.DEPLETE_HP,
					unitId: targetId,
				});
			}
		},
	);

	animationRegistry.register(ActionType.GAIN_XP, async (event: GameEvent) => {
		if (!event.sourceId) return;
		await controllers.spawnVFX(
			VfxTypes.STAT_EXP,
			[event.sourceId],
			event.amount,
		);
	});

	animationRegistry.register(ActionType.HEAL, async (event: GameEvent) => {
		if (!event.sourceId) return;
		controllers.triggerHpBar?.({
			type: HpBarPreset.DEPLETE_HP,
			unitId: event.sourceId,
		});
		await controllers.spawnVFX(
			VfxTypes.STAT_HEAL,
			[event.sourceId],
			event.amount,
		);
	});

	animationRegistry.register(
		ActionType.LEVEL_UP,
		async (event: GameEvent) => {
			if (!event.sourceId) return;
			await controllers.spawnVFX(
				VfxTypes.BANNER_LEVEL_UP,
				[event.sourceId],
				event.amount,
			);
		},
	);

	animationRegistry.register(ActionType.LOSE, async (event: GameEvent) => {
		if (!event.sourceId) return;
		await controllers.triggerCamera({ type: CameraPreset.ZOOM_IN });
		await controllers.triggerCamera({ type: CameraPreset.THUMP });
		await controllers.spawnVFX(
			VfxTypes.BANNER_LOSE,
			[event.sourceId],
			event.amount,
		);
	});

	animationRegistry.register(
		ActionType.NEXT_LEVEL,
		async (event: GameEvent) => {
			if (!event.sourceId) return;
		},
	);

	animationRegistry.register(
		ActionType.ROLL_ATTACK,
		async (event: GameEvent) => {
			if (!event.sourceId) return;
			await controllers.spawnVFX(
				VfxTypes.ROLL_ATTACK,
				[event.sourceId],
				event.amount,
			);
		},
	);

	animationRegistry.register(
		ActionType.ROLL_DEFENSE,
		async (event: GameEvent) => {
			if (!event.sourceId) return;
			await controllers.spawnVFX(
				VfxTypes.ROLL_DEFENSE,
				[event.sourceId],
				event.amount,
			);
		},
	);

	animationRegistry.register(
		ActionType.TAKE_DAMAGE,
		async (event: GameEvent) => {
			if (!event.sourceId) return;
			await controllers.spawnVFX(
				VfxTypes.STAT_DAMAGE,
				[event.sourceId],
				event.amount,
			);
		},
	);

	animationRegistry.register(
		ActionType.TAKE_DAMAGE_FROM_ABILITY,
		async (event: GameEvent) => {
			if (!event.sourceId) return;
			await Promise.all([
				controllers.playUnitAnimation(
					event.sourceId,
					ActionType.TAKE_DAMAGE,
				),
				controllers.spawnVFX(
					VfxTypes.STAT_DAMAGE,
					[event.sourceId],
					event.amount,
				),
				controllers.triggerHpBar({
					type: HpBarPreset.SHOW_DAMAGE_PREVIEW,
					unitId: event.sourceId,
					damage: event.amount || 0,
				}),
			]);
			controllers.triggerHpBar({
				type: HpBarPreset.DEPLETE_HP,
				unitId: event.sourceId,
			});
		},
	);

	animationRegistry.register(ActionType.WIN, async (event: GameEvent) => {
		if (!event.sourceId) return;
	});
};

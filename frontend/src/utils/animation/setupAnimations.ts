import { animationRegistry } from './animationRegistry';
import { ActionType, type GameEvent } from '../../constants/gameEvent';
import {
	VfxTypes,
	type TriggerVfx,
} from '../../constants/animationStates/vfxStates';
import {
	UnitPreset,
	type TriggerUnit,
} from '../../constants/animationStates/unitStates';
import {
	HpBarPreset,
	type TriggerHpBar,
} from './useGameAnimation/hpBarControl/useHpBarControl';
import {
	AnimationPhase,
	SpritePresets,
	type TriggerSpriteAnimation,
} from '../../constants/animationStates/spriteStates';
import {
	CameraPreset,
	type TriggerCamera,
} from '../../constants/animationStates/cameraStates';
import { type Unit } from '../../constants/interfaces/unit';

interface Controllers {
	triggerSpriteAnimation: TriggerSpriteAnimation;
	triggerVfx: TriggerVfx;
	triggerCamera: TriggerCamera;
	triggerUnit: TriggerUnit;
	triggerHpBar: TriggerHpBar;
	getUnitById: (id: string) => Unit | undefined;
}

export const setupAnimations = (controllers: Controllers) => {
	animationRegistry.register(ActionType.MOVE, async (event: GameEvent) => {
		if (!event.sourceId) return;

		await controllers.triggerSpriteAnimation({
			type: SpritePresets.MOVE,
			unitId: event.sourceId,
		});
	});

	animationRegistry.register(ActionType.DIE, async (event: GameEvent) => {
		if (!event.sourceId) return;

		controllers.triggerSpriteAnimation({
			type: SpritePresets.DIE,
			unitId: event.sourceId,
		});
		await new Promise((resolve) => setTimeout(resolve, 300)),

		await controllers.triggerUnit({
			type: UnitPreset.FADE_OUT,
			unitId: event.sourceId,
			delayMs: 400,
			durationMs: 200,
		});
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
			controllers.triggerSpriteAnimation({
				type: SpritePresets.MELEE,
				unitId: attacker,
				phase: AnimationPhase.WINDUP,
			}),
			controllers.triggerSpriteAnimation({
				type: SpritePresets.TAKE_DAMAGE,
				unitId: defender,
				phase: AnimationPhase.WINDUP,
			}),
		]);

		await Promise.all([
			controllers.triggerSpriteAnimation({
				type: SpritePresets.TAKE_DAMAGE,
				unitId: defender,
				phase: AnimationPhase.FOLLOW_THROUGH,
			}),
			controllers.triggerCamera({ type: CameraPreset.SHAKE }),
			controllers.triggerVfx({
				type: VfxTypes.PARTICLES_DAMAGE,
				targetIds: [defender],
				amount: event.amount,
				sourceId: attacker,
			}),
			controllers.triggerUnit({
				type: UnitPreset.DASH,
				sourceId: defender,
				targetId: attacker,
				distancePx: -25,
				durationMs: 1000,
			}),
			controllers.triggerHpBar({
				type: HpBarPreset.SHOW_DAMAGE_PREVIEW,
				unitId: defender,
				damage: event.amount || 0,
			}),
		]);

		const unit = controllers.getUnitById(defender);
		let finalHealth;
		if (!!unit && !!event.amount)
			finalHealth = unit.currentHealth - event.amount;
		const isDead = !!finalHealth && finalHealth <= 0;

		await Promise.all([
			controllers.triggerSpriteAnimation({
				type: SpritePresets.MELEE,
				unitId: attacker,
				phase: AnimationPhase.FOLLOW_THROUGH,
			}),
			!isDead &&
				controllers.triggerUnit({
					type: UnitPreset.RESET,
					unitId: defender,
				}),
			controllers.triggerHpBar({
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

			await controllers.triggerSpriteAnimation({
				type: SpritePresets.ABILITY_CAST,
				unitId: event.sourceId,
			});

			for (const targetId of event.targetIds) {
				if (event.amount) {
					controllers.triggerHpBar({
						type: HpBarPreset.SHOW_DAMAGE_PREVIEW,
						unitId: targetId,
						damage: event.amount,
					});
				}

				await controllers.triggerCamera({
					type: CameraPreset.FOCUS_TARGET,
					targetIds: [targetId],
				});

				await controllers.triggerVfx({
					type: VfxTypes.EFFECTS_ABILITY_CAST,
					targetIds: [targetId],
					amount: event.amount,
				});

				controllers.triggerHpBar({
					type: HpBarPreset.DEPLETE_HP,
					unitId: targetId,
				});
			}
		},
	);

	animationRegistry.register(ActionType.GAIN_XP, async (event: GameEvent) => {
		if (!event.sourceId) return;
		await controllers.triggerVfx({
			type: VfxTypes.STAT_EXP,
			targetIds: [event.sourceId],
			amount: event.amount,
		});
	});

	animationRegistry.register(ActionType.HEAL, async (event: GameEvent) => {
		if (!event.sourceId) return;
		controllers.triggerHpBar({
			type: HpBarPreset.DEPLETE_HP,
			unitId: event.sourceId,
		});
		await controllers.triggerVfx({
			type: VfxTypes.STAT_HEAL,
			targetIds: [event.sourceId],
			amount: event.amount,
		});
	});

	animationRegistry.register(
		ActionType.LEVEL_UP,
		async (event: GameEvent) => {
			if (!event.sourceId) return;
			await controllers.triggerVfx({
				type: VfxTypes.BANNER_LEVEL_UP,
				targetIds: [event.sourceId],
				amount: event.amount,
			});
		},
	);

	animationRegistry.register(ActionType.LOSE, async (event: GameEvent) => {
		if (!event.sourceId) return;
		await controllers.triggerCamera({ type: CameraPreset.ZOOM_IN });
		await controllers.triggerCamera({ type: CameraPreset.THUMP });
		await controllers.triggerVfx({
			type: VfxTypes.BANNER_LOSE,
			targetIds: [event.sourceId],
			amount: event.amount,
		});
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
			await controllers.triggerVfx({
				type: VfxTypes.ROLL_ATTACK,
				targetIds: [event.sourceId],
				amount: event.amount,
			});
		},
	);

	animationRegistry.register(
		ActionType.ROLL_DEFENSE,
		async (event: GameEvent) => {
			if (!event.sourceId) return;
			await controllers.triggerVfx({
				type: VfxTypes.ROLL_DEFENSE,
				targetIds: [event.sourceId],
				amount: event.amount,
			});
		},
	);

	animationRegistry.register(
		ActionType.TAKE_DAMAGE,
		async (event: GameEvent) => {
			if (!event.sourceId) return;
			await controllers.triggerVfx({
				type: VfxTypes.STAT_DAMAGE,
				targetIds: [event.sourceId],
				amount: event.amount,
			});
		},
	);

	animationRegistry.register(
		ActionType.TAKE_DAMAGE_FROM_ABILITY,
		async (event: GameEvent) => {
			if (!event.sourceId) return;
			await Promise.all([
				controllers.triggerSpriteAnimation({
					type: SpritePresets.TAKE_DAMAGE,
					unitId: event.sourceId,
				}),
				controllers.triggerVfx({
					type: VfxTypes.STAT_DAMAGE,
					targetIds: [event.sourceId],
					amount: event.amount,
				}),
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

import { animationRegistry } from './animationRegistry';
import { VfxTypes } from './useGameAnimation/useVfxControl';
import { ActionType, type GameEvent } from '../../constants/gameEvent';
import {
	CameraPreset,
	type CameraCommand,
} from './useGameAnimation/cameraControl/cameraControl';
import {
	UnitPreset,
	type TriggerUnit,
} from './useGameAnimation/unitControl/unitControl';

export interface Controllers {
	playUnitAnimation: (unitId: string, anim: ActionType) => Promise<void>;
	spawnVFX: (
		type: VfxTypes,
		targetIds: string[],
		amount?: number,
	) => Promise<void>;
	triggerCamera: (command: CameraCommand) => Promise<void>;
	triggerUnit: TriggerUnit;
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
		const targetId = event.targetIds?.[0];
		if (!event.sourceId || !targetId) return;

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

		const spriteAnimationPromise = controllers.playUnitAnimation(
			event.sourceId,
			ActionType.MELEE,
		);

		const dashPromise = controllers.triggerUnit({
			type: UnitPreset.DASH,
			sourceId: event.sourceId,
			targetId,
			distancePx: 30,
			durationMs: 180,
			delayMs: 300,
		});

		await Promise.all([spriteAnimationPromise, dashPromise]);
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
			await controllers.triggerCamera({
				type: CameraPreset.FOCUS_TARGET,
				targetIds: event.targetIds,
			});
			await controllers.spawnVFX(
				VfxTypes.ABILITY_CAST,
				event.targetIds,
				event.amount,
			);
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
				VfxTypes.ALERT_LEVEL_UP,
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
			VfxTypes.ALERT_LOSE,
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
			const attackerId = event.targetIds?.[0];
			await Promise.all([
				controllers.spawnVFX(
					VfxTypes.STAT_DAMAGE,
					[event.sourceId],
					event.amount,
				),
				attackerId
					? controllers.triggerUnit({
							type: UnitPreset.KNOCKBACK,
							targetId: event.sourceId,
							sourceId: attackerId,
							distancePx: 12,
							durationMs: 180,
						})
					: Promise.resolve(),
			]);
		},
	);

	animationRegistry.register(
		ActionType.TAKE_DAMAGE_FROM_ABILITY,
		async (event: GameEvent) => {
			if (!event.sourceId) return;
			await controllers.spawnVFX(
				VfxTypes.STAT_DAMAGE,
				[event.sourceId],
				event.amount,
			);
		},
	);

	animationRegistry.register(ActionType.WIN, async (event: GameEvent) => {
		if (!event.sourceId) return;
	});
};

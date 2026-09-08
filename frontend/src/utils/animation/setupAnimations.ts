import { animationRegistry } from './animationRegistry';
import { VfxTypes } from './useGameAnimation/useVfxControl';
import { ActionType, type GameEvent } from '../../constants/gameEvent';
import {
	CameraPreset,
	type CameraCommand,
} from '../../constants/cameraControl';

export interface Controllers {
	playUnitAnimation: (unitId: string, anim: ActionType) => Promise<void>;
	spawnVFX: (
		type: VfxTypes,
		targetIds: string[],
		amount?: number,
	) => Promise<void>;
	triggerCamera: (command: CameraCommand) => Promise<void>;
}

export const setupAnimations = (controllers: Controllers) => {
	animationRegistry.register(ActionType.MOVE, async (event: GameEvent) => {
		if (!event.sourceId) return;
		await controllers.playUnitAnimation(event.sourceId, ActionType.MOVE);
	});

	animationRegistry.register(ActionType.DIE, async (event: GameEvent) => {
		if (!event.sourceId) return;
		controllers.playUnitAnimation(event.sourceId, ActionType.DIE);
		await controllers.triggerCamera({
			type: CameraPreset.SHAKE,
			intensity: 15,
			duration: 300,
		});
	});

	animationRegistry.register(ActionType.MELEE, async (event: GameEvent) => {
		if (!event.sourceId) return;
		await controllers.playUnitAnimation(event.sourceId, ActionType.MELEE);
	});

	animationRegistry.register(ActionType.COMBAT, async (event: GameEvent) => {
		if (!event.sourceId || !event.targetIds) return;
		await controllers.triggerCamera({
			type: CameraPreset.ZOOM_TWO_TARGETS,
			targetIds: [event.sourceId, ...event.targetIds],
		});
	});

	animationRegistry.register(
		ActionType.ABILITY_CAST,
		async (event: GameEvent) => {
			if (!event.sourceId || !event.targetIds) return;
			await controllers.triggerCamera({
				type: CameraPreset.ZOOM_IN,
				targetIds: [event.sourceId],
			});
			await controllers.playUnitAnimation(
				event.sourceId,
				ActionType.ABILITY_CAST,
			);
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
			await controllers.spawnVFX(
				VfxTypes.STAT_DAMAGE,
				[event.sourceId],
				event.amount,
			);
		},
	);

	animationRegistry.register(ActionType.WIN, async (event: GameEvent) => {
		if (!event.sourceId || !event.targetIds) return;
	});
};

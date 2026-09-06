import {
	CameraPreset,
	type CameraCommand,
} from '../../constants/cameraControl';
import { ActionType } from '../../constants/gameEvent';
import { animationRegistry } from './animationRegistry';

export interface Controllers {
	playUnitAnimation: (unitId: string, anim: string) => Promise<void>;
	spawnVFX: (
		type: string,
		targetIds: string[],
		amount?: number,
	) => Promise<void>;
	triggerCamera: (command: CameraCommand) => Promise<void>;
}

export const setupAnimations = (controllers: Controllers) => {
	animationRegistry.register(ActionType.MOVE, async (event) => {
		if (!event.sourceId) return;
		await controllers.playUnitAnimation(event.sourceId, ActionType.MOVE);
	});

	animationRegistry.register(ActionType.DIE, async (event) => {
		if (!event.sourceId) return;
		await controllers.triggerCamera({
			type: CameraPreset.SHAKE,
			intensity: 15,
			duration: 300,
		});
		await controllers.playUnitAnimation(event.sourceId, ActionType.DIE);
	});

	animationRegistry.register(ActionType.MELEE, async (event) => {
		if (!event.sourceId) return;
		await controllers.triggerCamera({
			type: CameraPreset.THUMP,
		});
		await controllers.playUnitAnimation(event.sourceId, ActionType.MELEE);
	});

	animationRegistry.register(ActionType.COMBAT, async (event) => {
		if (!event.sourceId || !event.targetId) return;
		await controllers.triggerCamera({
			type: CameraPreset.ZOOM_TWO_TARGETS,
			targetIds: [event.sourceId, event.targetId],
			duration: 500,
		});
	});
};

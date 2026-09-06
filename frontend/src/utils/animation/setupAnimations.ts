import { ActionType } from '../../constants/gameEvent';
import { animationRegistry } from './animationRegistry';

export interface Controllers {
	playUnitAnimation: (unitId: string, anim: string) => Promise<void>;
	spawnVFX: (
		type: string,
		targetIds: string[],
		amount?: number,
	) => Promise<void>;
	triggerCamera: (type: string) => Promise<void>;
}

export const setupAnimations = (controllers: Controllers) => {
	animationRegistry.register(ActionType.MOVE, async (event) => {
		if (!event.sourceId) return;
		await controllers.playUnitAnimation(event.sourceId, ActionType.MOVE);
	});
};

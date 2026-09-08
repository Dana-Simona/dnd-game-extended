import { ActionType } from '../../constants/gameEvent';

export interface AnimMeta {
	width: number;
	height: number;
	frameCount: number;
	fps: number;
	offsetY?: number;
}

export const DEFAULT_ANIM_META: AnimMeta = {
	width: 24,
	height: 34,
	frameCount: 4,
	fps: 8,
};

export const SPRITE_MANIFEST: Record<
	string,
	Partial<Record<ActionType, AnimMeta>>
> = {
	player_warrior_jonsnow: {
		[ActionType.IDLE]: { width: 48, height: 48, frameCount: 8, fps: 4 },
		[ActionType.MOVE]: { width: 48, height: 48, frameCount: 6, fps: 8 },
		[ActionType.MELEE]: {
			width: 48,
			height: 48,
			frameCount: 11,
			fps: 12,
		},
	},
	enemy_skeleton: {
		[ActionType.IDLE]: { width: 24, height: 32, frameCount: 11, fps: 12 },
		[ActionType.MOVE]: { width: 22, height: 32, frameCount: 13, fps: 6 },
		[ActionType.DIE]: {
			width: 40,
			height: 32,
			frameCount: 7,
			fps: 10,
			offsetY: 5,
		},
	},
	enemy_goldcloak: {
		[ActionType.IDLE]: {
			width: 100,
			height: 100,
			frameCount: 6,
			fps: 10,
			offsetY: 36,
		},
		[ActionType.MOVE]: {
			width: 100,
			height: 100,
			frameCount: 6,
			fps: 12,
			offsetY: 36,
		},
		[ActionType.DIE]: {
			width: 100,
			height: 100,
			frameCount: 6,
			fps: 6,
			offsetY: 36,
		},
		[ActionType.MELEE]: {
			width: 100,
			height: 100,
			frameCount: 6,
			fps: 6,
			offsetY: 36,
		},
	},
};

import { ActionType } from '../../constants/gameEvent';
import type { SpriteProps } from '../sprite/Sprite';

type AnimMeta = Omit<SpriteProps, 'imagePath'>;

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
		[ActionType.IDLE]: {
			width: 130,
			height: 100,
			frameCount: 8,
			fps: 4,
			loop: true,
		},
		[ActionType.MOVE]: { width: 130, height: 100, frameCount: 6, fps: 4 },
		[ActionType.MELEE]: {
			width: 130,
			height: 100,
			frameCount: 11,
			fps: 4,
		},
	},
	player_mage_melisandre: {
		[ActionType.IDLE]: {
			width: 130,
			height: 100,
			frameCount: 8,
			fps: 4,
			loop: true,
		},
		[ActionType.MOVE]: { width: 130, height: 100, frameCount: 6, fps: 4 },
		[ActionType.MELEE]: {
			width: 130,
			height: 100,
			frameCount: 8,
			fps: 4,
		},
		[ActionType.ABILITY_CAST]: {
			width: 130,
			height: 100,
			frameCount: 12,
			fps: 4,
			loopStartFrame: 2,
		},
	},
	player_mage_thorosofmyr: {
		[ActionType.IDLE]: {
			width: 130,
			height: 100,
			frameCount: 8,
			fps: 4,
			loop: true,
		},
		[ActionType.MOVE]: { width: 130, height: 100, frameCount: 6, fps: 4 },
		[ActionType.MELEE]: {
			width: 130,
			height: 100,
			frameCount: 8,
			fps: 4,
		},
	},
	enemy_knight: {
		[ActionType.IDLE]: {
			width: 24,
			height: 32,
			frameCount: 11,
			fps: 12,
			loop: true,
		},
		[ActionType.MOVE]: { width: 22, height: 32, frameCount: 6, fps: 13 },
		[ActionType.DIE]: {
			width: 40,
			height: 32,
			frameCount: 7,
			fps: 10,
			offsetY: 5,
		},
		[ActionType.TAKE_DAMAGE]: {
			width: 40,
			height: 32,
			frameCount: 7,
			fps: 10,
			offsetY: 5,
		},
		[ActionType.MELEE]: {
			width: 43,
			height: 37,
			frameCount: 18,
			fps: 18,
		},
	},
	enemy_goldcloak: {
		[ActionType.IDLE]: {
			width: 100,
			height: 100,
			frameCount: 6,
			fps: 12,
			offsetY: 36,
			loop: true,
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
			fps: 12,
			offsetY: 36,
		},
		[ActionType.TAKE_DAMAGE]: {
			width: 40,
			height: 32,
			frameCount: 6,
			fps: 12,
			offsetY: 5,
		},
	},
	enemy_queensguard: {
		[ActionType.IDLE]: {
			width: 100,
			height: 100,
			frameCount: 6,
			fps: 12,
			offsetY: 36,
			loop: true,
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
			fps: 12,
			offsetY: 36,
		},
		[ActionType.TAKE_DAMAGE]: {
			width: 40,
			height: 32,
			frameCount: 6,
			fps: 12,
			offsetY: 5,
		},
	},
};

import { SpritePresets } from '../../constants/animationStates/spriteStates';
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
	Partial<Record<SpritePresets, AnimMeta>>
> = {
	player_warrior_jonsnow: {
		[SpritePresets.IDLE]: {
			width: 130,
			height: 100,
			frameCount: 8,
			fps: 4,
			loop: true,
		},
		[SpritePresets.MOVE]: {
			width: 130,
			height: 100,
			frameCount: 6,
			fps: 4,
		},
		[SpritePresets.MELEE]: {
			width: 130,
			height: 100,
			frameCount: 11,
			fps: 4,
		},
	},
	player_mage_melisandre: {
		[SpritePresets.IDLE]: {
			width: 130,
			height: 100,
			frameCount: 8,
			fps: 5,
			loop: true,
		},
		[SpritePresets.MOVE]: {
			width: 130,
			height: 100,
			frameCount: 6,
			fps: 6,
		},
		[SpritePresets.MELEE]: {
			width: 130,
			height: 100,
			frameCount: 7,
			fps: 4,
			impactFrame: 2,
		},
		[SpritePresets.TAKE_DAMAGE]: {
			width: 130,
			height: 100,
			frameCount: 7,
			fps: 4,
			impactFrame: 3,
		},
		[SpritePresets.ABILITY_CAST]: {
			width: 130,
			height: 100,
			frameCount: 12,
			fps: 6,
			loopStartFrame: 2,
		},
		[SpritePresets.DIE]: {
			width: 130,
			height: 100,
			frameCount: 26,
			fps: 4,
			loopStartFrame: 21,
			loop: true,
		},
	},
	player_mage_thorosofmyr: {
		[SpritePresets.IDLE]: {
			width: 130,
			height: 100,
			frameCount: 8,
			fps: 4,
			loop: true,
		},
		[SpritePresets.MOVE]: {
			width: 130,
			height: 100,
			frameCount: 6,
			fps: 4,
		},
		[SpritePresets.MELEE]: {
			width: 130,
			height: 100,
			frameCount: 8,
			fps: 4,
		},
	},
	enemy_knight: {
		[SpritePresets.IDLE]: {
			width: 24,
			height: 32,
			frameCount: 11,
			fps: 12,
			loop: true,
			offsetY: -5,
		},
		[SpritePresets.MOVE]: {
			width: 22,
			height: 32,
			frameCount: 6,
			fps: 13,
			offsetY: -5,
		},
		[SpritePresets.DIE]: {
			width: 40,
			height: 32,
			frameCount: 7,
			fps: 10,
			offsetY: -5,
		},
		[SpritePresets.TAKE_DAMAGE]: {
			width: 30,
			height: 32,
			frameCount: 7,
			fps: 10,
			impactFrame: 1,
			offsetY: -5,
		},
		[SpritePresets.MELEE]: {
			width: 43,
			height: 37,
			frameCount: 18,
			impactFrame: 8,
			fps: 18,
			offsetY: -5,
		},
	},
	enemy_goldcloak: {
		[SpritePresets.IDLE]: {
			width: 100,
			height: 100,
			frameCount: 6,
			fps: 12,
			offsetY: 36,
			loop: true,
		},
		[SpritePresets.MOVE]: {
			width: 100,
			height: 100,
			frameCount: 6,
			fps: 12,
			offsetY: 36,
		},
		[SpritePresets.DIE]: {
			width: 100,
			height: 100,
			frameCount: 6,
			fps: 6,
			offsetY: 36,
		},
		[SpritePresets.MELEE]: {
			width: 100,
			height: 100,
			frameCount: 6,
			fps: 8,
			impactFrame: 4,
			offsetY: 36,
		},
		[SpritePresets.TAKE_DAMAGE]: {
			width: 40,
			height: 32,
			frameCount: 4,
			fps: 6,
			impactFrame: 2,
		},
	},
	enemy_queensguard: {
		[SpritePresets.IDLE]: {
			width: 100,
			height: 100,
			frameCount: 6,
			fps: 12,
			offsetY: 36,
			loop: true,
		},
		[SpritePresets.MOVE]: {
			width: 100,
			height: 100,
			frameCount: 6,
			fps: 12,
			offsetY: 36,
		},
		[SpritePresets.DIE]: {
			width: 100,
			height: 100,
			frameCount: 6,
			fps: 6,
			offsetY: 36,
		},
		[SpritePresets.MELEE]: {
			width: 100,
			height: 100,
			frameCount: 6,
			fps: 12,
			offsetY: 36,
		},
		[SpritePresets.TAKE_DAMAGE]: {
			width: 40,
			height: 32,
			frameCount: 6,
			fps: 12,
			offsetY: 5,
		},
	},
};

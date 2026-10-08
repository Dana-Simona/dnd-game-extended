import type { SpriteProps } from '../sprite/Sprite';
import { UnitType, type Unit } from '../../constants/interfaces/unit';
import { SpritePresets } from '../../constants/animationStates/spriteStates';
import type { AllPlayerData, Player } from '../../constants/interfaces/player';
import {
	SPRITE_MANIFEST,
	DEFAULT_ANIM_META,
} from './useGameAnimation/spriteAnimationControl/spriteManifest';

export const sanitize = (str?: string, defaultValue = 'idle'): string => {
	const words = str?.match(/[a-zA-Z]+/g) ?? defaultValue.match(/[a-zA-Z]+/g);
	if (!words || words.length === 0) return defaultValue;

	return words
		.map((word, index) =>
			index === 0
				? word.toLowerCase()
				: word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
		)
		.join('');
};

const getDefaultPlayerIdentity = (action: SpritePresets) => ({
	manifestKey: 'player_mage_aurora',
	imagePath: `/sprites/player/mage/aurora/${sanitize(action)}.png`,
});

const getPlayerIdentity = (player: Player, action: SpritePresets) => {
	const cls = sanitize(player.class, 'mage');
	const name = sanitize(player.name, 'aurora');
	const anim = sanitize(action);
	return {
		manifestKey: `player_${cls}_${name}`,
		imagePath: `/sprites/player/${cls}/${name}/${anim}.png`,
	};
};

const getEnemyIdentity = (
	unit: Unit | AllPlayerData,
	action: SpritePresets,
) => {
	const name = sanitize(unit.name, 'boneRatchet');
	const anim = sanitize(action);

	return {
		manifestKey: `enemy_${name}`,
		imagePath: `/sprites/enemies/${name}/${anim}.png`,
	};
};

export const resolveSpriteIdentity = (
	unit: Unit | AllPlayerData | undefined,
	action: SpritePresets,
) => {
	if (!unit) return getDefaultPlayerIdentity(action);
	if (unit.unitType === UnitType.PLAYER)
		return getPlayerIdentity(unit as Player, action);
	return getEnemyIdentity(unit, action);
};

export const resolveAnimationMeta = (
	manifestKey: string,
	action: SpritePresets,
) => {
	const manifest = SPRITE_MANIFEST[manifestKey];
	return (
		manifest?.[action] ||
		manifest?.[SpritePresets.IDLE] ||
		DEFAULT_ANIM_META
	);
};

export const hasAnimation = (
	unit: Unit | AllPlayerData | undefined,
	action: SpritePresets,
): boolean => {
	const { manifestKey } = resolveSpriteIdentity(unit, action);
	return !!SPRITE_MANIFEST[manifestKey]?.[action];
};

export const getUnitSpriteConfig = (
	unit: Unit | AllPlayerData | undefined,
	action: SpritePresets,
): SpriteProps => {
	const { manifestKey, imagePath } = resolveSpriteIdentity(unit, action);
	const meta = resolveAnimationMeta(manifestKey, action);

	return { ...meta, imagePath };
};

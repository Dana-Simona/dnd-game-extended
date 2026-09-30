import type { SpriteProps } from '../sprite/Sprite';
import { SPRITE_MANIFEST, DEFAULT_ANIM_META } from './useGameAnimation/spriteAnimationControl/spriteManifest';
import { UnitType, type Unit } from '../../constants/interfaces/unit';
import { SpritePresets } from '../../constants/animationStates/spriteStates';
import type { AllPlayerData, Player } from '../../constants/interfaces/player';

export const sanitize = (str?: string, defaultValue = 'idle'): string =>
	!str ? defaultValue : str.toLowerCase().replace(/[\s']+/g, '');

const getDefaultPlayerIdentity = (action: SpritePresets) => ({
	manifestKey: 'player_warrior_jonsnow',
	imagePath: `/sprites/player/warrior/jonsnow/${sanitize(action)}.png`,
});

const getPlayerIdentity = (player: Player, action: SpritePresets) => {
	const cls = sanitize(player.class, 'warrior');
	const name = sanitize(player.name, 'jonsnow');
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
	const name = sanitize(unit.name, 'knight');
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

export const getUnitSpriteConfig = (
	unit: Unit | AllPlayerData | undefined,
	action: SpritePresets,
): SpriteProps => {
	const { manifestKey, imagePath } = resolveSpriteIdentity(unit, action);
	const meta = resolveAnimationMeta(manifestKey, action);

	return { ...meta, imagePath };
};

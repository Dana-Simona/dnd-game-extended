import type {
	Unit,
	AllPlayerData,
	Player,
} from '../../constants/interfaces/player';
import type { SpriteProps } from '../sprite/Sprite';
import { SPRITE_MANIFEST, DEFAULT_ANIM_META } from './spriteManifest';

export const sanitize = (str?: string, defaultValue = 'idle'): string =>
	!str ? defaultValue : str.toLowerCase().replace(/\s+/g, '');

const getDefaultPlayerIdentity = (action: string) => ({
	manifestKey: 'player_warrior_jonsnow',
	imagePath: `/sprites/player/warrior/jonsnow/${action}.png`,
});

const getPlayerIdentity = (player: Player, action: string) => {
	const cls = sanitize(player.class, 'warrior');
	const name = sanitize(player.name, 'jonsnow');
	return {
		manifestKey: `player_${cls}_${name}`,
		imagePath: `/sprites/player/${cls}/${name}/${action}.png`,
	};
};

const getEnemyIdentity = (unit: Unit | AllPlayerData, action: string) => {
	const name = sanitize(unit.name, 'skeleton');
	return {
		manifestKey: `enemy_${name}`,
		imagePath: `/sprites/enemies/${name}/${action}.png`,
	};
};

export const resolveSpriteIdentity = (
	unit: Unit | AllPlayerData | undefined,
	action: string,
) => {
	if (!unit) return getDefaultPlayerIdentity(action);
	if (unit.character === '@')
		return getPlayerIdentity(unit as Player, action);
	return getEnemyIdentity(unit, action);
};

export const resolveAnimationMeta = (
	manifestKey: string,
	action: string,
	actionLower: string,
) => {
	const manifest = SPRITE_MANIFEST[manifestKey];
	return (
		manifest?.[action] ||
		manifest?.[actionLower] ||
		manifest?.idle ||
		DEFAULT_ANIM_META
	);
};

export const getUnitSpriteConfig = (
	unit: Unit | AllPlayerData | undefined,
	action: string,
): SpriteProps => {
	const actionLower = sanitize(action, 'idle');
	const { manifestKey, imagePath } = resolveSpriteIdentity(unit, actionLower);
	const meta = resolveAnimationMeta(manifestKey, action, actionLower);

	return { ...meta, imagePath };
};

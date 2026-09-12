import type {
	Unit,
	AllPlayerData,
	Player,
} from '../../constants/interfaces/player';
import { ActionType } from '../../constants/gameEvent';
import type { SpriteProps } from '../sprite/Sprite';
import { SPRITE_MANIFEST, DEFAULT_ANIM_META } from './spriteManifest';

export const sanitize = (str?: string, defaultValue = 'idle'): string =>
	!str ? defaultValue : str.toLowerCase().replace(/[\s']+/g, '');

const getDefaultPlayerIdentity = (action: ActionType) => ({
	manifestKey: 'player_warrior_jonsnow',
	imagePath: `/sprites/player/warrior/jonsnow/${sanitize(action)}.png`,
});

const getPlayerIdentity = (player: Player, action: ActionType) => {
	const cls = sanitize(player.class, 'warrior');
	const name = sanitize(player.name, 'jonsnow');
	const anim = sanitize(action);
	return {
		manifestKey: `player_${cls}_${name}`,
		imagePath: `/sprites/player/${cls}/${name}/${anim}.png`,
	};
};

const getEnemyIdentity = (unit: Unit | AllPlayerData, action: ActionType) => {
	const name = sanitize(unit.name, 'knight');
	const anim = sanitize(action);
	return {
		manifestKey: `enemy_${name}`,
		imagePath: `/sprites/enemies/${name}/${anim}.png`,
	};
};

export const resolveSpriteIdentity = (
	unit: Unit | AllPlayerData | undefined,
	action: ActionType,
) => {
	if (!unit) return getDefaultPlayerIdentity(action);
	if (unit.character === '@')
		return getPlayerIdentity(unit as Player, action);
	return getEnemyIdentity(unit, action);
};

export const resolveAnimationMeta = (
	manifestKey: string,
	action: ActionType,
) => {
	const manifest = SPRITE_MANIFEST[manifestKey];
	return (
		manifest?.[action] || manifest?.[ActionType.IDLE] || DEFAULT_ANIM_META
	);
};

export const getUnitSpriteConfig = (
	unit: Unit | AllPlayerData | undefined,
	action: ActionType,
): SpriteProps => {
	const { manifestKey, imagePath } = resolveSpriteIdentity(unit, action);
	const meta = resolveAnimationMeta(manifestKey, action);

	return { ...meta, imagePath };
};

import type {
	Unit,
	AllPlayerData,
	Player,
} from '../../constants/interfaces/player';
import type { SpriteProps } from '../sprite/Sprite';
import { SPRITE_MANIFEST, DEFAULT_ANIM_META } from './spriteManifest';

const sanitize = (str?: string, defaultValue = 'idle'): string => {
	if (!str) return defaultValue;
	return str.toLowerCase().replace(/\s+/g, '');
};

export const getUnitSpriteConfig = (
	unit: Unit | AllPlayerData | undefined,
	action: string,
): SpriteProps => {
	const actionLower = sanitize(action, 'idle');
	let resolvedImagePath = '';
	let manifestKey = '';

	if (!unit) {
		manifestKey = 'player_warrior_jonsnow';
		resolvedImagePath = `/sprites/player/warrior/jonsnow/${actionLower}.png`;
	} else if (unit.character === '@') {
		const player = unit as Player;
		const unitClass = sanitize(player.class, 'warrior');
		const unitName = sanitize(player.name, 'jonsnow');

		manifestKey = `player_${unitClass}_${unitName}`;
		resolvedImagePath = `/sprites/player/${unitClass}/${unitName}/${actionLower}.png`;
	} else {
		const enemyName = sanitize(unit.name, 'skeleton');

		manifestKey = `enemy_${enemyName}`;
		resolvedImagePath = `/sprites/enemies/${enemyName}/${actionLower}.png`;
	}

	const unitManifest = SPRITE_MANIFEST[manifestKey];
	const specificMeta = unitManifest?.[action] || unitManifest?.[actionLower];

	const finalMeta = specificMeta || unitManifest?.idle || DEFAULT_ANIM_META;

	console.log(
		`[Sprite Config] Render: ${manifestKey} | Action: ${actionLower} | Path: ${resolvedImagePath}`,
	);

	return {
		...finalMeta,
		imagePath: resolvedImagePath,
	};
};

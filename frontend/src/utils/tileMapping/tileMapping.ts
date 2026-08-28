import playerSpriteSheet from '../../assets/The Female Adventurer - Free/Idle/Idle.png';
import grassSpriteSheet from '../../assets/tiles/Texture/TX Tileset Grass.png';
import wallSpriteSheet from '../../assets/tiles/Texture/TX Tileset Wall.png';
import enemySpriteSheet from '../../assets/enemies/Skeleton/Sprite Sheets/Skeleton Idle.png';
import type { SpriteProps } from '../sprite/Sprite';
import { getProceduralTileCoords } from './proceduralNoise/useProceduralNoise';

export type TileConfig =
	| {
			type: 'static';
			imagePath: string;
			tileX?: number;
			tileY?: number;
			tileSize?: number;
	  }
	| ({ type: 'sprite' } & SpriteProps);

const defaultEnemySprite: TileConfig = {
	type: 'sprite',
	imagePath: enemySpriteSheet,
	width: 24,
	height: 32,
	frameCount: 4,
	fps: 6,
};

export const TILE_CONFIGS: Record<string, TileConfig> = {
	'#': {
		type: 'static',
		imagePath: wallSpriteSheet,
		tileX: 0,
		tileY: 0,
		tileSize: 32,
	},
	'.': {
		type: 'static',
		imagePath: grassSpriteSheet,
		tileX: 0,
		tileY: 0,
		tileSize: 32,
	},

	'@': {
		type: 'sprite',
		imagePath: playerSpriteSheet,
		width: 48,
		height: 64,
		frameCount: 8,
		fps: 4,
	},

	// Standard Monsters
	s: defaultEnemySprite, // Gold Cloak
	k: defaultEnemySprite, // Knight
	q: defaultEnemySprite, // Queen's Guard
	z: defaultEnemySprite, // Wright
	b: defaultEnemySprite, // Bear
	g: defaultEnemySprite, // Giant
	w: defaultEnemySprite, // White Walker

	// Bosses
	M: defaultEnemySprite, // The Mountain
	C: defaultEnemySprite, // Queen Cersei
	K: defaultEnemySprite, // Night's King

	// Traps
	B: {
		// Bonus Trap
		type: 'static',
		imagePath: grassSpriteSheet,
		tileX: 3,
		tileY: 2,
		tileSize: 32,
	},
	Q: {
		// Queen's Trap
		type: 'static',
		imagePath: grassSpriteSheet,
		tileX: 3,
		tileY: 2,
		tileSize: 32,
	},
	D: {
		// Death Trap
		type: 'static',
		imagePath: grassSpriteSheet,
		tileX: 3,
		tileY: 2,
		tileSize: 32,
	},
};

export const getTileConfig = (
	char: string,
	x: number = 0,
	y: number = 0,
): TileConfig => {
	if (char === '.') {
		const { tileX, tileY } = getProceduralTileCoords(x, y);

		return {
			type: 'static',
			imagePath: grassSpriteSheet,
			tileX,
			tileY,
			tileSize: 32,
		};
	}

	return (
		TILE_CONFIGS[char] || {
			type: 'static',
			imagePath: grassSpriteSheet,
			tileX: 0,
			tileY: 0,
			tileSize: 32,
		}
	);
};

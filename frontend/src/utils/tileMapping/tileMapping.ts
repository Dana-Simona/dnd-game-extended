import playerSpriteSheet from '../../assets/The Female Adventurer - Free/Idle/Idle_Right_Down.png';
import enemySpriteSheet from '../../assets/enemies/Skeleton/Sprite Sheets/Skeleton Idle.png';
import grassSpriteSheet from '../../assets/tiles/Texture/TX Tileset Grass.png';
import stairsSpriteSheet from '../../assets/tiles/Texture/TX Struct.png';
import wallSpriteSheet from '../../assets/tiles/Texture/TX Tileset Wall.png';
import stoneGroundSpriteSheet from '../../assets/tiles/Texture/TX Tileset Stone Ground.png';
import type { SpriteProps } from '../sprite/Sprite';
import { getProceduralTileCoords } from './proceduralNoise/useProceduralNoise';
import { getWallConfigAt } from './wallAutotile';

export type TileConfig =
	| {
			type: 'static';
			imagePath: string;
			tileX?: number;
			tileY?: number;
			tileSize?: number;
			groundImagePath?: string;
			groundTileX?: number;
			groundTileY?: number;
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

const STATIC_WALL_GROUND_X = 2;
const STATIC_WALL_GROUND_Y = 2;

export const TILE_CONFIGS: Record<string, TileConfig> = {
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
		offsetY: 18,
	},

	'^': {
		type: 'static',
		imagePath: stairsSpriteSheet,
		tileX: 1,
		tileY: 2,
		tileSize: 32,
	},

	// Standard Monsters
	s: defaultEnemySprite,
	k: defaultEnemySprite,
	q: defaultEnemySprite,
	z: defaultEnemySprite,
	b: defaultEnemySprite,
	g: defaultEnemySprite,
	w: defaultEnemySprite,

	// Bosses
	M: defaultEnemySprite,
	C: defaultEnemySprite,
	K: defaultEnemySprite,

	// Traps
	B: {
		type: 'static',
		imagePath: grassSpriteSheet,
		tileX: 3,
		tileY: 2,
		tileSize: 32,
	},
	Q: {
		type: 'static',
		imagePath: grassSpriteSheet,
		tileX: 3,
		tileY: 2,
		tileSize: 32,
	},
	D: {
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
	grid: string[] = [],
): TileConfig => {
	if (char === '#') {
		const wallData = getWallConfigAt(grid, x, y);

		return {
			type: 'static',
			imagePath: wallSpriteSheet,
			tileX: wallData.wallTileX,
			tileY: wallData.wallTileY,
			tileSize: 32,
			groundImagePath: stoneGroundSpriteSheet,
			groundTileX: STATIC_WALL_GROUND_X,
			groundTileY: STATIC_WALL_GROUND_Y,
		};
	}

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

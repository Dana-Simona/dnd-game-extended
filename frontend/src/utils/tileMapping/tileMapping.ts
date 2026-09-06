import grassSpriteSheet from '../../assets/tiles/Texture/TX Tileset Grass.png';
import stairsSpriteSheet from '../../assets/tiles/Texture/TX Struct.png';
import wallSpriteSheet from '../../assets/tiles/Texture/TX Tileset Wall.png';
import stoneGroundSpriteSheet from '../../assets/tiles/Texture/TX Tileset Stone Ground.png';
import type { SpriteProps } from '../sprite/Sprite';
import { getProceduralTileCoords } from './proceduralNoise/useProceduralNoise';
import { getWallConfigAt } from './wallAutotile';
import { getUnitSpriteConfig } from '../animation/unitAnimations';
import type { Unit } from '../../constants/interfaces/player';

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

	'^': {
		type: 'static',
		imagePath: stairsSpriteSheet,
		tileX: 1,
		tileY: 2,
		tileSize: 32,
	},

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
	actionState: string = 'idle',
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

	const isUnit = [
		'@',
		's',
		'k',
		'q',
		'z',
		'b',
		'g',
		'w',
		'M',
		'C',
		'K',
	].includes(char);

	if (isUnit) {
		return {
			type: 'sprite',
			...getUnitSpriteConfig({ character: char } as Unit, actionState),
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

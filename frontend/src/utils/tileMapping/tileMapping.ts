import { getWallConfigAt } from './wallAutotile';
import type { SpriteProps } from '../sprite/Sprite';
import type { Unit } from '../../constants/interfaces/player';
import { getUnitSpriteConfig } from '../animation/spriteAnimations';
import stairsSpriteSheet from '../../assets/tiles/Texture/TX Struct.png';
import wallSpriteSheet from '../../assets/tiles/Texture/TX Tileset Wall.png';
import grassSpriteSheet from '../../assets/tiles/Texture/TX Tileset Grass.png';
import { getProceduralTileCoords } from './proceduralNoise/useProceduralNoise';
import stoneGroundSpriteSheet from '../../assets/tiles/Texture/TX Tileset Stone Ground.png';
import { ActionType } from '../../constants/gameEvent';

export const UnitType = {
	PLAYER: 'PLAYER',
	ENEMY: 'ENEMY',
	TRAP: 'TRAP',
	TILE: 'TILE',
} as const;

export type UnitType = (typeof UnitType)[keyof typeof UnitType];

export const getUnitTypeByChar = (char: string): UnitType => {
	if (char === '@') return UnitType.PLAYER;
	if (char >= 'A' && char <= 'Z') return UnitType.TRAP;
	if (char >= 'a' && char <= 'z') return UnitType.ENEMY;
	return UnitType.TILE;
};

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
	actionState: ActionType = ActionType.IDLE,
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

	const unitType = getUnitTypeByChar(char);
	const isSpriteUnit =
		unitType === UnitType.PLAYER ||
		unitType === UnitType.ENEMY ||
		(unitType === UnitType.TRAP && !TILE_CONFIGS[char]);

	if (isSpriteUnit) {
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

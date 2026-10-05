import { tiles } from './AllTiles';
import type { SpriteProps } from '../sprite/Sprite';
import { getUnitSpriteConfig } from '../animation/spriteAnimations';
import { UnitType, type Unit } from '../../constants/interfaces/unit';
import grassTileset from '../../assets/tiles/Texture/TX Tileset Grass.png';
import { SpritePresets } from '../../constants/animationStates/spriteStates';
import {
	getGroundTileConfig,
	isGroundTile,
} from './proceduralNoise/groundTileMapper';

export interface TileSize {
	horizontalTiles: number;
	verticalTiles: number;
}

export type TileConfig =
	| {
			type: 'static';
			imagePath: string;
			tileX?: number;
			tileY?: number;
			size?: TileSize;
	  }
	| ({ type: 'sprite' } & SpriteProps);

const getDeterministicVariation = (
	x: number,
	y: number,
	maxVariations: number,
): number => {
	if (maxVariations <= 1) return 0;
	const hash = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
	return Math.floor(Math.abs(hash - Math.floor(hash)) * maxVariations);
};

export const getDecorativeTileConfig = (
	tileId: number,
	x: number,
	y: number,
): TileConfig | null => {
	if (tileId === -1 || tileId === null || tileId === undefined) {
		return null;
	}

	if (isGroundTile(tileId)) {
		return getGroundTileConfig(x, y);
	}

	const safeTiles = tiles || [];
	const tileDef = safeTiles[tileId];

	if (!tileDef || tileId < 0) {
		return {
			type: 'static',
			imagePath: grassTileset,
			tileX: 0,
			tileY: 0,
			size: { horizontalTiles: 1, verticalTiles: 1 },
		};
	}

	const xCoords = tileDef.coordinates?.x || [0];
	const yCoords = tileDef.coordinates?.y || [0];
	const variationsCount = Math.min(xCoords.length, yCoords.length) || 1;

	const variationIndex = getDeterministicVariation(x, y, variationsCount);

	return {
		type: 'static',
		imagePath: tileDef.imageSrc || grassTileset,
		tileX: xCoords[variationIndex] ?? 0,
		tileY: yCoords[variationIndex] ?? 0,
		size: {
			horizontalTiles: tileDef.size?.horizontalTiles || 1,
			verticalTiles: tileDef.size?.verticalTiles || 1,
		},
	};
};

export const getUnitTypeByChar = (char: string): UnitType | null => {
	if (char === '@') return UnitType.PLAYER;
	if (['M', 'C', 'K'].includes(char)) return UnitType.BOSS;
	if (char >= 'A' && char <= 'Z') return UnitType.TRAP;
	if (char >= 'a' && char <= 'z') return UnitType.MONSTER;
	return null;
};

export const getUnitTileConfig = (
	char: string,
	actionState: SpritePresets = SpritePresets.IDLE,
): TileConfig => {
	const unitType = getUnitTypeByChar(char);
	if (unitType !== null) {
		return {
			type: 'sprite',
			...getUnitSpriteConfig({ character: char } as Unit, actionState),
		};
	}
	return {
		type: 'static',
		imagePath: '',
		tileX: 0,
		tileY: 0,
		size: { horizontalTiles: 1, verticalTiles: 1 },
	};
};

import { tiles } from '../AllTiles';
import type { TileConfig } from '../tileMapping';
import { getProceduralTileCoords } from './useProceduralNoise';

export const GROUND_TILE_ID = 0;

// TX Tileset Grass is an 8x8 grid of 32px tiles:
// rows 0-3 (indices 0-31)  -> plain grass variants
// rows 4-7 (indices 32-63) -> grass with stone plates (stone biome)
const GROUND_TILESET_COLUMNS = 8;

export const isGroundTile = (tileId: number): boolean =>
	tileId === GROUND_TILE_ID;

export const getGroundTileConfig = (x: number, y: number): TileConfig => {
	const { tileX, tileY } = getProceduralTileCoords(
		x,
		y,
		GROUND_TILESET_COLUMNS,
	);

	return {
		type: 'static',
		imagePath: tiles[GROUND_TILE_ID].imageSrc,
		tileX,
		tileY,
		size: { horizontalTiles: 1, verticalTiles: 1 },
	};
};

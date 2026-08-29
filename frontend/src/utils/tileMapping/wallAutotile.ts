export interface WallTileResult {
	wallTileX: number;
	wallTileY: number;
	groundTileX: number;
	groundTileY: number;
}

const isWall = (grid: string[] | string[][], x: number, y: number): boolean => {
	if (!grid || grid.length === 0) return false;
	if (y < 0 || y >= grid.length) return true;

	const row = grid[y];
	if (!row || x < 0 || x >= row.length) return true;

	return row[x] === '#';
};

const WALL_TILE_MAP: Record<string, { x: number; y: number }> = {
	NONE: { x: 3, y: 3 },

	U1: { x: 1, y: 4 },
	U2: { x: 1, y: 4 },
	D1: { x: 1, y: 0 },
	D2: { x: 1, y: 0 },
	L1: { x: 2, y: 1 },
	L2: { x: 2, y: 1 },
	R1: { x: 0, y: 1 },
	R2: { x: 0, y: 1 },

	U1_D1: { x: 1, y: 3 },
	U2_D2: { x: 1, y: 10 },
	L1_R1: { x: 0, y: 3 },
	L2_R2: { x: 0, y: 3 },

	U1_R1: { x: 0, y: 2 },
	D1_R1: { x: 0, y: 0 },
	D1_L1: { x: 2, y: 0 },
	U1_L1: { x: 2, y: 2 },

	U1_D1_R1: { x: 3, y: 0 },
	U1_L1_R1: { x: 3, y: 1 },
	U1_D1_L1: { x: 3, y: 2 },
	D1_L1_R1: { x: 2, y: 3 },

	U1_D1_L1_R1: { x: 4, y: 1 },
};

export const getWallConfigAt = (
	grid: string[],
	x: number,
	y: number,
): WallTileResult => {
	const U1 = isWall(grid, x, y - 1);
	const U2 = U1 && isWall(grid, x, y - 2);

	const D1 = isWall(grid, x, y + 1);
	const D2 = D1 && isWall(grid, x, y + 2);

	const L1 = isWall(grid, x - 1, y);
	const L2 = L1 && isWall(grid, x - 2, y);

	const R1 = isWall(grid, x + 1, y);
	const R2 = R1 && isWall(grid, x + 2, y);

	const connections: string[] = [];
	if (U2) connections.push('U2');
	else if (U1) connections.push('U1');

	if (D2) connections.push('D2');
	else if (D1) connections.push('D1');

	if (L2) connections.push('L2');
	else if (L1) connections.push('L1');

	if (R2) connections.push('R2');
	else if (R1) connections.push('R1');

	const key = connections.length > 0 ? connections.join('_') : 'NONE';

	const tile =
		WALL_TILE_MAP[key] ||
		WALL_TILE_MAP[key.replace(/2/g, '1')] ||
		WALL_TILE_MAP['L1_R1'];

	return {
		wallTileX: tile.x,
		wallTileY: tile.y,
		groundTileX: 2,
		groundTileY: 2,
	};
};

export interface WallTileResult {
	wallTileX: number;
	wallTileY: number;
	groundTileX: number;
	groundTileY: number;
}

// 1. Bit flags for quick spatial queries around (x, y)
export const N = {
	U1: 1 << 0, // Up 1 (x, y-1)
	U2: 1 << 1, // Up 2 (x, y-2)
	D1: 1 << 2, // Down 1 (x, y+1)
	D2: 1 << 3, // Down 2 (x, y+2)
	L1: 1 << 4, // Left 1 (x-1, y)
	R1: 1 << 5, // Right 1 (x+1, y)
	UL: 1 << 6, // Top-Left corner (x-1, y-1)
	UR: 1 << 7, // Top-Right corner (x+1, y-1)
	DL: 1 << 8, // Bottom-Left corner (x-1, y+1)
	DR: 1 << 9, // Bottom-Right corner (x+1, y+1)
};

const getChar = (grid: string[], x: number, y: number): string => {
	if (!grid || grid.length === 0) return '#';
	if (y < 0 || y >= grid.length) return '#';
	const row = grid[y];
	if (!row || x < 0 || x >= row.length) return '#';
	return row[x];
};

const isWall = (grid: string[], x: number, y: number): boolean => {
	return getChar(grid, x, y) === '#';
};

export const getWallConfigAt = (
	grid: string[],
	x: number,
	y: number,
): WallTileResult => {
	// Collect 10-bit state surrounding the current tile
	let mask = 0;
	if (isWall(grid, x, y - 1)) mask |= N.U1;
	if (isWall(grid, x, y - 2)) mask |= N.U2;
	if (isWall(grid, x, y + 1)) mask |= N.D1;
	if (isWall(grid, x, y + 2)) mask |= N.D2;
	if (isWall(grid, x - 1, y)) mask |= N.L1;
	if (isWall(grid, x + 1, y)) mask |= N.R1;
	if (isWall(grid, x - 1, y - 1)) mask |= N.UL;
	if (isWall(grid, x + 1, y - 1)) mask |= N.UR;
	if (isWall(grid, x - 1, y + 1)) mask |= N.DL;
	if (isWall(grid, x + 1, y + 1)) mask |= N.DR;

	let wallTileX = 3;
	let wallTileY = 3;

	const hasU = Boolean(mask & N.U1);
	const hasD = Boolean(mask & N.D1);
	const hasL = Boolean(mask & N.L1);
	const hasR = Boolean(mask & N.R1);

	if (hasU && hasD && hasL && hasR) {
		wallTileX = 2;
		wallTileY = 4;
	} else if (hasU && hasD && hasR) {
		wallTileX = 1;
		wallTileY = 2;
	} else if (hasU && hasD && hasL) {
		wallTileX = 3;
		wallTileY = 2;
	} else if (hasU && hasL && hasR) {
		wallTileX = 2;
		wallTileY = 4;
	} else if (hasD && hasL && hasR) {
		wallTileX = 5;
		wallTileY = 1;
	} else if (hasU && hasR) {
		wallTileX = 1;
		wallTileY = 4;
	} else if (hasD && hasR) {
		wallTileX = 1;
		wallTileY = 1;
	} else if (hasD && hasL) {
		wallTileX = 3;
		wallTileY = 1;
	} else if (hasU && hasL) {
		wallTileX = 3;
		wallTileY = 4;
	} else if (hasU && hasD) {
		wallTileX = 9;
		wallTileY = mask & N.D2 ? 7 : 8;
	} else if (hasL && hasR) {
		wallTileX = 2;
		wallTileY = 4;
	} else if (hasU) {
		wallTileX = 9;
		wallTileY = 8;
	} else if (hasD) {
		wallTileX = 9;
		wallTileY = 6;
	} else if (hasL) {
		wallTileX = 2;
		wallTileY = 1;
	} else if (hasR) {
		wallTileX = 2;
		wallTileY = 1;
	}

	const isEdgeTile = !(
		mask & N.U1 &&
		mask & N.D1 &&
		mask & N.L1 &&
		mask & N.R1
	);
	// Returns true if any adjacent cardinally connected tile is a staircase '^'
	const isNearStairs = (grid: string[], x: number, y: number): boolean => {
		return (
			getChar(grid, x, y - 1) === '^' ||
			getChar(grid, x, y + 1) === '^' ||
			getChar(grid, x - 1, y) === '^' ||
			getChar(grid, x + 1, y) === '^'
		);
	};

	// if (isEdgeTile && isNearStairs(grid, x, y)) {
	// 	wallTileX = 4;
	// 	wallTileY = 7;
	// }

	return {
		wallTileX,
		wallTileY,
		groundTileX: 2,
		groundTileY: 2,
	};
};

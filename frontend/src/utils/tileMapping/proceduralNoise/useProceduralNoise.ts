const F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
const G2 = (3.0 - Math.sqrt(3.0)) / 6.0;

const computeGridCell = (sx: number, sy: number) => {
	const s = (sx + sy) * F2;
	return { i: Math.floor(sx + s), j: Math.floor(sy + s) };
};

const computeCornerVectors = (sx: number, sy: number, i: number, j: number) => {
	const t = (i + j) * G2;
	const x0 = sx - (i - t);
	const y0 = sy - (j - t);
	const i1 = x0 > y0 ? 1 : 0;
	const j1 = x0 > y0 ? 0 : 1;
	return { x0, y0, i1, j1 };
};

const computeCornerContribution = (
	cx: number,
	cy: number,
	px: number,
	py: number,
): number => {
	let t = 0.5 - cx * cx - cy * cy;
	if (t < 0) return 0;
	t *= t;
	const hash = Math.sin(px * 127.1 + py * 311.7) * 43758.5453;
	const angle = (hash - Math.floor(hash)) * Math.PI * 2;
	return t * t * (Math.cos(angle) * cx + Math.sin(angle) * cy);
};

export const getSimplexNoise = (
	x: number,
	y: number,
	scale: number = 0.1,
): number => {
	const sx = x * scale;
	const sy = y * scale;
	const { i, j } = computeGridCell(sx, sy);
	const { x0, y0, i1, j1 } = computeCornerVectors(sx, sy, i, j);

	const n0 = computeCornerContribution(x0, y0, i, j);
	const n1 = computeCornerContribution(
		x0 - i1 + G2,
		y0 - j1 + G2,
		i + i1,
		j + j1,
	);
	const n2 = computeCornerContribution(
		x0 - 1.0 + 2.0 * G2,
		y0 - 1.0 + 2.0 * G2,
		i + 1,
		j + 1,
	);

	return (70.0 * (n0 + n1 + n2) + 1.0) / 2.0;
};

export const getSeededVariant = (
	x: number,
	y: number,
	totalVariants: number,
	seed: number = 1337,
): number => {
	const hash = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
	return Math.floor((hash - Math.floor(hash)) * totalVariants);
};

const getBiomeParameters = (noiseValue: number, threshold: number) =>
	noiseValue > threshold
		? { startIndex: 32, seed: 42 }
		: { startIndex: 0, seed: 99 };

const calculateTile2DCoords = (variantIndex: number, columns: number) => ({
	tileX: variantIndex % columns,
	tileY: Math.floor(variantIndex / columns),
});

export const getProceduralTileCoords = (
	x: number,
	y: number,
	tilesetColumns: number = 8,
	patchSize: number = 0.15,
	threshold: number = 0.6,
) => {
	const noiseValue = getSimplexNoise(x, y, patchSize);
	const { startIndex, seed } = getBiomeParameters(noiseValue, threshold);
	const variantOffset = getSeededVariant(x, y, 32, seed);

	return calculateTile2DCoords(startIndex + variantOffset, tilesetColumns);
};

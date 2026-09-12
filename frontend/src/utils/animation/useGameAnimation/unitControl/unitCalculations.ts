export interface Position {
	x: number;
	y: number;
}

export const calculateFacing = (
	sourcePos: Position,
	targetPos: Position,
): 'left' | 'right' => (targetPos.x - sourcePos.x < 0 ? 'left' : 'right');

export const calculateVectorOffset = (
	fromPos: Position,
	toPos: Position,
	distancePx: number,
) => {
	const dx = toPos.x - fromPos.x;
	const dy = toPos.y - fromPos.y;
	const length = Math.hypot(dx, dy) || 1;
	return {
		offsetX: (dx / length) * distancePx,
		offsetY: (dy / length) * distancePx,
	};
};

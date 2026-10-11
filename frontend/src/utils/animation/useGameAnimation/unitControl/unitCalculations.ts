import {
	UnitFacing,
	type UnitTransform,
} from '../../../../constants/animationStates/unitStates';

export interface Position {
	x: number;
	y: number;
}

const toNumber = (value: unknown): number => {
	const num = typeof value === 'number' ? value : parseFloat(String(value));
	return isNaN(num) ? 0 : num;
};

const settledValue = (value: unknown): number =>
	Array.isArray(value) ? toNumber(value[value.length - 1]) : toNumber(value);

export const getTransformOffset = (transform?: UnitTransform): Position => ({
	x: settledValue(transform?.x ?? transform?.offset?.x ?? 0),
	y: settledValue(transform?.y ?? transform?.offset?.y ?? 0),
});

export const calculateRotateAwayDirection = (
	unitPos: Position,
	fromPos: Position,
): 1 | -1 => (fromPos.x > unitPos.x ? -1 : 1);

export const calculateFacing = (
	sourcePos: Position,
	targetPos: Position,
): UnitFacing =>
	targetPos.x - sourcePos.x < 0 ? UnitFacing.LEFT : UnitFacing.RIGHT;

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

import type { Position, CameraState } from './cameraControl';
import type { Unit } from '../../../../constants/interfaces/unit';
import type { AllPlayerData } from '../../../../constants/interfaces/player';

export const calcTwoTargetCamera = (pos1: Position, pos2: Position) => {
	const midX = (pos1.x + pos2.x) / 2;
	const midY = (pos1.y + pos2.y) / 2;
	const distance = Math.hypot(pos1.x - pos2.x, pos1.y - pos2.y);
	const zoom = Math.min(Math.max(1.5, 6 / Math.max(distance, 1)), 4);
	return { focusX: midX, focusY: midY, zoom };
};

export const getTargetCoords = (
	state: CameraState,
	player: Unit | AllPlayerData | null,
	visualPositions: Record<string, Position>,
): Position => {
	if (state.focusX !== undefined && state.focusY !== undefined) {
		return { x: state.focusX, y: state.focusY };
	}
	if (player) {
		return visualPositions[player.id] || { x: player.x, y: player.y };
	}
	return { x: 0, y: 0 };
};

export const calculateOffsets = (
	target: Position,
	tileSize: number,
	totalZoom: number,
	shakeX: number,
	shakeY: number,
) => {
	const pixelTargetX = (target.x + 0.5) * tileSize;
	const pixelTargetY = (target.y + 0.5) * tileSize;
	const offsetX = -pixelTargetX * totalZoom + shakeX;
	const offsetY = -pixelTargetY * totalZoom + shakeY;
	return { pixelTargetX, pixelTargetY, offsetX, offsetY };
};

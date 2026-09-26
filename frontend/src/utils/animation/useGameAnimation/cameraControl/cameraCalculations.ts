import type { Position } from '../unitControl/unitCalculations';
import type { Unit } from '../../../../constants/interfaces/unit';
import type { AllPlayerData } from '../../../../constants/interfaces/player';
import type { CameraState } from '../../../../constants/animationStates/cameraStates';

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 4.0;
const TWO_TARGET_MIN_ZOOM = 1.5;
const DEFAULT_MARGIN_TILES = 1.5;

export interface CameraTwoTargetResult {
	focusX: number;
	focusY: number;
	zoom: number;
}

export interface CameraOffsetsResult {
	pixelTargetX: number;
	pixelTargetY: number;
	offsetX: number;
	offsetY: number;
}


export const calcTwoTargetCamera = (
	pos1: Position,
	pos2: Position,
): CameraTwoTargetResult => {
	const focusX = (pos1.x + pos2.x) / 2;
	const focusY = (pos1.y + pos2.y) / 2;
	const distance = Math.hypot(pos1.x - pos2.x, pos1.y - pos2.y);

	const targetZoom = 6 / Math.max(distance, 1);
	const zoom = Math.min(Math.max(TWO_TARGET_MIN_ZOOM, targetZoom), MAX_ZOOM);

	return {
		focusX,
		focusY,
		zoom: Number(zoom.toFixed(2)),
	};
};

export const calcRangeZoom = (
	range: number,
	tileSize: number = 32,
	marginTiles: number = DEFAULT_MARGIN_TILES,
	viewportWidth?: number,
	viewportHeight?: number,
): number => {
	const tileDiameter = range * 2 + 1 + marginTiles;
	const requiredWorldPixels = tileDiameter * tileSize;

	const width =
		viewportWidth ??
		(typeof window !== 'undefined' ? window.innerWidth : 1920);
	const height =
		viewportHeight ??
		(typeof window !== 'undefined' ? window.innerHeight : 1080);
	const minViewportDim = Math.min(width, height);

	const calculatedZoom = minViewportDim / requiredWorldPixels;
	const clampedZoom = Math.min(Math.max(calculatedZoom, MIN_ZOOM), MAX_ZOOM);

	return Number(clampedZoom.toFixed(2));
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
		return visualPositions[player.id] ?? { x: player.x, y: player.y };
	}
	return { x: 0, y: 0 };
};

export const calculateOffsets = (
	target: Position,
	tileSize: number,
	totalZoom: number,
	shakeX = 0,
	shakeY = 0,
): CameraOffsetsResult => {
	const pixelTargetX = (target.x + 0.5) * tileSize;
	const pixelTargetY = (target.y + 0.5) * tileSize;
	const offsetX = -pixelTargetX * totalZoom + shakeX;
	const offsetY = -pixelTargetY * totalZoom + shakeY;

	return { pixelTargetX, pixelTargetY, offsetX, offsetY };
};

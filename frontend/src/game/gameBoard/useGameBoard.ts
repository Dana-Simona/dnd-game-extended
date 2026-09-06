import { useRef, useState, useCallback, useEffect } from 'react';
import type { Unit } from '../../constants/interfaces/player';

export interface Position {
	x: number;
	y: number;
}

export interface Dimensions {
	width: number;
	height: number;
}

export const resolvePlayerPosition = (
	character: { id?: string; x: number; y: number },
	visualPositions: Record<string, Position>,
): Position => {
	const playerId = character.id || 'player';
	return visualPositions[playerId] ?? { x: character.x, y: character.y };
};

export const calculatePixelCenter = (
	coord: number,
	tileSize: number,
	zoom: number,
): number => (coord * tileSize + tileSize / 2) * zoom;

export const calculateCameraOffset = (
	viewportSize: number,
	playerPixel: number,
): number => viewportSize / 2 - playerPixel;

export const calculateCameraCoordinates = (
	pos: Position,
	dimensions: Dimensions,
	tileSize: number,
	zoom: number,
) => {
	const pixelX = calculatePixelCenter(pos.x, tileSize, zoom);
	const pixelY = calculatePixelCenter(pos.y, tileSize, zoom);
	return {
		offsetX: calculateCameraOffset(dimensions.width, pixelX),
		offsetY: calculateCameraOffset(dimensions.height, pixelY),
	};
};

export const combineUnits = (character: Unit, enemies: Unit[] = []): Unit[] => {
	const validEnemies = enemies.filter((e): e is Unit => Boolean(e));
	return [character, ...validEnemies];
};

export const useViewport = () => {
	const viewportRef = useRef<HTMLDivElement>(null);
	const [dimensions, setDimensions] = useState<Dimensions>({
		width: 0,
		height: 0,
	});

	const updateDimensions = useCallback(() => {
		if (viewportRef.current) {
			setDimensions({
				width: viewportRef.current.clientWidth,
				height: viewportRef.current.clientHeight,
			});
		}
	}, []);

	useEffect(() => {
		updateDimensions();
		window.addEventListener('resize', updateDimensions);
		return () => window.removeEventListener('resize', updateDimensions);
	}, [updateDimensions]);

	return { viewportRef, dimensions };
};

import React from 'react';
import type { Unit } from '../../constants/interfaces/player';
import { useCharacter } from '../../utils/characterContext/CharacterContext';
import { ViewportContainer, Board, BoardCanvas } from './GameBoardStyles';
import StaticLayer from './staticLayer/StaticLayer';
import ActiveLayer from './activeLayer/ActiveLayer';
import {
	useViewport,
	resolvePlayerPosition,
	calculateCameraCoordinates,
	combineUnits,
} from './useGameBoard';

interface GameBoardProps {
	board: string[];
	enemies: Unit[];
	activeUnitStates?: Record<string, string>;
	visualPositions?: Record<string, { x: number; y: number }>;
}

const TILE_SIZE = 32;
const ZOOM = 2;

export const GameBoard: React.FC<GameBoardProps> = ({
	board,
	enemies,
	activeUnitStates = {},
	visualPositions = {},
}) => {
	const { character } = useCharacter();
	const { viewportRef, dimensions } = useViewport();

	if (!character) {
		return (
			<ViewportContainer ref={viewportRef}>
				<p>Loading character...</p>
			</ViewportContainer>
		);
	}

	const playerPos = resolvePlayerPosition(character, visualPositions);
	const camera = calculateCameraCoordinates(
		playerPos,
		dimensions,
		TILE_SIZE,
		ZOOM,
	);
	const allUnits = combineUnits(character, enemies);

	return (
		<ViewportContainer ref={viewportRef}>
			<Board
				$offsetX={camera.offsetX}
				$offsetY={camera.offsetY}
				$zoom={ZOOM}
				$transitionDuration='0.25s'
			>
				<BoardCanvas>
					<StaticLayer board={board} />
					<ActiveLayer
						units={allUnits}
						characterId={character.id}
						tileSize={TILE_SIZE}
						board={board}
						activeUnitStates={activeUnitStates}
						visualPositions={visualPositions}
					/>
				</BoardCanvas>
			</Board>
		</ViewportContainer>
	);
};

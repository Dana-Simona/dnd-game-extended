import React from 'react';
import type { Unit } from '../../constants/interfaces/player';
import { useCharacter } from '../../utils/characterContext/CharacterContext';
import { ViewportContainer, Board, BoardCanvas } from './GameBoardStyles';
import StaticLayer from './staticLayer/StaticLayer';
import ActiveLayer from './activeLayer/ActiveLayer';
import { useViewport, combineUnits } from './useGameBoard';

interface GameBoardProps {
	board: string[];
	enemies: Unit[];
	activeUnitStates?: Record<string, string>;
	visualPositions?: Record<string, { x: number; y: number }>;
	cameraStyle?: React.CSSProperties;
}

const TILE_SIZE = 32;

export const GameBoard: React.FC<GameBoardProps> = ({
	board,
	enemies,
	activeUnitStates = {},
	visualPositions = {},
	cameraStyle,
}) => {
	const { character } = useCharacter();
	const { viewportRef } = useViewport();

	if (!character) {
		return (
			<ViewportContainer ref={viewportRef}>
				<p>Loading character...</p>
			</ViewportContainer>
		);
	}

	const allUnits = combineUnits(character, enemies);

	return (
		<ViewportContainer ref={viewportRef}>
			<Board style={cameraStyle}>
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

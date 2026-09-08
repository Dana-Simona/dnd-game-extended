import React from 'react';
import type { Unit } from '../../constants/interfaces/player';
import { useCharacter } from '../../utils/characterContext/CharacterContext';
import { ViewportContainer, Board, BoardCanvas } from './GameBoardStyles';
import { useViewport, combineUnits } from './useGameBoard';
import ActiveLayer from './layers/activeLayer/ActiveLayer';
import StaticLayer from './layers/staticLayer/StaticLayer';
import { VfxLayer } from './layers/activeLayer/vfxLayer/VfxLayer';
import type { VfxItem } from '../../utils/animation/useGameAnimation/useVfxControl';

interface GameBoardProps {
	board: string[];
	enemies: Unit[];
	activeUnitStates?: Record<string, string>;
	visualPositions?: Record<string, { x: number; y: number }>;
	cameraStyle?: React.CSSProperties;
	activeVfxList?: VfxItem[];
}

const TILE_SIZE = 32;

export const GameBoard: React.FC<GameBoardProps> = ({
	board,
	enemies,
	activeUnitStates = {},
	visualPositions = {},
	cameraStyle,
	activeVfxList = [],
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
					<VfxLayer vfxList={activeVfxList} />
				</BoardCanvas>
			</Board>
		</ViewportContainer>
	);
};

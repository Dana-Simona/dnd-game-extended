import React from 'react';
import type { Unit } from '../../constants/interfaces/player';
import { useCharacter } from '../../utils/characterContext/CharacterContext';
import { ViewportContainer, Board, BoardCanvas } from './GameBoardStyles';
import { useViewport, combineUnits } from './useGameBoard';
import ActiveLayer from './layers/activeLayer/ActiveLayer';
import StaticLayer from './layers/staticLayer/StaticLayer';
import { VfxLayer } from './layers/activeLayer/vfxLayer/VfxLayer';
import type { VfxItem } from '../../utils/animation/useGameAnimation/useVfxControl';
import type { ActionType } from '../../constants/gameEvent';
import type { UnitTransform } from '../../utils/animation/useGameAnimation/unitControl/unitControl';
import type { MotionProps } from 'framer-motion';

export interface GameBoardProps {
	board: string[];
	enemies: Unit[];
	activeUnitStates?: Record<string, ActionType>;
	visualPositions?: Record<string, { x: number; y: number }>;
	unitTransforms?: Record<string, UnitTransform>;
	cameraMotion: MotionProps;
	activeVfxList?: VfxItem[];
}

const TILE_SIZE = 32;

export const GameBoard: React.FC<GameBoardProps> = ({
	board,
	enemies,
	activeUnitStates = {},
	visualPositions = {},
	unitTransforms = {},
	cameraMotion,
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
			<Board {...cameraMotion}>
				<BoardCanvas>
					<StaticLayer board={board} />
					<ActiveLayer
						units={allUnits}
						characterId={character.id}
						tileSize={TILE_SIZE}
						board={board}
						activeUnitStates={activeUnitStates}
						visualPositions={visualPositions}
						unitTransforms={unitTransforms}
					/>
					<VfxLayer vfxList={activeVfxList} />
				</BoardCanvas>
			</Board>
		</ViewportContainer>
	);
};

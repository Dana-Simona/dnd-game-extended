import React from 'react';
import type { MotionProps } from 'framer-motion';

import ActiveLayer from './layers/activeLayer/ActiveLayer';
import StaticLayer from './layers/staticLayer/StaticLayer';
import type { Unit } from '../../constants/interfaces/unit';
import type { ActionType } from '../../constants/gameEvent';
import { useViewport, combineUnits } from './useGameBoard';
import type { AnimationPhase } from '../../utils/sprite/Sprite';
import { VfxLayer } from './layers/activeLayer/vfxLayer/VfxLayer';
import { ViewportContainer, Board, BoardCanvas } from './GameBoardStyles';
import { useCharacter } from '../../utils/characterContext/CharacterContext';
import type { VfxItem } from '../../utils/animation/useGameAnimation/useVfxControl';
import type { UnitTransform } from '../../utils/animation/useGameAnimation/unitControl/unitControl';

export interface Props {
	board: string[];
	enemies: Unit[];
	activeUnitStates?: Record<string, ActionType>;
	activeUnitPhases?: Record<string, AnimationPhase>; 
	visualPositions?: Record<string, { x: number; y: number }>;
	unitTransforms?: Record<string, UnitTransform>;
	cameraMotion: MotionProps;
	activeVfxList?: VfxItem[];
}

const TILE_SIZE = 32;

export const GameBoard: React.FC<Props> = ({
	board,
	enemies,
	activeUnitStates = {},
	activeUnitPhases = {},
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
						activeUnitPhases={activeUnitPhases}
						visualPositions={visualPositions}
						unitTransforms={unitTransforms}
					/>
					<VfxLayer vfxList={activeVfxList} />
				</BoardCanvas>
			</Board>
		</ViewportContainer>
	);
};

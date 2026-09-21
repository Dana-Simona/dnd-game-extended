import React from 'react';
import type { MotionProps } from 'framer-motion';

import ActiveLayer from './layers/activeLayer/ActiveLayer';
import StaticLayer from './layers/staticLayer/StaticLayer';
import type { Unit } from '../../constants/interfaces/unit';
import { useViewport, combineUnits } from './useGameBoard';
import { VfxLayer } from './layers/activeLayer/vfxLayer/VfxLayer';
import type { VfxItem } from '../../constants/animationStates/vfxStates';
import {
	ViewportContainer,
	Board,
	BoardEffectLayer,
	BoardCanvas,
} from './GameBoardStyles';
import { useCharacter } from '../../utils/characterContext/CharacterContext';
import type { UnitTransform } from '../../constants/animationStates/unitStates';
import type { HpStateMap } from '../../utils/animation/useGameAnimation/hpBarControl/useHpBarControl';
import type {
	SpritePresets,
	AnimationPhase,
} from '../../constants/animationStates/spriteStates';

export interface Props {
	board: string[];
	enemies: Unit[];
	activeSpriteStates?: Record<string, SpritePresets>;
	activeUnitPhases?: Record<string, AnimationPhase>;
	visualPositions?: Record<string, { x: number; y: number }>;
	unitTransforms?: Record<string, UnitTransform>;
	panZoomMotion: MotionProps;
	effectMotion: MotionProps;
	activeVfxList?: VfxItem[];
	hpStates: HpStateMap;
}

const TILE_SIZE = 32;

export const GameBoard: React.FC<Props> = ({
	board,
	enemies,
	activeSpriteStates = {},
	activeUnitPhases = {},
	visualPositions = {},
	unitTransforms = {},
	panZoomMotion,
	effectMotion,
	activeVfxList = [],
	hpStates,
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
			<Board {...panZoomMotion}>
				<BoardEffectLayer {...effectMotion}>
					<BoardCanvas>
						<StaticLayer board={board} />
						<ActiveLayer
							units={allUnits}
							characterId={character.id}
							tileSize={TILE_SIZE}
							board={board}
							activeSpriteStates={activeSpriteStates}
							activeSpritePhases={activeUnitPhases}
							visualPositions={visualPositions}
							unitTransforms={unitTransforms}
							hpStates={hpStates}
						/>
						<VfxLayer vfxList={activeVfxList} />
					</BoardCanvas>
				</BoardEffectLayer>
			</Board>
		</ViewportContainer>
	);
};

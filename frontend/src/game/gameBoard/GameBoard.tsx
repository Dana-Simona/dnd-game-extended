import React, { useMemo } from 'react';
import type { MotionProps } from 'framer-motion';

import ActiveLayer from './layers/activeLayer/ActiveLayer';
import StaticLayer from './layers/staticLayer/StaticLayer';
import type { Unit } from '../../constants/interfaces/unit';
import { useViewport, combineUnits } from './useGameBoard';
import { VfxLayer } from './layers/vfxLayers/effectsLayer/VfxLayer';
import {
	VfxCategory,
	type VfxItem,
} from '../../constants/animationStates/vfxStates';
import {
	ViewportContainer,
	Board,
	BoardEffectLayer,
	BoardCanvas,
} from './GameBoardStyles';
import { useCharacter } from '../../utils/characterContext/CharacterContext';
import type { UnitTransform } from '../../constants/animationStates/unitStates';
import type {
	SpritePresets,
	AnimationPhase,
} from '../../constants/animationStates/spriteStates';
import type { HpStateMap } from '../../constants/animationStates/hpStates';
import { PortalVfxLayer } from './layers/vfxLayers/portalLayer/PortalVfxLayer';

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

	const { screenVfxs, backVfxs, frontVfxs, portalVfxs } = useMemo(() => {
		const screenVfxs: VfxItem[] = [];
		const backVfxs: VfxItem[] = [];
		const frontVfxs: VfxItem[] = [];
		const portalVfxs: VfxItem[] = [];

		for (const vfx of activeVfxList) {
			switch (vfx.category) {
				case VfxCategory.SCREEN_COLOR:
					screenVfxs.push(vfx);
					break;
				case VfxCategory.BACK:
					backVfxs.push(vfx);
					break;
				case VfxCategory.FRONT:
					frontVfxs.push(vfx);
					break;
				case VfxCategory.PORTAL:
					portalVfxs.push(vfx);
					break;
			}
		}

		return { screenVfxs, backVfxs, frontVfxs, portalVfxs };
	}, [activeVfxList]);

	if (!character) {
		return (
			<ViewportContainer ref={viewportRef}>
				<p>Loading character...</p>
			</ViewportContainer>
		);
	}

	const allUnits = combineUnits(character, enemies);
	const activeScreenVfxTypes = screenVfxs.map((v) => v.type);

	return (
		<ViewportContainer ref={viewportRef}>
			<Board {...panZoomMotion}>
				<BoardEffectLayer {...effectMotion}>
					<BoardCanvas $activeScreenVfx={activeScreenVfxTypes}>
						<StaticLayer board={board} />
						<VfxLayer vfxList={backVfxs} />
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
						<VfxLayer vfxList={frontVfxs} />
					</BoardCanvas>
				</BoardEffectLayer>
			</Board>

			<PortalVfxLayer vfxList={portalVfxs} />
		</ViewportContainer>
	);
};

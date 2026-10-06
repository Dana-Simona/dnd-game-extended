import React from 'react';
import type { MotionProps } from 'framer-motion';

import ActiveLayer from './layers/activeLayer/ActiveLayer';
import StaticLayer from './layers/staticLayer/StaticLayer';
import type { Unit } from '../../constants/interfaces/unit';
import { VfxLayer } from './layers/vfxLayers/effectsLayer/VfxLayer';
import type { VfxItem } from '../../constants/animationStates/vfxStates';
import type { HpStateMap } from '../../constants/animationStates/hpStates';
import { PortalVfxLayer } from './layers/vfxLayers/portalLayer/PortalVfxLayer';
import {
	ViewportContainer,
	Board,
	BoardEffectLayer,
	BoardCanvas,
	StaticLayerWrapper,
} from './GameBoardStyles';
import type {
	UnitTransform,
	TrapVisualStateMap,
} from '../../constants/animationStates/unitStates';
import type {
	SpritePresets,
	AnimationPhase,
} from '../../constants/animationStates/spriteStates';

import { useGameBoardLogic } from './useGameBoard';
import BossHealthBar from '../bossHealthBar/BossHealthBar';

export interface Props {
	board: string[];
	level?: number;
	enemies: Unit[];
	activeSpriteStates?: Record<string, SpritePresets>;
	activeUnitPhases?: Record<string, AnimationPhase>;
	visualPositions?: Record<string, { x: number; y: number }>;
	unitTransforms?: Record<string, UnitTransform>;
	trapStates?: TrapVisualStateMap;
	panZoomMotion: MotionProps;
	effectMotion: MotionProps;
	activeVfxList?: VfxItem[];
	hpStates: HpStateMap;
	activeBossId?: string | null;
}

const TILE_SIZE = 32;

export const GameBoard: React.FC<Props> = ({
	board,
	level = 1,
	enemies,
	activeSpriteStates = {},
	activeUnitPhases = {},
	visualPositions = {},
	unitTransforms = {},
	trapStates = {},
	panZoomMotion,
	effectMotion,
	activeVfxList = [],
	hpStates,
	activeBossId = null,
}) => {
	const {
		character,
		viewportRef,
		layers,
		backVfxs,
		frontVfxs,
		portalVfxs,
		allUnits,
		activeScreenVfxTypes,
	} = useGameBoardLogic(level, enemies, activeVfxList);

	const boss = activeBossId
		? enemies.find((e) => e.id === activeBossId)
		: undefined;

	if (!character) {
		return (
			<ViewportContainer ref={viewportRef}>
				<p>Loading character...</p>
			</ViewportContainer>
		);
	}

	return (
		<ViewportContainer ref={viewportRef}>
			<Board {...panZoomMotion}>
				<BoardEffectLayer {...effectMotion}>
					<BoardCanvas>
						<StaticLayerWrapper
							$activeVfxTypes={activeScreenVfxTypes}
						>
							{layers.map((layerMatrix, index) => (
								<StaticLayer
									key={index}
									layer={layerMatrix}
								/>
							))}
						</StaticLayerWrapper>

						<VfxLayer vfxList={backVfxs} />

						<ActiveLayer
							units={allUnits}
							characterId={character.id}
							tileSize={TILE_SIZE}
							activeSpriteStates={activeSpriteStates}
							activeSpritePhases={activeUnitPhases}
							visualPositions={visualPositions}
							unitTransforms={unitTransforms}
							trapStates={trapStates}
							hpStates={hpStates}
						/>

						<VfxLayer vfxList={frontVfxs} />
					</BoardCanvas>
				</BoardEffectLayer>
			</Board>

			<BossHealthBar
				visible={!!boss}
				name={boss?.name}
				hpState={boss ? hpStates[boss.id] : undefined}
				fallbackCurrentHp={boss?.currentHealth}
				fallbackMaxHp={boss?.health}
			/>

			<PortalVfxLayer vfxList={portalVfxs} />
		</ViewportContainer>
	);
};

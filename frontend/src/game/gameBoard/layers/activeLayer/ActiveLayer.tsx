import React from 'react';
import type { Transition } from 'framer-motion';
import Tile from '../../Tile/Tile';
import { UnitType, type Unit } from '../../../../constants/interfaces/unit';
import { ActiveLayerContainer, AnimatedUnitWrapper } from './ActiveLayerStyles';
import {
	UnitFacing,
	type UnitTransform,
} from '../../../../constants/animationStates/unitStates';
import type {
	SpritePresets,
	AnimationPhase,
} from '../../../../constants/animationStates/spriteStates';
import type { HpStateMap } from '../../../../constants/animationStates/hpStates';

interface Props {
	units: Unit[];
	characterId: string;
	tileSize: number;
	board: string[];
	activeSpriteStates?: Record<string, SpritePresets>;
	activeSpritePhases?: Record<string, AnimationPhase>;
	visualPositions?: Record<string, { x: number; y: number }>;
	unitTransforms?: Record<string, UnitTransform>;
	hpStates?: HpStateMap;
}

const PLAYER_MOVEMENT_DELAY = 0.3;

const ActiveLayer: React.FC<Props> = React.memo(
	({
		units,
		characterId,
		tileSize,
		board,
		activeSpriteStates = {},
		activeSpritePhases = {},
		visualPositions = {},
		unitTransforms = {},
		hpStates = {},
	}) => {
		return (
			<ActiveLayerContainer>
				{units.map((unit, index) => {
					const isPlayer = unit.unitType === UnitType.PLAYER;
					const unitId =
						unit.id || (isPlayer ? characterId : `unit-${index}`);

					const currentX = visualPositions[unitId]?.x ?? unit.x;
					const currentY = visualPositions[unitId]?.y ?? unit.y;
					const transform = unitTransforms[unitId] ?? {};

					const offsetX =
						typeof transform.x === 'number'
							? transform.x
							: (transform.offset?.x ?? 0);
					const offsetY =
						typeof transform.y === 'number'
							? transform.y
							: (transform.offset?.y ?? 0);

					const targetX = currentX * tileSize + offsetX;
					const targetY = currentY * tileSize + offsetY;
					const targetOpacity = transform.opacity ?? 1;

					const moveDelay = isPlayer ? PLAYER_MOVEMENT_DELAY : 0;

					const defaultGridTransition: Transition = {
						type: 'spring',
						stiffness: 300,
						damping: 28,
						delay: moveDelay,
					};

					const transitionConfig: Transition =
						(transform.transition as Transition) ?? {
							x: defaultGridTransition,
							y: defaultGridTransition,
							opacity: { duration: 0.2, ease: 'easeInOut' },
						};

					const facing =
						transform.facing ??
						(transform.scaleX === -1
							? UnitFacing.LEFT
							: UnitFacing.RIGHT);

					return (
						<AnimatedUnitWrapper
							key={unitId}
							$tileSize={tileSize}
							$zIndex={isPlayer ? 10 : 1}
							initial={{
								x: targetX,
								y: targetY,
								opacity: targetOpacity,
							}}
							animate={{
								x: targetX,
								y: targetY,
								opacity: targetOpacity,
							}}
							transition={transitionConfig}
						>
							<Tile
								char={unit.character}
								x={currentX}
								y={currentY}
								grid={board}
								unit={unit}
								activeActionState={activeSpriteStates[unitId]}
								facing={facing}
								phase={activeSpritePhases[unitId]}
								hpState={hpStates[unitId]}
							/>
						</AnimatedUnitWrapper>
					);
				})}
			</ActiveLayerContainer>
		);
	},
);

ActiveLayer.displayName = 'ActiveLayer';

export default ActiveLayer;

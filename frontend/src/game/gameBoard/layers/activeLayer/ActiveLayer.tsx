import React from 'react';
import type { Transition } from 'framer-motion';
import Tile from '../../Tile/Tile';
import type { ActionType } from '../../../../constants/gameEvent';
import type { AnimationPhase } from '../../../../utils/sprite/Sprite';
import { UnitType, type Unit } from '../../../../constants/interfaces/unit';
import { ActiveLayerContainer, AnimatedUnitWrapper } from './ActiveLayerStyles';
import type { UnitTransform } from '../../../../utils/animation/useGameAnimation/unitControl/unitControl';

interface Props {
	units: Unit[];
	characterId: string;
	tileSize: number;
	board: string[];
	activeUnitStates?: Record<string, ActionType>;
	activeUnitPhases?: Record<string, AnimationPhase>;
	visualPositions?: Record<string, { x: number; y: number }>;
	unitTransforms?: Record<string, UnitTransform>;
}

const PLAYER_MOVEMENT_DELAY = 0.3;

const ActiveLayer: React.FC<Props> = React.memo(
	({
		units,
		characterId,
		tileSize,
		board,
		activeUnitStates = {},
		activeUnitPhases = {},
		visualPositions = {},
		unitTransforms = {},
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
						(transform.scaleX === -1 ? 'left' : 'right');

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
								activeActionState={
									activeUnitStates[unitId] as ActionType
								}
								facing={facing}
								phase={activeUnitPhases[unitId]}
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

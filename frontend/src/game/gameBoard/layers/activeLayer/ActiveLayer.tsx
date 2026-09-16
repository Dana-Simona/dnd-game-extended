import React from 'react';

import Tile from '../../Tile/Tile';
import { UnitType, type Unit } from '../../../../constants/interfaces/unit';
import type { ActionType } from '../../../../constants/gameEvent';
import { ActiveLayerContainer, AnimatedUnitWrapper } from './ActiveLayerStyles';
import type { UnitTransform } from '../../../../utils/animation/useGameAnimation/unitControl/unitControl';

interface Props {
	units: Unit[];
	characterId: string;
	tileSize: number;
	board: string[];
	activeUnitStates?: Record<string, ActionType>;
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
					const transform = unitTransforms[unitId] ?? {
						facing: 'right',
						offset: { x: 0, y: 0 },
						opacity: 1,
					};

					const targetX = currentX * tileSize + transform.offset.x;
					const targetY = currentY * tileSize + transform.offset.y;
					const targetOpacity = transform.opacity ?? 1;

					const moveDelay = isPlayer ? PLAYER_MOVEMENT_DELAY : 0;

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
							transition={{
								x: {
									type: 'spring',
									stiffness: 300,
									damping: 28,
									delay: moveDelay,
								},
								y: {
									type: 'spring',
									stiffness: 300,
									damping: 28,
									delay: moveDelay,
								},
								opacity: { duration: 0.2, ease: 'easeInOut' },
							}}
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
								facing={transform.facing}
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

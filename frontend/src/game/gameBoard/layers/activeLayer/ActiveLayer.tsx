import React from 'react';
import Tile from '../../Tile/Tile';
import type { Unit } from '../../../../constants/interfaces/player';
import type { UnitTransform } from '../../../../utils/animation/useGameAnimation/unitControl/unitControl';
import { ActiveLayerContainer, AnimatedUnitWrapper } from './ActiveLayerStyles';
import type { ActionType } from '../../../../constants/gameEvent';

interface Props {
	units: Unit[];
	characterId: string;
	tileSize: number;
	board: string[];
	activeUnitStates?: Record<string, ActionType>;
	visualPositions?: Record<string, { x: number; y: number }>;
	unitTransforms?: Record<string, UnitTransform>;
}

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
					const currentX = visualPositions[unit.id]?.x ?? unit.x;
					const currentY = visualPositions[unit.id]?.y ?? unit.y;
					const transform = unitTransforms[unit.id] ?? {
						facing: 'right',
						offset: { x: 0, y: 0 },
					};

					return (
						<AnimatedUnitWrapper
							key={unit.id ?? `unit-${index}`}
							$tileSize={tileSize}
							$zIndex={unit.id === characterId ? 10 : 1}
							initial={false}
							animate={{
								x: currentX * tileSize + transform.offset.x,
								y: currentY * tileSize + transform.offset.y,
							}}
							transition={{
								type: 'spring',
								stiffness: 300,
								damping: 28,
							}}
						>
							<Tile
								char={unit.character}
								x={currentX}
								y={currentY}
								grid={board}
								unit={unit}
								activeActionState={
									activeUnitStates[unit.id] as ActionType
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

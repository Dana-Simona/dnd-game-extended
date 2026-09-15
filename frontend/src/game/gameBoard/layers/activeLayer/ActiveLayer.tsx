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
					const unitId =
						unit.id ||
						(unit.character === '@'
							? characterId
							: `unit-${index}`);

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

					return (
						<AnimatedUnitWrapper
							key={unitId}
							$tileSize={tileSize}
							$zIndex={unitId === characterId ? 10 : 1}
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
								},
								y: {
									type: 'spring',
									stiffness: 300,
									damping: 28,
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

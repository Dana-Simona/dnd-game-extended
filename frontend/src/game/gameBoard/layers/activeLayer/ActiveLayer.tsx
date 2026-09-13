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
		console.log('[ActiveLayer Render]', {
			unitIds: units.map((u) => u.name),
			visualPositionKeys: Object.keys(visualPositions),
			tileSize,
		});
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
					};

					const targetX = currentX * tileSize + transform.offset.x;
					const targetY = currentY * tileSize + transform.offset.y;

					return (
						<AnimatedUnitWrapper
							key={unitId}
							$tileSize={tileSize}
							$zIndex={unitId === characterId ? 10 : 1}
							initial={{
								x: targetX,
								y: targetY,
							}}
							animate={{
								x: targetX,
								y: targetY,
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

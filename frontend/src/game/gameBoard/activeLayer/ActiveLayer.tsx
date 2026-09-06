import React from 'react';
import type { Unit } from '../../../constants/interfaces/player';
import Tile from '../Tile/Tile';
import { ActiveLayerContainer, AnimatedUnitWrapper } from './ActiveLayerStyles';

interface ActiveLayerProps {
	units: Unit[];
	characterId: string;
	tileSize: number;
	board: string[];
	activeUnitStates?: Record<string, string>;
	visualPositions?: Record<string, { x: number; y: number }>;
}

const ActiveLayer: React.FC<ActiveLayerProps> = React.memo(
	({
		units,
		characterId,
		tileSize,
		board,
		activeUnitStates = {},
		visualPositions = {},
	}) => {

		console.log('VISUAL POSITIONS', visualPositions)
		return (
			<ActiveLayerContainer>
				{units.map((unit, index) => {
					const currentX = visualPositions[unit.id]?.x ?? unit.x;
					const currentY = visualPositions[unit.id]?.y ?? unit.y;

					return (
						<AnimatedUnitWrapper
							key={unit.id ?? `unit-${index}`}
							$tileSize={tileSize}
							$zIndex={unit.id === characterId ? 10 : 1}
							initial={false}
							animate={{
								x: currentX * tileSize,
								y: currentY * tileSize,
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
								activeActionState={activeUnitStates[unit.id]}
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

import React from 'react';
import Tile from '../Tile/Tile';
import type { Unit } from '../../../constants/interfaces/player';
import { ActiveLayerContainer, AnimatedUnitWrapper } from './ActiveLayerStyles';

interface ActiveLayerProps {
	units: Unit[];
	characterId: string;
	tileSize: number;
	board: string[];
}

const ActiveLayer: React.FC<ActiveLayerProps> = React.memo(
	({ units, characterId, tileSize, board }) => {
		return (
			<ActiveLayerContainer>
				{units.map((unit, index) => (
					<AnimatedUnitWrapper
						key={unit.id ?? `unit-${index}`}
						$tileSize={tileSize}
						$zIndex={unit.id === characterId ? 10 : 1}
						initial={false}
						animate={{
							x: unit.x * tileSize,
							y: unit.y * tileSize,
						}}
						transition={{
							type: 'spring',
							stiffness: 300,
							damping: 28,
						}}
					>
						<Tile
							char={unit.character}
							x={unit.x}
							y={unit.y}
							grid={board}
							unit={unit}
						/>
					</AnimatedUnitWrapper>
				))}
			</ActiveLayerContainer>
		);
	},
);

ActiveLayer.displayName = 'ActiveLayer';

export default ActiveLayer;

import React from 'react';
import Tile from '../../Tile/Tile';
import { StaticLayerContainer, BoardRow } from './StaticLayerStyles';

interface StaticLayerProps {
	layer: number[][];
}

const StaticLayer: React.FC<StaticLayerProps> = React.memo(
	({ layer }) => {
		if (!layer || !Array.isArray(layer) || layer.length === 0) {
			return null;
		}

		return (
			<StaticLayerContainer>
				{layer.map((row, rowIndex) => {
					if (!Array.isArray(row)) return null;

					return (
						<BoardRow key={rowIndex}>
							{row.map((tileId, colIndex) => (
								<Tile
									key={`${rowIndex}-${colIndex}`}
									tileId={tileId}
									x={colIndex}
									y={rowIndex}
								/>
							))}
						</BoardRow>
					);
				})}
			</StaticLayerContainer>
		);
	},
);

StaticLayer.displayName = 'StaticLayer';

export default StaticLayer;

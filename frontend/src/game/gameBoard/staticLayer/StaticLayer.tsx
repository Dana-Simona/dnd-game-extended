import React from 'react';
import Tile from '../Tile/Tile';
import { getTileConfig } from '../../../utils/tileMapping/tileMapping';
import { StaticLayerContainer, BoardRow } from './StaticLayerStyles';

interface StaticLayerProps {
	board: string[];
}

export const StaticLayer: React.FC<StaticLayerProps> = React.memo(
	({ board }) => {
		if (!board || board.length === 0) {
			return <p>Loading board...</p>;
		}

		return (
			<StaticLayerContainer>
				{board.map((row, rowIndex) => (
					<BoardRow key={rowIndex}>
						{row.split('').map((char, colIndex) => {
							const config = getTileConfig(
								char,
								colIndex,
								rowIndex,
								board,
							);
							const isUnit = config.type === 'sprite';

							const terrainChar = isUnit ? '.' : char;

							return (
								<Tile
									key={`${rowIndex}-${colIndex}`}
									char={terrainChar}
									x={colIndex}
									y={rowIndex}
									grid={board}
								/>
							);
						})}
					</BoardRow>
				))}
			</StaticLayerContainer>
		);
	},
);

StaticLayer.displayName = 'StaticLayer';

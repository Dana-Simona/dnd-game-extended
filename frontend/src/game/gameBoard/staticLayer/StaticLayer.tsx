import React, { useMemo } from 'react';
import Tile from '../Tile/Tile';
import { getTileConfig } from '../../../utils/tileMapping/tileMapping';
import { StaticLayerContainer, BoardRow } from './StaticLayerStyles';

interface StaticLayerProps {
	board: string[];
}

const StaticLayer: React.FC<StaticLayerProps> = React.memo(({ board }) => {
	const sanitizedBoard = useMemo(() => {
		if (!board) return [];
		return board.map((row, rowIndex) =>
			row
				.split('')
				.map((char, colIndex) => {
					const config = getTileConfig(
						char,
						colIndex,
						rowIndex,
						board,
					);
					return config.type === 'sprite' ? '.' : char;
				})
				.join(''),
		);
	}, [board]);

	if (!board || board.length === 0) {
		return <p>Loading board...</p>;
	}

	return (
		<StaticLayerContainer>
			{sanitizedBoard.map((row, rowIndex) => (
				<BoardRow key={rowIndex}>
					{row.split('').map((char, colIndex) => (
						<Tile
							key={`${rowIndex}-${colIndex}`}
							char={char}
							x={colIndex}
							y={rowIndex}
							grid={sanitizedBoard} 
						/>
					))}
				</BoardRow>
			))}
		</StaticLayerContainer>
	);
});

StaticLayer.displayName = 'StaticLayer';

export default StaticLayer;

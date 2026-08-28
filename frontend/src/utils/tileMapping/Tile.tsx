import React from 'react';
import Sprite from '../sprite/Sprite';
import { getTileConfig } from './tileMapping';
import {
	SpriteTileWrapper,
	PositionedSpriteContainer,
	StaticTile,
} from './TileStyles';

interface TileProps {
	char: string;
	x?: number;
	y?: number;
}

const Tile: React.FC<TileProps> = ({ char, x = 0, y = 0 }) => {
	const config = getTileConfig(char, x, y);

	if (config.type === 'sprite') {
		const { type, ...spriteProps } = config;
		const offsetY = (config as { offsetY?: number }).offsetY || 0;

		return (
			<SpriteTileWrapper>
				<PositionedSpriteContainer
					$frameHeight={spriteProps.height}
					$offsetY={offsetY}
				>
					<Sprite {...spriteProps} />
				</PositionedSpriteContainer>
			</SpriteTileWrapper>
		);
	}

	const tileSize = config.tileSize || 32;
	const posX = (config.tileX || 0) * tileSize;
	const posY = (config.tileY || 0) * tileSize;

	return (
		<StaticTile
			$imagePath={config.imagePath}
			$posX={posX}
			$posY={posY}
		/>
	);
};

export default Tile;

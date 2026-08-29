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
	grid?: string[];
}

const Tile: React.FC<TileProps> = ({ char, x = 0, y = 0, grid = [] }) => {
	const config = getTileConfig(char, x, y, grid);

	if (config.type === 'sprite') {
		const { type, ...spriteProps } = config;
		const offsetY = (config as { offsetY?: number }).offsetY || 0;
		const groundConfig = getTileConfig('.', x, y, grid);

		return (
			<SpriteTileWrapper>
				{groundConfig.type === 'static' && (
					<StaticTile
						$imagePath={groundConfig.imagePath}
						$posX={
							(groundConfig.tileX || 0) *
							(groundConfig.tileSize || 32)
						}
						$posY={
							(groundConfig.tileY || 0) *
							(groundConfig.tileSize || 32)
						}
					/>
				)}

				<PositionedSpriteContainer
					$frameHeight={spriteProps.height}
					$offsetY={offsetY}
				>
					<Sprite {...spriteProps} />
				</PositionedSpriteContainer>
			</SpriteTileWrapper>
		);
	}

	if (char === '#' && 'groundImagePath' in config) {
		const wallConfig = config as typeof config & {
			groundImagePath: string;
			groundTileX: number;
			groundTileY: number;
		};

		const tileSize = wallConfig.tileSize || 32;

		return (
			<SpriteTileWrapper>
				<StaticTile
					$imagePath={wallConfig.groundImagePath}
					$posX={wallConfig.groundTileX * tileSize}
					$posY={wallConfig.groundTileY * tileSize}
				/>
				<StaticTile
					$imagePath={wallConfig.imagePath}
					$posX={(wallConfig.tileX || 0) * tileSize}
					$posY={(wallConfig.tileY || 0) * tileSize}
					style={{ position: 'absolute', top: 0, left: 0 }}
				/>
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

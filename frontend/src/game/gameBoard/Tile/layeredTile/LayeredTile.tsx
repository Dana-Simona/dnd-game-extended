import { SpriteTileWrapper, StaticTile } from '../TileStyles';

const LayeredTile: React.FC<{ config: any }> = ({ config }) => {
	const tileSize = config.tileSize || 32;
	return (
		<SpriteTileWrapper>
			<StaticTile
				$imagePath={config.groundImagePath}
				$posX={config.groundTileX * tileSize}
				$posY={config.groundTileY * tileSize}
			/>
			<StaticTile
				$imagePath={config.imagePath}
				$posX={(config.tileX || 0) * tileSize}
				$posY={(config.tileY || 0) * tileSize}
				style={{ position: 'absolute', top: 0, left: 0 }}
			/>
		</SpriteTileWrapper>
	);
};

export default LayeredTile;

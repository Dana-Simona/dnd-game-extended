import { StaticTile } from '../TileStyles';

const BaseStaticTile: React.FC<{ config: any }> = ({ config }) => {
	const tileSize = config.tileSize || 32;
	return (
		<StaticTile
			$imagePath={config.imagePath}
			$posX={(config.tileX || 0) * tileSize}
			$posY={(config.tileY || 0) * tileSize}
		/>
	);
};

export default BaseStaticTile;

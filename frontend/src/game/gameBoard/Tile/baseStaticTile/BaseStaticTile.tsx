import React from 'react';

import { StaticTile } from '../TileStyles';
import type { TileConfig } from '../../../../utils/tileMapping/tileMapping';

const BASE_TILE_SIZE = 32;

interface Props {
	config: TileConfig;
}

const BaseStaticTile: React.FC<Props> = ({ config }) => {
	if (config.type !== 'static') {
		return null;
	}

	const horizontalTiles = config.size?.horizontalTiles || 1;
	const verticalTiles = config.size?.verticalTiles || 1;

	const width = horizontalTiles * BASE_TILE_SIZE;
	const height = verticalTiles * BASE_TILE_SIZE;

	const posX = ((config.tileX || 0) * BASE_TILE_SIZE);
	const posY = ((config.tileY || 0) * BASE_TILE_SIZE);

	return (
		<StaticTile
			$imagePath={config.imagePath}
			$posX={posX}
			$posY={posY}
			style={{
				width: `${width}px`,
				height: `${height}px`,
			}}
		/>
	);
};

export default BaseStaticTile;

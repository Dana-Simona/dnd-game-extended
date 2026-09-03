import React from 'react';
import type { Unit } from '../../../constants/interfaces/player';
import { getTileConfig } from '../../../utils/tileMapping/tileMapping';
import UnitTile from './unitTile/UnitTile';
import LayeredTile from './layeredTile/LayerdTile';
import BaseStaticTile from './baseStaticTile/BaseStaticTile';

interface TileProps {
	char: string;
	x?: number;
	y?: number;
	grid?: string[];
	unit?: Unit;
}

const Tile: React.FC<TileProps> = ({ char, x = 0, y = 0, grid = [], unit }) => {
	const config = getTileConfig(char, x, y, grid);

	if (config.type === 'sprite') {
		const { type, ...spriteProps } = config;
		const offsetY = (config as { offsetY?: number }).offsetY || 0;
		const groundConfig = getTileConfig('.', x, y, grid);

		return (
			<UnitTile
				unit={unit}
				spriteProps={spriteProps}
				offsetY={offsetY}
				groundConfig={groundConfig}
			/>
		);
	}

	if (char === '#' && 'groundImagePath' in config) {
		return <LayeredTile config={config} />;
	}

	return <BaseStaticTile config={config} />;
};

export default Tile;

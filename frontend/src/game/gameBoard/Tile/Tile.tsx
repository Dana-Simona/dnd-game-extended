import React from 'react';
import type { Unit } from '../../../constants/interfaces/player';
import { getTileConfig } from '../../../utils/tileMapping/tileMapping';
import { getUnitSpriteConfig } from '../../../utils/animation/unitAnimations';
import UnitTile from './unitTile/UnitTile';
import LayeredTile from './layeredTile/LayeredTile';
import BaseStaticTile from './baseStaticTile/BaseStaticTile';

interface TileProps {
	char: string;
	x?: number;
	y?: number;
	grid?: string[];
	unit?: Unit;
	activeActionState?: string;
}

const Tile: React.FC<TileProps> = ({
	char,
	x = 0,
	y = 0,
	grid = [],
	unit,
	activeActionState = 'idle',
}) => {
	if (unit) {
		const spriteProps = getUnitSpriteConfig(unit, activeActionState);
		const offsetY = spriteProps.offsetY || 0;

		return (
			<UnitTile
				unit={unit}
				spriteProps={spriteProps}
				offsetY={offsetY}
			/>
		);
	}

	const config = getTileConfig(char, x, y, grid, activeActionState);

	if (char === '#' && 'groundImagePath' in config) {
		return <LayeredTile config={config} />;
	}

	return <BaseStaticTile config={config} />;
};

export default React.memo(Tile);

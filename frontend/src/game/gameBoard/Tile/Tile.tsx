import React from 'react';
import type { Unit } from '../../../constants/interfaces/player';
import { getTileConfig } from '../../../utils/tileMapping/tileMapping';
import { getUnitSpriteConfig } from '../../../utils/animation/spriteAnimations';
import UnitTile from './unitTile/UnitTile';
import LayeredTile from './layeredTile/LayeredTile';
import BaseStaticTile from './baseStaticTile/BaseStaticTile';
import type { ActionType } from '../../../constants/gameEvent';

interface Props {
	char: string;
	x?: number;
	y?: number;
	grid?: string[];
	unit?: Unit;
	activeActionState?: ActionType;
	facing?: 'left' | 'right';
}

const Tile: React.FC<Props> = ({
	char,
	x = 0,
	y = 0,
	grid = [],
	unit,
	activeActionState = 'idle',
	facing = 'right',
}) => {
	if (unit) {
		const spriteProps = getUnitSpriteConfig(
			unit,
			activeActionState as ActionType,
		);
		const offsetY = spriteProps.offsetY || 0;

		return (
			<UnitTile
				unit={unit}
				spriteProps={spriteProps}
				offsetY={offsetY}
				facing={facing}
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

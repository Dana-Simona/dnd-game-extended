import React from 'react';
import UnitTile from './unitTile/UnitTile';
import LayeredTile from './layeredTile/LayeredTile';
import { ActionType } from '../../../constants/gameEvent';
import BaseStaticTile from './baseStaticTile/BaseStaticTile';
import { AnimationPhase } from '../../../utils/sprite/Sprite';
import type { Unit } from '../../../constants/interfaces/unit';
import { getTileConfig } from '../../../utils/tileMapping/tileMapping';
import { getUnitSpriteConfig } from '../../../utils/animation/spriteAnimations';

interface Props {
	char: string;
	x?: number;
	y?: number;
	grid?: string[];
	unit?: Unit;
	activeActionState?: ActionType;
	facing?: 'left' | 'right';
	phase?: AnimationPhase;
}

const Tile: React.FC<Props> = ({
	char,
	x = 0,
	y = 0,
	grid = [],
	unit,
	activeActionState = ActionType.IDLE,
	facing = 'right',
	phase,
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
				phase={phase}
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

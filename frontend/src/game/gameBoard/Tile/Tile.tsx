import React from 'react';
import UnitTile from './unitTile/UnitTile';
import LayeredTile from './layeredTile/LayeredTile';
import BaseStaticTile from './baseStaticTile/BaseStaticTile';
import type { Unit } from '../../../constants/interfaces/unit';
import { getTileConfig } from '../../../utils/tileMapping/tileMapping';
import { UnitFacing } from '../../../constants/animationStates/unitStates';
import { getUnitSpriteConfig } from '../../../utils/animation/spriteAnimations';
import { AnimationPhase, SpritePresets } from '../../../constants/animationStates/spriteStates';
import type { HpState } from '../../../constants/animationStates/hpStates';

interface Props {
	char: string;
	x?: number;
	y?: number;
	grid?: string[];
	unit?: Unit;
	activeActionState?: SpritePresets;
	facing?: UnitFacing;
	phase?: AnimationPhase;
	hpState?: HpState;
}

const Tile: React.FC<Props> = ({
	char,
	x = 0,
	y = 0,
	grid = [],
	unit,
	activeActionState = SpritePresets.IDLE,
	facing = UnitFacing.RIGHT,
	phase,
	hpState,
}) => {
	if (unit) {
		const spriteProps = getUnitSpriteConfig(unit, activeActionState);
		const offsetY = spriteProps.offsetY || 0;

		return (
			<UnitTile
				unit={unit}
				spriteProps={spriteProps}
				offsetY={offsetY}
				facing={facing}
				phase={phase}
				hpState={hpState}
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

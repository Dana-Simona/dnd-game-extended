import React from 'react';

import { EmptyTile } from './TileStyles';
import UnitTile from './unitTile/UnitTile';
import BaseStaticTile from './baseStaticTile/BaseStaticTile';
import type { Unit } from '../../../constants/interfaces/unit';
import { UnitFacing } from '../../../constants/animationStates/unitStates';
import type { HpState } from '../../../constants/animationStates/hpStates';
import { getUnitSpriteConfig } from '../../../utils/animation/spriteAnimations';
import { getDecorativeTileConfig } from '../../../utils/tileMapping/tileMapping';
import {
	AnimationPhase,
	SpritePresets,
} from '../../../constants/animationStates/spriteStates';

interface Props {
	tileId?: number;
	x?: number;
	y?: number;
	unit?: Unit;
	activeActionState?: SpritePresets;
	facing?: UnitFacing;
	phase?: AnimationPhase;
	hpState?: HpState;
}

const Tile: React.FC<Props> = ({
	tileId,
	x = 0,
	y = 0,
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

	if (tileId !== undefined && tileId !== null && tileId >= 0) {
		const config = getDecorativeTileConfig(tileId, x, y);
		if (!config) return <EmptyTile />;

		return <BaseStaticTile config={config} />;
	}

	return <EmptyTile />;
};

export default React.memo(Tile);

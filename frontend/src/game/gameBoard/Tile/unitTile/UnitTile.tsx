import React, { useState } from 'react';

import HealthBar from './healthBar/HealthBar';
import RangeRing from './rangeRing/RangeRing';
import Sprite from '../../../../utils/sprite/Sprite';
import { UnitType, type Unit } from '../../../../constants/interfaces/unit';
import type { AnimationPhase } from '../../../../constants/animationStates/spriteStates';
import type { HpState } from '../../../../utils/animation/useGameAnimation/hpBarControl/useHpBarControl';
import {
	PositionedSpriteContainer,
	SpriteTileWrapper,
	SpriteFlipWrapper,
} from '../TileStyles';
import { UnitFacing } from '../../../../constants/animationStates/unitStates';

interface Props {
	unit?: Unit;
	spriteProps: any;
	phase?: AnimationPhase;
	offsetY: number;
	facing?: UnitFacing;
	visionRange?: number;
	abilityRange?: number;
	tileSize?: number;
	hpState?: HpState;
}

const UnitTile: React.FC<Props> = ({
	unit,
	spriteProps,
	phase,
	offsetY,
	facing = UnitFacing.RIGHT,
	visionRange,
	abilityRange,
	tileSize = 32,
	hpState,
}) => {
	const [isHovered, setIsHovered] = useState(false);

	const isPlayer = unit?.unitType === UnitType.PLAYER;
	const currentHp = hpState?.currentHp ?? unit?.currentHealth ?? 0;
	const maxHp = hpState?.maxHp ?? unit?.health ?? 1;
	const previewHp = hpState?.previewHp;

	return (
		<SpriteTileWrapper
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<RangeRing
				isHovered={isHovered}
				visionRange={visionRange}
				abilityRange={abilityRange}
				tileSize={tileSize}
			/>

			<PositionedSpriteContainer
				$frameHeight={spriteProps.height}
				$offsetY={offsetY}
			>
				{unit && (
					<HealthBar
						currentHp={currentHp}
						previewHp={previewHp}
						maxHp={maxHp}
						isEnemy={!isPlayer}
						offsetY={offsetY}
						hpState={hpState}
					/>
				)}
				<SpriteFlipWrapper
					$isFlipped={facing === UnitFacing.LEFT}
					$isPlayer={isPlayer}
				>
					<Sprite
						{...spriteProps}
						phase={phase}
					/>
				</SpriteFlipWrapper>
			</PositionedSpriteContainer>
		</SpriteTileWrapper>
	);
};

export default UnitTile;

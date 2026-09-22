import React, { useState } from 'react';

import HealthBar from './healthBar/HealthBar';
import RangeRing from './rangeRing/RangeRing';
import type { Player } from '../../../../constants/interfaces/player';
import type { Monster } from '../../../../constants/interfaces/monster';
import Sprite, { type SpriteProps } from '../../../../utils/sprite/Sprite';
import { UnitType, type Unit } from '../../../../constants/interfaces/unit';
import { UnitFacing } from '../../../../constants/animationStates/unitStates';
import type { AnimationPhase } from '../../../../constants/animationStates/spriteStates';
import type { HpState } from '../../../../utils/animation/useGameAnimation/hpBarControl/useHpBarControl';
import {
	PositionedSpriteContainer,
	SpriteTileWrapper,
	SpriteFlipWrapper,
} from '../TileStyles';

interface Props {
	unit?: Unit;
	spriteProps: SpriteProps;
	phase?: AnimationPhase;
	offsetY: number;
	facing?: UnitFacing;
	tileSize?: number;
	hpState?: HpState;
}

const UnitTile: React.FC<Props> = ({
	unit,
	spriteProps,
	phase,
	offsetY,
	facing = UnitFacing.RIGHT,
	tileSize = 32,
	hpState,
}) => {
	const [isHovered, setIsHovered] = useState(false);

	let visionRange;
	if (
		unit?.unitType === UnitType.MONSTER ||
		unit?.unitType === UnitType.BOSS
	) {
		visionRange = (unit as Monster)?.visionRange;
	}

	let abilityRange;
	if (unit?.unitType === UnitType.PLAYER) {
		abilityRange = (unit as Player)?.range;
	}

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

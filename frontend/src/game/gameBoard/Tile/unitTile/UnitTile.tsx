import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';

import HealthBar from './healthBar/HealthBar';
import RangeRing from './rangeRing/RangeRing';
import { SpriteTileWrapper, SpriteFlipWrapper } from '../TileStyles';
import type { Player } from '../../../../constants/interfaces/player';
import Sprite, { type SpriteProps } from '../../../../utils/sprite/Sprite';
import { UnitType, type Unit } from '../../../../constants/interfaces/unit';
import {
	UnitFacing,
	type TrapVisualState,
} from '../../../../constants/animationStates/unitStates';
import type { HpState } from '../../../../constants/animationStates/hpStates';
import type { Monster, Trap } from '../../../../constants/interfaces/monster';
import type { AnimationPhase } from '../../../../constants/animationStates/spriteStates';
import {
	EnemyNameContainer,
	EnemyName,
	PositionedSpriteContainer,
} from './UnitTileStyles';
import TrapUnit from '../../../trap/TrapUnit';

interface Props {
	unit?: Unit;
	spriteProps: SpriteProps;
	phase?: AnimationPhase;
	offsetY: number;
	facing?: UnitFacing;
	tileSize?: number;
	hpState?: HpState;
	trapState?: TrapVisualState;
}

const UnitTile: React.FC<Props> = ({
	unit,
	spriteProps,
	phase,
	offsetY,
	facing,
	tileSize = 32,
	hpState,
	trapState,
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
	const isTrap = unit?.unitType === UnitType.TRAP;

	const effectiveFacing =
		facing ?? (isPlayer ? UnitFacing.RIGHT : UnitFacing.LEFT);

	const currentHp = hpState?.currentHp ?? unit?.currentHealth ?? 0;
	const maxHp = hpState?.maxHp ?? unit?.health ?? 1;
	const previewHp = hpState?.previewHp;

	const isTrapShown =
		isTrap && ((unit as Trap).isVisible || !!trapState?.revealed);

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
				{unit && isTrapShown && (
					<EnemyNameContainer>
						<EnemyName>{unit.name}</EnemyName>
						<HealthBar
							currentHp={currentHp}
							previewHp={previewHp}
							maxHp={maxHp}
							isEnemy={!isPlayer}
							hpState={hpState}
						/>
					</EnemyNameContainer>
				)}

				<AnimatePresence>
					{isTrapShown ? (
						<TrapUnit
							key='trap-unit'
							trap={unit as Trap}
							sway={trapState?.sway}
						/>
					) : (
						<SpriteFlipWrapper
							key='sprite-unit'
							$isFlipped={effectiveFacing === UnitFacing.LEFT}
							$isPlayer={isPlayer}
						>
							<Sprite
								{...spriteProps}
								phase={phase}
							/>
						</SpriteFlipWrapper>
					)}
				</AnimatePresence>
			</PositionedSpriteContainer>
		</SpriteTileWrapper>
	);
};

export default UnitTile;

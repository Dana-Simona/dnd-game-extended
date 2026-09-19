import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import HealthBar from './healthBar/HealthBar';
import Sprite, { type AnimationPhase } from '../../../../utils/sprite/Sprite';
import { UnitType, type Unit } from '../../../../constants/interfaces/unit';
import {
	PositionedSpriteContainer,
	SpriteTileWrapper,
	SpriteFlipWrapper,
} from '../TileStyles';
import { VisionRangeRing, AbilityRangeRing } from './UnitTileStyles';
import type { Monster } from '../../../../constants/interfaces/monster';
import type { HpState } from '../../../../utils/animation/useGameAnimation/hpBarControl/useHpBarControl';

interface Props {
	unit?: Unit;
	spriteProps: any;
	phase?: AnimationPhase;
	offsetY: number;
	facing?: 'left' | 'right';
	visionRange?: number;
	abilityRange?: number;
	tileSize?: number;
	hpState?: HpState;
}

const ringAnimation = {
	initial: { opacity: 0, scale: 0.85 },
	animate: { opacity: 1, scale: 1 },
	exit: { opacity: 0, scale: 0.85 },
	transition: { duration: 0.2, ease: 'easeOut' },
} as const;

const UnitTile: React.FC<Props> = ({
	unit,
	spriteProps,
	phase,
	offsetY,
	facing = 'right',
	visionRange: visionRangeProp,
	abilityRange: abilityRangeProp,
	tileSize = 32,
	hpState,
}) => {
	const [isHovered, setIsHovered] = useState(false);

	const isPlayer =
		unit?.unitType?.toLowerCase() === 'player' ||
		unit?.unitType === UnitType.PLAYER;

	const visionRange =
		visionRangeProp ??
		(!isPlayer ? (unit as Monster)?.visionRange : undefined);

	const abilityRange =
		abilityRangeProp ??
		(isPlayer
			? ((unit as any)?.range ?? (unit as any)?.abilityRange)
			: undefined);

	const currentHp =
		hpState?.currentHp ?? unit?.currentHealth ?? (unit as any)?.hp ?? 0;

	const maxHp = hpState?.maxHp ?? unit?.health ?? (unit as any)?.maxHp ?? 1;

	const previewHp = hpState?.previewHp;

	return (
		<SpriteTileWrapper
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<AnimatePresence>
				{isHovered && visionRange != null && visionRange > 0 && (
					<VisionRangeRing
						$range={visionRange}
						$tileSize={tileSize}
						{...ringAnimation}
					/>
				)}
				{isHovered && abilityRange != null && abilityRange > 0 && (
					<AbilityRangeRing
						$range={abilityRange}
						$tileSize={tileSize}
						{...ringAnimation}
					/>
				)}
			</AnimatePresence>

			<PositionedSpriteContainer
				$frameHeight={spriteProps.height}
				$offsetY={offsetY}
				style={{ pointerEvents: 'none' }}
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
					$isFlipped={facing === 'left'}
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

import React, { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import HealthBar from './healthBar/HealthBar';
import Sprite from '../../../../utils/sprite/Sprite';
import { UnitType, type Unit } from '../../../../constants/interfaces/unit';
import {
	PositionedSpriteContainer,
	SpriteTileWrapper,
	SpriteFlipWrapper,
} from '../TileStyles';
import { VisionRangeRing, AbilityRangeRing } from './UnitTileStyles';
import type { Monster } from '../../../../constants/interfaces/monster';

interface UnitTileProps {
	unit?: Unit;
	spriteProps: any;
	offsetY: number;
	facing?: 'left' | 'right';
	visionRange?: number;
	abilityRange?: number;
	tileSize?: number;
}

const ringAnimation = {
	initial: { opacity: 0, scale: 0.85 },
	animate: { opacity: 1, scale: 1 },
	exit: { opacity: 0, scale: 0.85 },
	transition: { duration: 0.2, ease: 'easeOut' },
} as const;

const UnitTile: React.FC<UnitTileProps> = ({
	unit,
	spriteProps,
	offsetY,
	facing = 'right',
	visionRange: visionRangeProp,
	abilityRange: abilityRangeProp,
	tileSize = 32,
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
						currentHp={unit.currentHealth}
						maxHp={unit.health}
						isEnemy={!isPlayer}
						offsetY={offsetY}
					/>
				)}
				<SpriteFlipWrapper
					$isFlipped={facing === 'left'}
					$isPlayer={isPlayer}
				>
					<Sprite
						{...spriteProps}
						shadow
					/>
				</SpriteFlipWrapper>
			</PositionedSpriteContainer>
		</SpriteTileWrapper>
	);
};

export default UnitTile;

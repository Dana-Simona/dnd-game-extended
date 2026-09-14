import React from 'react';
import HealthBar from './healthBar/HealthBar';
import Sprite from '../../../../utils/sprite/Sprite';
import type { Unit } from '../../../../constants/interfaces/player';
import {
	PositionedSpriteContainer,
	SpriteTileWrapper,
	SpriteFlipWrapper,
} from '../TileStyles';

interface UnitTileProps {
	unit?: Unit;
	spriteProps: any;
	offsetY: number;
	facing?: 'left' | 'right';
}

const UnitTile: React.FC<UnitTileProps> = ({
	unit,
	spriteProps,
	offsetY,
	facing = 'right',
}) => {
	return (
		<SpriteTileWrapper>
			<PositionedSpriteContainer
				$frameHeight={spriteProps.height}
				$offsetY={offsetY}
			>
				{unit && (
					<HealthBar
						currentHp={unit.currentHealth}
						maxHp={unit.health}
						isEnemy={unit.character !== '@'}
						offsetY={offsetY}
					/>
				)}
				<SpriteFlipWrapper $isFlipped={facing === 'left'}>
					<Sprite {...spriteProps} />
				</SpriteFlipWrapper>
			</PositionedSpriteContainer>
		</SpriteTileWrapper>
	);
};

export default UnitTile;

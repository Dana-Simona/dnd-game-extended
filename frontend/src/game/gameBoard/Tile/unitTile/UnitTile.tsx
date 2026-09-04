import React from 'react';
import HealthBar from './healthBar/HealthBar';
import Sprite from '../../../../utils/sprite/Sprite';
import type { Unit } from '../../../../constants/interfaces/player';
import { PositionedSpriteContainer, SpriteTileWrapper } from '../TileStyles';

interface UnitTileProps {
	unit?: Unit;
	spriteProps: any;
	offsetY: number;
}

const UnitTile: React.FC<UnitTileProps> = ({ unit, spriteProps, offsetY }) => {
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
					/>
				)}
				<Sprite {...spriteProps} />
			</PositionedSpriteContainer>
		</SpriteTileWrapper>
	);
};

export default UnitTile;

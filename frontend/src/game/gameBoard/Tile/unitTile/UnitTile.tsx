import type { Unit } from '../../../../constants/interfaces/player';
import Sprite from '../../../../utils/sprite/Sprite';
import {
	PositionedSpriteContainer,
	SpriteTileWrapper,
	StaticTile,
} from '../TileStyles';
import { HealthBar } from './healthBar/HealthBar';

interface Props {
	unit?: Unit;
	spriteProps: any;
	offsetY: number;
	groundConfig: any;
}

const UnitTile: React.FC<Props> = ({
	unit,
	spriteProps,
	offsetY,
	groundConfig,
}) => {
	return (
		<SpriteTileWrapper>
			{groundConfig?.type === 'static' && (
				<StaticTile
					$imagePath={groundConfig.imagePath}
					$posX={
						(groundConfig.tileX || 0) *
						(groundConfig.tileSize || 32)
					}
					$posY={
						(groundConfig.tileY || 0) *
						(groundConfig.tileSize || 32)
					}
				/>
			)}

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

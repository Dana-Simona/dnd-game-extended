import { HealthBar } from './healthBar/HealthBar';
import Sprite from '../../../../utils/sprite/Sprite';
import type { Unit } from '../../../../constants/interfaces/player';
import {
	PositionedSpriteContainer,
	SpriteTileWrapper,
	StaticTile,
} from '../TileStyles';
import { motion } from 'framer-motion';

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

			<motion.div layoutId={unit?.id}>
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
			</motion.div>
		</SpriteTileWrapper>
	);
};

export default UnitTile;

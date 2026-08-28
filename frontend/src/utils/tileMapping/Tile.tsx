import Sprite from '../sprite/Sprite';
import { getTileConfig } from './tileMapping';

interface TileProps {
	char: string;
	x?: number;
	y?: number;
}

const Tile: React.FC<TileProps> = ({ char, x = 0, y = 0 }) => {
	const config = getTileConfig(char, x, y);

	if (config.type === 'sprite') {
		const { type, ...spriteProps } = config;
		return (
			<div style={{ width: 32, height: 32, position: 'relative' }}>
				<Sprite {...spriteProps} />
			</div>
		);
	}

	const tileSize = config.tileSize || 32;
	const posX = (config.tileX || 0) * tileSize;
	const posY = (config.tileY || 0) * tileSize;

	return (
		<div
			style={{
				width: 32,
				height: 32,
				backgroundColor: '#717520',
				backgroundImage: `url(${config.imagePath})`,
				backgroundPosition: `-${posX}px -${posY}px`,
				backgroundRepeat: 'no-repeat',
				imageRendering: 'pixelated',
			}}
		/>
	);
};

export default Tile;

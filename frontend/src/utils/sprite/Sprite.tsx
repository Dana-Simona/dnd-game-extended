import React from 'react';
import { SpriteBox } from './SpriteStyles';

interface SpriteProps {
	imagePath: string;
	width: number;
	height: number;
	frameCount: number;
	fps?: number;
}

const Sprite: React.FC<SpriteProps> = ({
	imagePath,
	width,
	height,
	frameCount,
	fps = 8,
}) => {
	const totalWidth = width * frameCount;
	const duration = frameCount / fps;

	return (
		<SpriteBox
			$imagePath={imagePath}
			$width={width}
			$height={height}
			$totalWidth={totalWidth}
			$frameCount={frameCount}
			$duration={duration}
		/>
	);
};

export default Sprite;

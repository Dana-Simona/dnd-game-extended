import React, { useState, useEffect } from 'react';
import { SpriteBox } from './SpriteStyles';

export interface SpriteProps {
	imagePath: string;
	width: number;
	height: number;
	frameCount: number;
	fps?: number;
	offsetY?: number;
	loop?: boolean;
	loopStartFrame?: number;
	shadow?: boolean;
}

const Sprite: React.FC<SpriteProps> = ({
	imagePath,
	width,
	height,
	frameCount,
	offsetY,
	fps = 8,
	loop = false,
	loopStartFrame = 0,
	shadow = false,
}) => {
	const [isLoopingPhase, setIsLoopingPhase] = useState(false);

	useEffect(() => {
		setIsLoopingPhase(false);
	}, [imagePath, loopStartFrame]);

	const hasCustomLoop = loop && loopStartFrame > 0;
	const isLooping = isLoopingPhase && hasCustomLoop;

	const currentStartFrame = isLooping ? loopStartFrame : 0;
	const currentFrameCount = isLooping
		? frameCount - loopStartFrame
		: frameCount;
	const duration = currentFrameCount / fps;
	const isInfinite = loop && (!hasCustomLoop || isLoopingPhase);

	const handleAnimationEnd = () => {
		if (hasCustomLoop && !isLoopingPhase) {
			setIsLoopingPhase(true);
		}
	};

	return (
		<SpriteBox
			key={`${imagePath}-${currentStartFrame}-${currentFrameCount}`}
			$imagePath={imagePath}
			$width={width}
			$height={height}
			$startFrame={currentStartFrame}
			$frameCount={currentFrameCount}
			$duration={duration}
			$loop={isInfinite}
			$shadow={shadow}
			$offsetY={offsetY}
			onAnimationEnd={handleAnimationEnd}
		/>
	);
};

export default Sprite;

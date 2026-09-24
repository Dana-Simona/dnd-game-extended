import React, { useState, useEffect } from 'react';

import { SpriteBox } from './SpriteStyles';
import { AnimationPhase } from '../../constants/animationStates/spriteStates';

export interface SpriteProps {
	imagePath: string;
	width: number;
	height: number;
	frameCount: number;
	fps?: number;
	offsetY?: number;
	loop?: boolean;
	loopStartFrame?: number;
	impactFrame?: number;
	phase?: AnimationPhase;
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
	impactFrame,
	phase = AnimationPhase.FULL,
}) => {
	const [isLoopingPhase, setIsLoopingPhase] = useState(false);

	useEffect(() => {
		setIsLoopingPhase(false);
	}, [imagePath, loopStartFrame, phase]);

	const isLoopActive = loop || phase === AnimationPhase.LOOP;
	const hasCustomLoop = isLoopActive && loopStartFrame > 0;
	const isLooping = isLoopingPhase && hasCustomLoop;

	let currentStartFrame = isLooping ? loopStartFrame : 0;
	let currentFrameCount = isLooping
		? frameCount - loopStartFrame
		: frameCount;

	if (phase === AnimationPhase.WINDUP && impactFrame !== undefined) {
		currentStartFrame = 0;
		currentFrameCount = impactFrame;
	} else if (
		phase === AnimationPhase.FOLLOW_THROUGH &&
		impactFrame !== undefined
	) {
		currentStartFrame = impactFrame;
		currentFrameCount = frameCount - impactFrame;
	}

	const duration = currentFrameCount / fps;
	const isInfinite =
		isLoopActive &&
		(!hasCustomLoop || isLoopingPhase) &&
		(phase === AnimationPhase.FULL || phase === AnimationPhase.LOOP);

	const handleAnimationEnd = () => {
		if (
			hasCustomLoop &&
			!isLoopingPhase &&
			(phase === AnimationPhase.FULL || phase === AnimationPhase.LOOP)
		) {
			setIsLoopingPhase(true);
		}
	};

	return (
		<SpriteBox
			key={`${imagePath}-${currentStartFrame}-${currentFrameCount}-${phase}`}
			$imagePath={imagePath}
			$width={width}
			$height={height}
			$startFrame={currentStartFrame}
			$frameCount={currentFrameCount}
			$duration={duration}
			$loop={isInfinite}
			$offsetY={offsetY}
			onAnimationEnd={handleAnimationEnd}
		/>
	);
};

export default Sprite;

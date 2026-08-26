import React from 'react';
import { motion } from 'framer-motion';
import {
	Card,
	BaseCanvas,
	OverlayCanvas,
	OverlayLabel,
} from './LevelOptionsStyles';
import { useLevelOptions } from './useLevelOptions';

const MotionBaseCanvas = motion(BaseCanvas);

interface Props {
	imagePath: string;
	levelName: string;
}

const LevelOption: React.FC<Props> = ({ imagePath, levelName }) => {
	const { baseCanvasRef, overlayCanvasRef, controls } =
		useLevelOptions(imagePath);

	return (
		<Card>
			<MotionBaseCanvas
				ref={baseCanvasRef}
				animate={controls}
			/>
			<OverlayCanvas ref={overlayCanvasRef} />
			<OverlayLabel>{levelName}</OverlayLabel>
		</Card>
	);
};

export default LevelOption;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import hoverSoundFile from '../../assets/audio/menu/button_hover.mp3';
import clickSoundFile from '../../assets/audio/menu/tv_static/level_confirm_click.mp3';
import { ROUTES } from '../../constants/routes';
import useSound from '../../utils/useSound/useSound';
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
	const navigate = useNavigate();
	const { baseCanvasRef, overlayCanvasRef, controls } =
		useLevelOptions(imagePath);

	const playHoverSound = useSound(hoverSoundFile);
	const playClickSound = useSound(clickSoundFile);

	const handleClick = () => {
		playClickSound();
		navigate(ROUTES.GAME);
	};

	return (
		<Card
			onMouseEnter={playHoverSound}
			onClick={handleClick}
		>
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

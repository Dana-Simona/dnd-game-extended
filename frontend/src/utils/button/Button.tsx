import React from 'react';
import { ActionButton } from './ButtonStyles';
import hoverSoundFile from '../../assets/audio/menu/button_hover.mp3';
import bigClickSoundFile from '../../assets/audio/menu/button_big_click.mp3';
import simpleClickSoundFile from '../../assets/audio/menu/button_simple_click.mp3';
import useSound from '../useSound/useSound';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'Primary' | 'Secondary';
	enableAudio?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
	children,
	variant = 'Primary',
	enableAudio = true,
	onMouseEnter,
	onClick,
	...rest
}) => {
	const playHoverSound = useSound(hoverSoundFile, { enabled: enableAudio });
	const playBigClickSound = useSound(bigClickSoundFile, {
		enabled: enableAudio,
	});
	const playSimpleClickSound = useSound(simpleClickSoundFile, {
		enabled: enableAudio,
	});

	const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
		playHoverSound();
		if (onMouseEnter) onMouseEnter(e);
	};

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (variant === 'Secondary') {
			playSimpleClickSound();
		} else {
			playBigClickSound();
		}
		if (onClick) onClick(e);
	};

	return (
		<ActionButton
			$variant={variant}
			onMouseEnter={handleMouseEnter}
			onClick={handleClick}
			{...rest}
		>
			{children}
		</ActionButton>
	);
};

export default Button;

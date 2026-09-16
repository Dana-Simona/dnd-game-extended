import React, { useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import Sprite, { type SpriteProps } from '../../../utils/sprite/Sprite';
import Button from '../../../utils/button/Button';
import clickSoundFile from '../../../assets/audio/menu/page_transition.mp3';
import useSound from '../../../utils/useSound/useSound';
import {
	ArrowButton,
	BackgroundAmbiance,
	CharacterWrapper,
	DisplayContainer,
	FloorLine,
	MainCharacter,
	MainContainer,
	PageContainer,
	Reflection,
	SpriteScaler,
	Title,
} from './CharacterDisplayStyles';

const CONFIRM = 'Confirm';

export interface CharacterDisplayOptions {
	title: string;
	onConfirm: () => void;
	description?: React.ReactElement;
	spriteProps: SpriteProps;
}

interface Props<T extends CharacterDisplayOptions> {
	options: T[];
	setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
	selectedIndex: number;
}

const characterVariants: Variants = {
	initial: {
		x: -250,
		opacity: 0,
		scale: 1.8,
		filter: 'blur(8px)',
	},
	enter: (direction: number) => ({
		x: direction > 0 ? 250 : -250,
		opacity: 0,
		scale: 1,
		filter: 'blur(0px)',
	}),
	center: {
		x: 0,
		opacity: 1,
		scale: 1,
		filter: 'blur(0px)',
	},
	exit: (direction: number) => ({
		x: direction > 0 ? -250 : 250,
		opacity: 0,
		scale: 1,
		filter: 'blur(0px)',
	}),
	confirm: {
		x: 250,
		scale: 1.8,
		opacity: 0,
		filter: 'blur(8px)',
		transition: {
			duration: 0.5,
			ease: [0.4, 0, 0.2, 1],
		},
	},
};

const titleVariants: Variants = {
	initial: {
		x: -100,
		opacity: 0,
		scale: 1.4,
		filter: 'blur(4px)',
	},
	enter: (direction: number) => ({
		x: direction > 0 ? 100 : -100,
		opacity: 0,
		scale: 1,
		filter: 'blur(0px)',
	}),
	center: {
		x: 0,
		opacity: 1,
		scale: 1,
		filter: 'blur(0px)',
	},
	exit: (direction: number) => ({
		x: direction > 0 ? -100 : 100,
		opacity: 0,
		scale: 1,
		filter: 'blur(0px)',
	}),
	confirm: {
		x: 100,
		scale: 1.4,
		opacity: 0,
		filter: 'blur(4px)',
		transition: {
			duration: 0.4,
			ease: [0.4, 0, 0.2, 1],
		},
	},
};

const AnimatedTitle = motion(Title);

export const CharacterDisplay = <T extends CharacterDisplayOptions>({
	options,
	setSelectedIndex,
	selectedIndex,
}: Props<T>) => {
	const [direction, setDirection] = useState<number>(1);
	const [isConfirming, setIsConfirming] = useState<boolean>(false);
	const [isInitialMount, setIsInitialMount] = useState<boolean>(true);

	const playClickSound = useSound(clickSoundFile);

	if (!options || options.length === 0) return null;

	const handleNext = () => {
		if (isConfirming) return;
		playClickSound();
		if (isInitialMount) setIsInitialMount(false);
		setDirection(1);
		setSelectedIndex(
			(prev) => (prev + 1 + options.length) % options.length,
		);
	};

	const handlePrev = () => {
		if (isConfirming) return;
		playClickSound();
		if (isInitialMount) setIsInitialMount(false);
		setDirection(-1);
		setSelectedIndex(
			(prev) => (prev - 1 + options.length) % options.length,
		);
	};

	const handleConfirm = () => {
		if (isConfirming) return;
		setIsConfirming(true);

		setTimeout(() => {
			options[selectedIndex].onConfirm();
		}, 500);
	};

	const currentOption = options[selectedIndex];

	return (
		<PageContainer>
			<MainContainer>
				<ArrowButton
					onClick={handlePrev}
					disabled={isConfirming}
				>
					&lsaquo;
				</ArrowButton>

				<DisplayContainer>
					<BackgroundAmbiance>
						<FloorLine />

						<AnimatePresence
							custom={direction}
							mode='wait'
						>
							<React.Fragment key={selectedIndex}>
								<AnimatedTitle
									custom={direction}
									variants={titleVariants}
									initial={
										isInitialMount ? 'initial' : 'enter'
									}
									animate={
										isConfirming ? 'confirm' : 'center'
									}
									exit='exit'
									transition={{
										x: {
											type: 'spring',
											stiffness: 250,
											damping: 25,
										},
										scale: { duration: 0.4 },
										filter: { duration: 0.4 },
										opacity: { duration: 0.25 },
									}}
								>
									{currentOption.title}
								</AnimatedTitle>

								<motion.div
									custom={direction}
									variants={characterVariants}
									initial={
										isInitialMount ? 'initial' : 'enter'
									}
									animate={
										isConfirming ? 'confirm' : 'center'
									}
									exit='exit'
									transition={{
										x: {
											type: 'spring',
											stiffness: 300,
											damping: 30,
										},
										scale: { duration: 0.4 },
										filter: { duration: 0.4 },
										opacity: { duration: 0.2 },
									}}
								>
									<SpriteScaler>
										<CharacterWrapper>
											<MainCharacter>
												<Sprite
													{...currentOption.spriteProps}
												/>
											</MainCharacter>

											<Reflection>
												<Sprite
													{...currentOption.spriteProps}
												/>
											</Reflection>
										</CharacterWrapper>
									</SpriteScaler>
									{options[selectedIndex].description}
								</motion.div>
							</React.Fragment>
						</AnimatePresence>
					</BackgroundAmbiance>
				</DisplayContainer>

				<ArrowButton
					onClick={handleNext}
					disabled={isConfirming}
				>
					&rsaquo;
				</ArrowButton>
			</MainContainer>
			<Button
				onClick={handleConfirm}
				disabled={isConfirming}
			>
				{CONFIRM}
			</Button>
		</PageContainer>
	);
};

export default CharacterDisplay;

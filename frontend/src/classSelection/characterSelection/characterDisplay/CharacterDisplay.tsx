import React, { useState } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import Sprite from '../../../utils/sprite/Sprite';
import Button from '../../../utils/button/Button';
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
	imagePath: string;
	onConfirm: () => void;
}

interface Props<T extends CharacterDisplayOptions> {
	options: T[];
	setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
	selectedIndex: number;
}

const characterVariants: Variants = {
	enter: (direction: number) => ({
		x: direction > 0 ? 250 : -250,
		opacity: 0,
	}),
	center: {
		x: 0,
		opacity: 1,
	},
	exit: (direction: number) => ({
		x: direction > 0 ? -250 : 250,
		opacity: 0,
	}),
};

const titleVariants: Variants = {
	enter: (direction: number) => ({
		x: direction > 0 ? 100 : -100,
		opacity: 0,
	}),
	center: {
		x: 0,
		opacity: 1,
	},
	exit: (direction: number) => ({
		x: direction > 0 ? -100 : 100,
		opacity: 0,
	}),
};

const AnimatedTitle = motion(Title);

export const CharacterDisplay = <T extends CharacterDisplayOptions>({
	options,
	setSelectedIndex,
	selectedIndex,
}: Props<T>) => {
	const [direction, setDirection] = useState<number>(1);

	if (!options || options.length === 0) return null;

	const handleNext = () => {
		setDirection(1);
		setSelectedIndex(
			(prev) => (prev + 1 + options.length) % options.length,
		);
	};

	const handlePrev = () => {
		setDirection(-1);
		setSelectedIndex(
			(prev) => (prev - 1 + options.length) % options.length,
		);
	};

	const currentOption = options[selectedIndex];

	return (
		<PageContainer>
			<MainContainer>
				<ArrowButton onClick={handlePrev}>&lsaquo;</ArrowButton>

				<DisplayContainer>
					<BackgroundAmbiance>
						<FloorLine />

						<AnimatePresence
							initial={false}
							custom={direction}
							mode='wait'
						>
							<React.Fragment key={selectedIndex}>
								<AnimatedTitle
									custom={direction}
									variants={titleVariants}
									initial='enter'
									animate='center'
									exit='exit'
									transition={{
										x: {
											type: 'spring',
											stiffness: 250,
											damping: 25,
										},
										opacity: { duration: 0.25 },
									}}
								>
									{currentOption.title}
								</AnimatedTitle>

								<motion.div
									custom={direction}
									variants={characterVariants}
									initial='enter'
									animate='center'
									exit='exit'
									transition={{
										x: {
											type: 'spring',
											stiffness: 300,
											damping: 30,
										},
										opacity: { duration: 0.2 },
									}}
								>
									<SpriteScaler>
										<CharacterWrapper>
											<MainCharacter>
												<Sprite
													imagePath={
														currentOption.imagePath
													}
													width={48}
													height={64}
													frameCount={8}
													fps={4}
												/>
											</MainCharacter>

											<Reflection>
												<Sprite
													imagePath={
														currentOption.imagePath
													}
													width={48}
													height={64}
													frameCount={8}
													fps={4}
												/>
											</Reflection>
										</CharacterWrapper>
									</SpriteScaler>
								</motion.div>
							</React.Fragment>
						</AnimatePresence>
					</BackgroundAmbiance>
				</DisplayContainer>

				<ArrowButton onClick={handleNext}>&rsaquo;</ArrowButton>
			</MainContainer>
			<Button>{CONFIRM}</Button>
		</PageContainer>
	);
};

export default CharacterDisplay;

import React from 'react';
import {
	Container,
	Grid,
	Title,
	CharacterWrapper,
	ButtonContainer,
} from './LevelSelectionStyles';
import LevelOption from './levelOption/LevelOption';
import Sprite from '../utils/sprite/Sprite';
import Button from '../utils/button/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { useCharacter } from '../utils/characterContext/CharacterContext';
import { getUnitSpriteConfig } from '../utils/animation/spriteAnimations';
import { ActionType } from '../constants/gameEvent';

const levelImages = import.meta.glob<{ default: string }>(
	'/src/assets/levelThumbnails/level*.jpg',
	{ eager: true },
);

const LEVELS = [1, 2, 3, 4, 5, 6].map((num) => {
	const path = `/src/assets/levelThumbnails/level${num}.jpg`;
	return {
		id: num,
		imagePath: levelImages[path]?.default || '',
	};
});

const LevelSelection: React.FC = () => {
	const navigate = useNavigate();
	const { character } = useCharacter();

	const spriteProps = character
		? getUnitSpriteConfig({ ...character, character: '@' }, ActionType.IDLE)
		: null;

	const onBackClick = () => {
		navigate(ROUTES.CHARACTER_SELECTION);
	};

	return (
		<Container>
			<ButtonContainer>
				<Button
					variant='Secondary'
					onClick={onBackClick}
				>
					Back
				</Button>
			</ButtonContainer>
			<Title>Select Level</Title>

			<Grid>
				{LEVELS.map((level) => (
					<LevelOption
						key={level.id}
						imagePath={level.imagePath}
						levelNum={level.id}
					/>
				))}
				{spriteProps && (
					<CharacterWrapper>
						<Sprite {...spriteProps} />
					</CharacterWrapper>
				)}
			</Grid>
		</Container>
	);
};

export default LevelSelection;

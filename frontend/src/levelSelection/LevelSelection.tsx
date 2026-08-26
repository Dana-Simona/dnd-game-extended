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
import Idle from '../assets/The Female Adventurer - Free/Idle/Idle.png';
import Button from '../utils/button/Button';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';

const levelImages = import.meta.glob<{ default: string }>(
	'/src/assets/levelThumbnails/level*.jpg',
	{ eager: true },
);

const LEVELS = [1, 2, 3, 4, 5, 6].map((num) => {
	const path = `/src/assets/levelThumbnails/level${num}.jpg`;
	return {
		id: num,
		title: `Level ${num}`,
		imagePath: levelImages[path]?.default || '',
	};
});

const LevelSelection: React.FC = () => {
	const navigate = useNavigate();

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
						levelName={level.title}
					/>
				))}
				<CharacterWrapper>
					<Sprite
						imagePath={Idle}
						width={48}
						height={64}
						frameCount={8}
						fps={4}
					/>
				</CharacterWrapper>
			</Grid>
		</Container>
	);
};

export default LevelSelection;

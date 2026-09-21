import React from 'react';
import { useNavigate } from 'react-router-dom';

import Sprite from '../utils/sprite/Sprite';
import Button from '../utils/button/Button';
import { ROUTES } from '../constants/routes';
import LevelOption from './levelOption/LevelOption';
import { UnitType } from '../constants/interfaces/unit';
import { useCharacter } from '../utils/characterContext/CharacterContext';
import { SpritePresets } from '../constants/animationStates/spriteStates';
import { getUnitSpriteConfig } from '../utils/animation/spriteAnimations';
import {
	Container,
	Grid,
	Title,
	CharacterWrapper,
	ButtonContainer,
} from './LevelSelectionStyles';

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
		? getUnitSpriteConfig(
				{ ...character, unitType: UnitType.PLAYER },
				SpritePresets.IDLE,
			)
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

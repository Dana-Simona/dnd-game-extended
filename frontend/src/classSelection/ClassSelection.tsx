import React, { useState } from 'react';
import CharacterDisplay, {
	type CharacterDisplayOptions,
} from './characterSelection/characterDisplay/CharacterDisplay';
import { Container } from './ClassSelectionStyles';
import idleDownImg from '../assets/The Female Adventurer - Free/Idle/Idle_Down.png';
import idleUpImg from '../assets/The Female Adventurer - Free/Idle/Idle_Right_Up.png';
import idleRightImg from '../assets/The Female Adventurer - Free/Idle/Idle_Right_Down.png';
import idleLeftImg from '../assets/The Female Adventurer - Free/Idle/Idle_Left_Down.png';
import { useNavigate } from 'react-router-dom';
import { ClassTypes } from '../constants/classTypes';
import { ButtonContainer } from './characterSelection/CharacterSelectionStyles';
import Button from '../utils/button/Button';

const ClassSelection: React.FC = () => {
	const navigate = useNavigate();

	const characterClasses: CharacterDisplayOptions[] = [
		{
			title: ClassTypes.WARRIOR,
			imagePath: idleDownImg,
			onConfirm: () => {
				navigate(ClassTypes.WARRIOR);
			},
		},
		{
			title: ClassTypes.MAGE,
			imagePath: idleRightImg,
			onConfirm: () => {
				navigate(ClassTypes.MAGE);
			},
		},
		{
			title: ClassTypes.ROGUE,
			imagePath: idleUpImg,
			onConfirm: () => {
				navigate(ClassTypes.ROGUE);
			},
		},
		{
			title: ClassTypes.HUNTER,
			imagePath: idleLeftImg,
			onConfirm: () => {
				navigate(ClassTypes.HUNTER);
			},
		},
	];
	const [selectedIndex, setSelectedIndex] = useState<number>(0);

	const onBackClick = () => {
		navigate('..', { relative: 'path' });
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
			<CharacterDisplay
				options={characterClasses}
				setSelectedIndex={setSelectedIndex}
				selectedIndex={selectedIndex}
			/>
		</Container>
	);
};

export default ClassSelection;

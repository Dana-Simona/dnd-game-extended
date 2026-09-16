import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../utils/button/Button';
import CharacterDisplay, {
	type CharacterDisplayOptions,
} from './characterSelection/characterDisplay/CharacterDisplay';
import { Container } from './ClassSelectionStyles';
import { ClassAbilityDescription, ClassTypes } from '../constants/classTypes';
import { ButtonContainer } from './characterSelection/CharacterSelectionStyles';
import AbilityDescription from './abilityDescription/AbilityDescription';
import { ActionType } from '../constants/gameEvent';
import { getUnitSpriteConfig } from '../utils/animation/spriteAnimations';
import type { AllPlayerData } from '../constants/interfaces/player';

const getInitialClassIndex = (classes: CharacterDisplayOptions[]): number => {
	const savedClass = sessionStorage.getItem('selectedClass');
	if (!savedClass) return 0;

	const savedIndex = classes.findIndex(
		(c) => c.title.toLowerCase() === savedClass.toLowerCase(),
	);

	return savedIndex !== -1 ? savedIndex : 0;
};

const ClassSelection: React.FC = () => {
	const navigate = useNavigate();

	const characterClasses: CharacterDisplayOptions[] = [
		{
			title: ClassTypes.WARRIOR,
			spriteProps: {
				...getUnitSpriteConfig(
					{
						name: 'jonsnow',
						class: ClassTypes.WARRIOR,
						character: '@',
					} as AllPlayerData,
					ActionType.ABILITY_CAST,
				),
				loop: true,
			},
			onConfirm: () => {
				sessionStorage.setItem('selectedClass', ClassTypes.WARRIOR);
				navigate(ClassTypes.WARRIOR);
			},
			description: (
				<AbilityDescription
					description={ClassAbilityDescription.WARRIOR}
				/>
			),
		},
		{
			title: ClassTypes.MAGE,
			spriteProps: {
				...getUnitSpriteConfig(
					{
						name: 'melisandre',
						class: ClassTypes.MAGE,
						character: '@',
					} as AllPlayerData,
					ActionType.ABILITY_CAST,
				),
				loop: true,
			},
			onConfirm: () => {
				sessionStorage.setItem('selectedClass', ClassTypes.MAGE);
				navigate(ClassTypes.MAGE);
			},
			description: (
				<AbilityDescription
					description={ClassAbilityDescription.MAGE}
				/>
			),
		},
		{
			title: ClassTypes.ROGUE,
			spriteProps: {
				...getUnitSpriteConfig(
					{
						name: 'aryastark',
						class: ClassTypes.ROGUE,
						character: '@',
					} as AllPlayerData,
					ActionType.ABILITY_CAST,
				),
				loop: true,
			},
			onConfirm: () => {
				sessionStorage.setItem('selectedClass', ClassTypes.ROGUE);
				navigate(ClassTypes.ROGUE);
			},
			description: (
				<AbilityDescription
					description={ClassAbilityDescription.ROGUE}
				/>
			),
		},
		{
			title: ClassTypes.HUNTER,
			spriteProps: {
				...getUnitSpriteConfig(
					{
						name: 'ygritte',
						class: ClassTypes.HUNTER,
						character: '@',
					} as AllPlayerData,
					ActionType.ABILITY_CAST,
				),
				loop: true,
			},
			onConfirm: () => {
				sessionStorage.setItem('selectedClass', ClassTypes.HUNTER);
				navigate(ClassTypes.HUNTER);
			},
			description: (
				<AbilityDescription
					description={ClassAbilityDescription.HUNTER}
				/>
			),
		},
	];

	const [selectedIndex, setSelectedIndex] = useState<number>(() =>
		getInitialClassIndex(characterClasses),
	);

	const handleSetSelectedIndex = (action: React.SetStateAction<number>) => {
		const nextIndex =
			typeof action === 'function' ? action(selectedIndex) : action;
		setSelectedIndex(nextIndex);

		const targetClass = characterClasses[nextIndex]?.title;
		if (targetClass) {
			sessionStorage.setItem('selectedClass', targetClass);
		}
	};

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
				setSelectedIndex={handleSetSelectedIndex}
				selectedIndex={selectedIndex}
			/>
		</Container>
	);
};

export default ClassSelection;

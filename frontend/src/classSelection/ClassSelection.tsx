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
			onConfirm: () => navigate(ClassTypes.WARRIOR),
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
			onConfirm: () => navigate(ClassTypes.MAGE),
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
			onConfirm: () => navigate(ClassTypes.ROGUE),
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
			onConfirm: () => navigate(ClassTypes.HUNTER),
			description: (
				<AbilityDescription
					description={ClassAbilityDescription.HUNTER}
				/>
			),
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

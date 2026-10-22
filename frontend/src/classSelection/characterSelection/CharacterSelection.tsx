import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ButtonContainer, DisplayContainer } from './CharacterSelectionStyles';
import CharacterDisplay, {
	type CharacterDisplayOptions,
} from './characterDisplay/CharacterDisplay';
import type { AllPlayerData } from '../../constants/interfaces/player';
import Button from '../../utils/button/Button';
import Stats from './Stats/Stats';
import { useCharacter } from '../../utils/characterContext/CharacterContext';
import { getUnitSpriteConfig } from '../../utils/animation/spriteAnimations';
import { UnitType } from '../../constants/interfaces/unit';
import { SpritePresets } from '../../constants/animationStates/spriteStates';
import { ROUTES } from '../../constants/routes';
import { API_BASE_URL } from '../../constants/apiUrl';
import LoadingScreen from './loadingScreen/LoadingScreen';

export type Character = AllPlayerData & CharacterDisplayOptions;

export const CharacterSelection: React.FC = () => {
	const { classType } = useParams<{ classType?: string }>();
	const navigate = useNavigate();
	const { selectCharacter, resetCharacter } = useCharacter();

	const [characters, setCharacters] = useState<Character[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const handleConfirmSelection = (
		player: AllPlayerData,
		playerIndex: number,
	) => {
		fetch(`${API_BASE_URL}/api/select-player`, {
			method: 'POST',
			headers: { 'Content-Type': 'text/plain' },
			body: playerIndex.toString(),
		})
			.then((res) => {
				if (!res.ok)
					throw new Error('Failed to select player on server');

				selectCharacter(player);
				navigate(ROUTES.GAME);
			})
			.catch((err) => console.error('Error selecting player:', err));
	};

	useEffect(() => {
		resetCharacter();
	}, [resetCharacter]);

	useEffect(() => {
		if (classType) {
			sessionStorage.setItem('selectedClass', classType);
		}
	}, [classType]);

	useEffect(() => {
		fetch(`${API_BASE_URL}/api/players`)
			.then((res) => res.json())
			.then((data: AllPlayerData[]) => {
				const enrichedCharacters: Character[] = data.map(
					(player, index) => {
						const spriteConfig = getUnitSpriteConfig(
							{ ...player, unitType: UnitType.PLAYER },
							SpritePresets.IDLE,
						);

						return {
							...player,
							spriteProps: spriteConfig,
							title: player.name,
							onConfirm: () =>
								handleConfirmSelection(player, index),
							description: (
								<Stats
									data={{
										health: player.health,
										defense: player.defense,
										attack: player.attack,
										cooldown: player.cooldown,
										manaPool: player.manaPool,
										manaCost: player.manaCost,
										spellPower: player.spellPower,
										hitCount: player.hitCount,
										range: player.range,
										cost: player.energyCost,
									}}
								/>
							),
						};
					},
				);

				setCharacters(enrichedCharacters);
				setLoading(false);
			})
			.catch((error) => {
				console.error('Error fetching characters:', error);
				setLoading(false);
			});
	}, []);

	const filteredCharacters = classType
		? characters.filter(
				(c) => c.class.toLowerCase() === classType.toLowerCase(),
			)
		: characters;

	const displayedCharacters =
		filteredCharacters.length > 0 ? filteredCharacters : characters;

	const [selectedIndex, setSelectedIndex] = useState<number>(0);

	useEffect(() => {
		setSelectedIndex(0);
	}, [classType]);

	useEffect(() => {
		if (!loading && displayedCharacters.length > 0) {
			const currentSelected = displayedCharacters[selectedIndex];
			const currentClass = currentSelected.class.toLowerCase();

			if (classType?.toLowerCase() !== currentClass) {
				navigate(`/characterSelection/${currentClass}`, {
					replace: true,
				});
			}
		}
	}, [loading, displayedCharacters, selectedIndex, classType, navigate]);

	const handleSetSelectedIndex = (action: React.SetStateAction<number>) => {
		const nextIndex =
			typeof action === 'function' ? action(selectedIndex) : action;
		const targetCharacter = displayedCharacters[nextIndex];

		setSelectedIndex(nextIndex);

		if (targetCharacter) {
			const targetClass = targetCharacter.class.toLowerCase();
			if (classType?.toLowerCase() !== targetClass) {
				navigate(`/characterSelection/${targetClass}`);
			}
		}
	};

	const onBackClick = () => {
		navigate('..', { relative: 'path' });
	};

	if (loading) {
		return <LoadingScreen />;
	}

	return (
		<DisplayContainer>
			<ButtonContainer>
				<Button
					variant='Secondary'
					onClick={onBackClick}
				>
					Back
				</Button>
			</ButtonContainer>
			<CharacterDisplay
				options={displayedCharacters}
				setSelectedIndex={handleSetSelectedIndex}
				selectedIndex={selectedIndex}
			/>
		</DisplayContainer>
	);
};

export default CharacterSelection;

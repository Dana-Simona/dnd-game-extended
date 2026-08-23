import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ButtonContainer, DisplayContainer } from './CharacterSelectionStyles';
import idleRightImg from '../../assets/The Female Adventurer - Free/Idle/Idle_Right_Down.png';
import CharacterDisplay, {
	type CharacterDisplayOptions,
} from './characterDisplay/CharacterDisplay';
import type {
	Hunter,
	Mage,
	Rogue,
	Warrior,
} from '../../constants/interfaces/player';
import Button from '../../utils/button/Button';

type PlayerData = Warrior | Mage | Rogue | Hunter;

export type Character = PlayerData & CharacterDisplayOptions;

export const CharacterSelection: React.FC = () => {
	const { classType } = useParams<{ classType?: string }>();
	const navigate = useNavigate();

	const [characters, setCharacters] = useState<Character[]>([]);
	const [loading, setLoading] = useState<boolean>(true);

	const handleConfirmSelection = (playerIndex: number) => {
		fetch('http://localhost:8080/api/select-player', {
			method: 'POST',
			headers: { 'Content-Type': 'text/plain' },
			body: playerIndex.toString(),
		})
			.then(() => navigate('/levelSelection'))
			.catch((err) => console.error('Error selecting player:', err));
	};

	useEffect(() => {
		fetch('http://localhost:8080/api/players')
			.then((res) => res.json())
			.then((data: PlayerData[]) => {
				const enrichedCharacters: Character[] = data.map(
					(player, index) => {
						return {
							...player,
							title: player.name,
							imagePath: idleRightImg,
							//TODO: the character animations will be fetched dynamically:
							// imagePath: new URL(
							// 	`../../assets/player/${player.class.toLowerCase()}/${player.name.toLowerCase()}/idle.png`,
							// 	import.meta.url,
							// ).href,
							onConfirm: () => handleConfirmSelection(index),
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
		return <DisplayContainer>Loading characters...</DisplayContainer>;
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

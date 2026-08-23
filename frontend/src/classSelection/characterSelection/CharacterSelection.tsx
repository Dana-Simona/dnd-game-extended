import React, { useState, useEffect } from 'react';
import { ArrowButton, DisplayContainer } from './CharacterSelectionStyles';
import CharacterDisplay from './characterDisplay/CharacterDisplay';
import type {
	Hunter,
	Mage,
	Rogue,
	Warrior,
} from '../../constants/interfaces/player';

interface Character extends Warrior, Mage, Rogue, Hunter {
	index: number;
}

const CharacterSelection: React.FC = () => {
	const [characters, setCharacters] = useState<Character[]>([]);
	const [selectedIndex, setSelectedIndex] = useState<number>(0);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		fetch('http://localhost:8080/api/players')
			.then((res) => res.json())
			.then((data: Character[]) => {
				setCharacters(data);
				setLoading(false);
			})
			.catch((error) => {
				console.error('Error fetching characters:', error);
				setLoading(false);
			});
	}, []);

	const handleSelectPlayer = (index: number) => {
		setSelectedIndex(index);

		fetch('http://localhost:8080/api/select-player', {
			method: 'POST',
			headers: { 'Content-Type': 'text/plain' },
			body: index.toString(),
		}).catch((err) => console.error('Error selecting player:', err));
	};

	const handlePrev = () => {
		console.log(characters);

		if (characters.length === 0) return;
		const newIndex =
			(selectedIndex - 1 + characters.length) % characters.length;
		handleSelectPlayer(newIndex);
	};

	const handleNext = () => {
		if (characters.length === 0) return;
		const newIndex = (selectedIndex + 1) % characters.length;
		handleSelectPlayer(newIndex);
	};

	if (loading) {
		return <DisplayContainer>Loading characters...</DisplayContainer>;
	}

	const currentCharacter = characters[selectedIndex];

	return (
		<DisplayContainer>
			<ArrowButton onClick={handlePrev}>&lsaquo;</ArrowButton>

			{/* Pass character data or index down to your display component */}
			{/* <CharacterDisplay character={currentCharacter} /> */}
			{/* <CharacterDisplay /> */}

			<ArrowButton onClick={handleNext}>&rsaquo;</ArrowButton>
		</DisplayContainer>
	);
};

export default CharacterSelection;

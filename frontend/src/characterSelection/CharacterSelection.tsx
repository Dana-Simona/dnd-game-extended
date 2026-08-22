import React from 'react';
import { ArrowButton, DisplayContainer } from './CharacterSelectionStyles';
import CharacterDisplay from './characterDisplay/CharacterDisplay';

const CharacterSelection: React.FC = () => {
	return (
		<DisplayContainer>
			<ArrowButton>&lsaquo;</ArrowButton>
			<CharacterDisplay />
			<ArrowButton>&rsaquo;</ArrowButton>
		</DisplayContainer>
	);
};

export default CharacterSelection;

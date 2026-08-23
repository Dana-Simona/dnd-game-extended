import React, { useState } from 'react';
import CharacterDisplay, {
	type CharacterDisplayOptions,
} from './characterSelection/characterDisplay/CharacterDisplay';
import { Container } from './ClassSelectionStyles';
import idleDownImg from '../assets/The Female Adventurer - Free/Idle/Idle_Down.png';
import idleUpImg from '../assets/The Female Adventurer - Free/Idle/Idle_Right_Up.png';
import idleRightImg from '../assets/The Female Adventurer - Free/Idle/Idle_Right_Down.png';
import idleLeftImg from '../assets/The Female Adventurer - Free/Idle/Idle_Left_Down.png';

const ClassSelection: React.FC = () => {
	const characterClasses: CharacterDisplayOptions[] = [
		{
			title: 'warrior',
			imagePath: idleDownImg,
			onConfirm: () => console.log('aaa'),
		},
		{
			title: 'mage',
			imagePath: idleRightImg,
			onConfirm: () => console.log('aaa'),
		},
		{
			title: 'rogue',
			imagePath: idleUpImg,
			onConfirm: () => console.log('aaa'),
		},
		{
			title: 'hunter',
			imagePath: idleLeftImg,
			onConfirm: () => console.log('aaa'),
		},
	];
	const [selectedIndex, setSelectedIndex] = useState<number>(0);

	return (
		<Container>
			<CharacterDisplay
				options={characterClasses}
				setSelectedIndex={setSelectedIndex}
				selectedIndex={selectedIndex}
			/>
		</Container>
	);
};

export default ClassSelection;

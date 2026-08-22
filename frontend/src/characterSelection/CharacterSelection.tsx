import React from 'react';
import Sprite from '../utils/Sprite';
import idleDownImg from '../assets/The Female Adventurer - Free/Idle/Idle_Down.png';
import {
	ActionButton,
	DisplayContainer,
	SpriteScaler,
} from './CharacterSelectionStyles';

const CharacterSelection: React.FC = () => {
	const actions = {
		idle: {
			imagePath: idleDownImg,
			frameCount: 8,
			width: 48,
			height: 64,
		},
	};

	const current = actions.idle;

	return (
		<DisplayContainer>
			Character selection
			<SpriteScaler>
				<Sprite
					imagePath={current.imagePath}
					width={current.width}
					height={current.height}
					frameCount={current.frameCount}
					fps={4}
				/>
			</SpriteScaler>
		</DisplayContainer>
	);
};

export default CharacterSelection;

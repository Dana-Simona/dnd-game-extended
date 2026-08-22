import React from 'react';
import Sprite from '../../utils/Sprite';
import idleDownImg from '../../assets/The Female Adventurer - Free/Idle/Idle_Down.png';
import {
	BackgroundAmbiance,
	CharacterWrapper,
	DisplayContainer,
	FloorLine,
	MainCharacter,
	Reflection,
	SpriteScaler,
} from './CharacterDisplayStyles';

const CharacterDisplay: React.FC = () => {
	const current = {
		imagePath: idleDownImg,
		frameCount: 8,
		width: 48,
		height: 64,
	};

	return (
		<DisplayContainer>
			<SpriteScaler>
				<BackgroundAmbiance>
					<CharacterWrapper>
						<MainCharacter>
							<Sprite
								imagePath={current.imagePath}
								width={current.width}
								height={current.height}
								frameCount={current.frameCount}
								fps={4}
							/>
						</MainCharacter>

						<FloorLine />

						<Reflection>
							<Sprite
								imagePath={current.imagePath}
								width={current.width}
								height={current.height}
								frameCount={current.frameCount}
								fps={4}
							/>
						</Reflection>
					</CharacterWrapper>
				</BackgroundAmbiance>
			</SpriteScaler>
		</DisplayContainer>
	);
};

export default CharacterDisplay;

import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
	Container,
	Title,
	TitleExt,
	Cursor,
	Byline,
	Crest,
	Divider,
	MenuBox,
	Content,
	Embers,
	Ember,
} from './MainMenuStyles';
import { ROUTES } from '../constants/routes';
import Button from '../utils/button/Button';

const EMBERS = Array.from({ length: 28 }, (_, i) => {
	const r = (n: number) => {
		const x = Math.sin(i * 97.13 + n * 31.7) * 10000;
		return x - Math.floor(x);
	};
	return {
		left: `${r(1) * 100}%`,
		size: 2 + Math.round(r(2) * 3),
		duration: 9 + r(3) * 10,
		delay: -r(4) * 18,
		drift: `${(r(5) - 0.5) * 120}px`,
		opacity: 0.25 + r(6) * 0.5,
	};
});

const MainMenu: React.FC = () => {
	const navigate = useNavigate();

	const startGame = () => {
		navigate(ROUTES.CHARACTER_SELECTION);
	};

	const devTools = () => {
		navigate(ROUTES.DEV_TOOLS);
	};

	return (
		<Container>
			<Embers aria-hidden>
				{EMBERS.map((e, i) => (
					<Ember
						key={i}
						style={
							{
								left: e.left,
								width: e.size,
								height: e.size,
								animationDuration: `${e.duration}s`,
								animationDelay: `${e.delay}s`,
								'--ember-drift': e.drift,
								'--ember-opacity': e.opacity,
							} as React.CSSProperties
						}
					/>
				))}
			</Embers>
			<Content>
				<Crest aria-hidden>◆ ◇ ◆</Crest>
				<Title>
					Dungeon<TitleExt>.exe</TitleExt>
					<Cursor />
				</Title>
				<Byline>by Dana Simona Usher</Byline>
				<Divider aria-hidden>◆</Divider>
				<MenuBox>
					<Button onClick={startGame}> Start Game </Button>
					<Button
						onClick={() =>
							alert(
								'WASD to move (walk into an enemy to melee attack it), E for ability, Q to skip your turn.',
							)
						}
					>
						Controls
					</Button>
					<Button onClick={devTools}> Developer Tools </Button>
				</MenuBox>
			</Content>
		</Container>
	);
};

export default MainMenu;

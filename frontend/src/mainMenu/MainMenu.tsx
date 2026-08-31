import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, MenuBox } from './MainMenuStyles';
import { ROUTES } from '../constants/routes';
import Button from '../utils/button/Button';

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
			<Title>Dungeon.exe</Title>
			<MenuBox>
				<Button onClick={startGame}> Start Game </Button>
				<Button
					onClick={() =>
						alert(
							'WASD to move, E for ability, Q to skip your turn.',
						)
					}
				>
					Controls
				</Button>
				<Button onClick={devTools}> Developer Tools </Button>
			</MenuBox>
		</Container>
	);
};

export default MainMenu;

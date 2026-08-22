import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Title, MenuBox, MenuButton } from './MainMenuStyles';
import { ROUTES } from '../constants/routes';

const MainMenu: React.FC = () => {
	const navigate = useNavigate();

	const startGame = () => {
		navigate(ROUTES.CHARACTER_SELECTION);
	};

	return (
		<Container>
			<Title>Dungeon.exe</Title>
			<MenuBox>
				<MenuButton onClick={startGame}> Start Game </MenuButton>
				<MenuButton
					onClick={() =>
						alert(
							'WASD to move, E for ability, Q to skip your turn.',
						)
					}
				>
					Controls
				</MenuButton>
			</MenuBox>
		</Container>
	);
};

export default MainMenu;

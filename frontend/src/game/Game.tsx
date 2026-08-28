import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Tile from '../utils/tileMapping/Tile';
import { ROUTES } from '../constants/routes';
import { Container, Board, BoardRow, Controls, BackButton } from './GameStyles';
import { useCharacter } from '../utils/characterContext/CharacterContext';

interface BoardData {
	grid: string[];
}

const Game: React.FC = () => {
	const navigate = useNavigate();
	const { level } = useParams<{ level: string }>();
	const { character } = useCharacter();
	const [board, setBoard] = useState<string[]>([]);

	useEffect(() => {
		if (!character) {
			navigate(ROUTES.CHARACTER_SELECTION);
			return;
		}

		const initializeLevel = async () => {
			const levelIndex = level ? parseInt(level, 10) : 0;

			try {
				const res = await fetch(
					'http://localhost:8080/api/select-level',
					{
						method: 'POST',
						headers: { 'Content-Type': 'text/plain' },
						body: levelIndex.toString(),
					},
				);
				const data: BoardData = await res.json();
				setBoard(data.grid);
			} catch (err) {
				console.error('Failed to load level from backend:', err);
			}
		};

		initializeLevel();
	}, [level, character, navigate]);

	const handleKeyPress = async (key: string) => {
		const validKeys = ['w', 'a', 's', 'd', 'e', 'q'];
		const lowerKey = key.toLowerCase();

		if (!validKeys.includes(lowerKey)) return;

		try {
			const res = await fetch('http://localhost:8080/api/action', {
				method: 'POST',
				headers: { 'Content-Type': 'text/plain' },
				body: lowerKey,
			});
			const data: BoardData = await res.json();
			setBoard(data.grid);
		} catch (err) {
			console.error('Failed to send move:', err);
		}
	};

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => handleKeyPress(e.key);
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, []);

	const handleClick = () => {
		navigate(ROUTES.MAIN_MENU);
	};

	return (
		<Container>
			<h1>Level {level ?? '0'}</h1>
			{character && (
				<h2>
					Playing as: {character.name} ({character.class})
				</h2>
			)}

			<Board>
				{board.length > 0 ? (
					board.map((row, rowIndex) => (
						<BoardRow key={rowIndex}>
							{row.split('').map((char, colIndex) => (
								<Tile
									key={`${rowIndex}-${colIndex}`}
									char={char}
									x={colIndex}
									y={rowIndex}
								/>
							))}
						</BoardRow>
					))
				) : (
					<p>Loading board...</p>
				)}
			</Board>

			<Controls>
				<p>Controls: WASD to Move | E to Cast Ability | Q to Pass</p>
			</Controls>
			<BackButton onClick={handleClick}>Back to Menu</BackButton>
		</Container>
	);
};

export default Game;

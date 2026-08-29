import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Tile from '../utils/tileMapping/Tile';
import { ROUTES } from '../constants/routes';
import {
	Container,
	ViewportContainer,
	Board,
	BoardRow,
	Controls,
	BackButton,
} from './GameStyles';
import { useCharacter } from '../utils/characterContext/CharacterContext';

interface BoardData {
	grid: string[];
}

const TILE_SIZE = 32;
const ZOOM = 2;
const CAMERA_SPEED_SECONDS = '1s';

const getPlayerPosition = (board: string[]) => {
	for (let y = 0; y < board.length; y++) {
		const x = board[y].indexOf('@');
		if (x !== -1) return { x, y };
	}
	return { x: 0, y: 0 };
};

const Game: React.FC = () => {
	const navigate = useNavigate();
	const { level } = useParams<{ level: string }>();
	const { character } = useCharacter();
	const [board, setBoard] = useState<string[]>([]);

	const viewportRef = useRef<HTMLDivElement>(null);
	const [viewportDimensions, setViewportDimensions] = useState({
		width: 0,
		height: 0,
	});

	useEffect(() => {
		const updateDimensions = () => {
			if (viewportRef.current) {
				setViewportDimensions({
					width: viewportRef.current.clientWidth,
					height: viewportRef.current.clientHeight,
				});
			}
		};

		updateDimensions();
		window.addEventListener('resize', updateDimensions);
		return () => window.removeEventListener('resize', updateDimensions);
	}, []);

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

	const playerPos = getPlayerPosition(board);
	const playerPixelX = (playerPos.x * TILE_SIZE + TILE_SIZE / 2) * ZOOM;
	const playerPixelY = (playerPos.y * TILE_SIZE + TILE_SIZE / 2) * ZOOM;

	const cameraOffsetX = viewportDimensions.width / 2 - playerPixelX;
	const cameraOffsetY = viewportDimensions.height / 2 - playerPixelY;

	return (
		<Container>
			<h1>Level {level ?? '0'}</h1>
			{character && (
				<h2>
					Playing as: {character.name} ({character.class})
				</h2>
			)}

			<ViewportContainer ref={viewportRef}>
				<Board
					$offsetX={cameraOffsetX}
					$offsetY={cameraOffsetY}
					$zoom={ZOOM}
					$transitionDuration={CAMERA_SPEED_SECONDS}
				>
					{board.length > 0 ? (
						board.map((row, rowIndex) => (
							<BoardRow key={rowIndex}>
								{row.split('').map((char, colIndex) => (
									<Tile
										key={`${rowIndex}-${colIndex}`}
										char={char}
										x={colIndex}
										y={rowIndex}
										grid={board}
									/>
								))}
							</BoardRow>
						))
					) : (
						<p>Loading board...</p>
					)}
				</Board>
			</ViewportContainer>

			<Controls>
				<p>Controls: WASD to Move | E to Cast Ability | Q to Pass</p>
			</Controls>
			<BackButton onClick={handleClick}>Back to Menu</BackButton>
		</Container>
	);
};

export default Game;

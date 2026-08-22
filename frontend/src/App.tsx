import { useEffect, useState } from 'react';
import { Container, Board, Controls } from './AppStyles';
interface BoardData {
	grid: string[];
}

export default function App() {
	const [board, setBoard] = useState<string[]>([]);

	const fetchBoard = async () => {
		try {
			const res = await fetch('http://localhost:8080/api/board');
			const data: BoardData = await res.json();
			setBoard(data.grid);
		} catch (err) {
			console.error('Failed to connect to Java backend:', err);
		}
	};

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
		fetchBoard();

		const onKeyDown = (e: KeyboardEvent) => handleKeyPress(e.key);
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, []);

	return (
		<Container>
			<h1>Dungeon Crawler</h1>

			<Board>
				{board.length > 0 ? board.join('\n') : 'Loading board...'}
			</Board>

			<Controls>
				<p>Controls: WASD to Move | E to Cast Ability | Q to Pass</p>
			</Controls>
		</Container>
	);
}
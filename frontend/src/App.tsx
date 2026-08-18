import { useEffect, useState } from 'react';

interface BoardData {
	grid: string[];
}

export default function App() {
	const [board, setBoard] = useState<string[]>([]);

	// Fetch initial board state
	const fetchBoard = async () => {
		try {
			const res = await fetch('http://localhost:8080/api/board');
			const data: BoardData = await res.json();
			setBoard(data.grid);
		} catch (err) {
			console.error('Failed to connect to Java backend:', err);
		}
	};

	// Send action to Java backend on key press
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

		// Attach keydown listener for W/A/S/D/E/Q
		const onKeyDown = (e: KeyboardEvent) => handleKeyPress(e.key);
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, []);

	return (
		<div style={styles.container}>
			<h1>Dungeon Crawler</h1>

			{/* Map Display */}
			<pre style={styles.board}>
				{board.length > 0 ? board.join('\n') : 'Loading board...'}
			</pre>

			{/* On-screen controls for testing */}
			<div style={styles.controls}>
				<p>Controls: WASD to Move | E to Cast Ability | Q to Pass</p>
			</div>
		</div>
	);
}

const styles: Record<string, React.CSSProperties> = {
	container: {
		backgroundColor: '#121212',
		color: '#00ffcc',
		minHeight: '100vh',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		fontFamily: 'monospace',
	},
	board: {
		backgroundColor: '#000',
		padding: '20px',
		borderRadius: '8px',
		fontSize: '20px',
		lineHeight: '1.2',
		letterSpacing: '3px',
		boxShadow: '0 0 15px rgba(0,255,204,0.2)',
	},
	controls: {
		marginTop: '15px',
		color: '#aaa',
	},
};

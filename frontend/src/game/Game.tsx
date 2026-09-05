import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import { GameLog } from './gameLog/GameLog';
import { GameBoard } from './gameBoard/GameBoard';
import { Container, Stats } from './GameStyles';
import { useCharacter } from '../utils/characterContext/CharacterContext';
import { PlayerStats } from './playerStats/PlayerStats';
import type { AllPlayerData, Unit } from '../constants/interfaces/player';

export interface GameEvent {
	step: number;
	type: string;
	sourceId: string | null;
	targetIds: string[] | null;
	amount: number | null;
}

interface BoardData {
	grid: string[];
	player: AllPlayerData;
	units: AllPlayerData[];
	events?: GameEvent[];
}

const Game: React.FC = () => {
	const navigate = useNavigate();
	const { level } = useParams<{ level: string }>();
	const { character, updateCharacter } = useCharacter();

	const [board, setBoard] = useState<string[]>([]);
	const [actionCount, setActionCount] = useState<number>(0);
	const [enemies, setEnemies] = useState<Unit[]>([]);

	const [turnEvents, setTurnEvents] = useState<GameEvent[]>([]);

	useEffect(() => {
		if (!character) {
			navigate(ROUTES.CHARACTER_SELECTION);
		}
	}, [character, navigate]);

	useEffect(() => {
		if (!character) return;

		const controller = new AbortController();

		const initializeLevel = async () => {
			const levelIndex = level ? parseInt(level, 10) : 0;

			try {
				const res = await fetch(
					'http://localhost:8080/api/select-level',
					{
						method: 'POST',
						headers: { 'Content-Type': 'text/plain' },
						body: levelIndex.toString(),
						signal: controller.signal,
					},
				);

				if (!res.ok) {
					throw new Error(`Server returned status: ${res.status}`);
				}

				const data: BoardData = await res.json();

				setBoard(data.grid);

				if (data.player) {
					updateCharacter(data.player);
				}

				setActionCount((prev) => prev + 1);
			} catch (err: unknown) {
				if (err instanceof Error && err.name === 'AbortError') return;
				console.error('Failed to load level from backend:', err);
			}
		};

		initializeLevel();

		return () => controller.abort();
	}, [level]);

	const handleKeyPress = useCallback(
		async (key: string) => {
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

				if (data.events) {
					setTurnEvents(data.events);
					console.log('Turn Events Received:', data.events);
				}

				setBoard(data.grid);

				if (data.player) {
					updateCharacter(data.player);
				}

				if (data.units) {
					const enemyList = data.units.filter(
						(unit) => unit.character !== '@',
					);
					setEnemies(enemyList);
				}

				setActionCount((prev) => prev + 1);
			} catch (err) {
				console.error('Failed to send move:', err);
			}
		},
		[updateCharacter],
	);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => handleKeyPress(e.key);
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [handleKeyPress]);

	return (
		<Container>
			<GameBoard
				board={board}
				enemies={enemies}
			/>
			<Stats>
				<GameLog actionTrigger={actionCount} />
				<PlayerStats />
			</Stats>
		</Container>
	);
};

export default Game;

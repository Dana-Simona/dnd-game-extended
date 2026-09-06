import { useNavigate, useParams } from 'react-router-dom';
import React, { useEffect, useState, useCallback } from 'react';
import { ROUTES } from '../constants/routes';
import { GameLog } from './gameLog/GameLog';
import { Container, Stats } from './GameStyles';
import { GameBoard } from './gameBoard/GameBoard';
import { PlayerStats } from './playerStats/PlayerStats';
import type { GameEvent } from '../constants/gameEvent';
import { useCharacter } from '../utils/characterContext/CharacterContext';
import type { AllPlayerData, Unit } from '../constants/interfaces/player';
import { useGameAnimation } from '../utils/animation/useGameAnimation';
import { usePreloader } from '../utils/animation/usePreloader';

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

	const { isAnimating, activeUnitStates, visualPositions, runTurn } =
		useGameAnimation(enemies, character);

	usePreloader(enemies, character);

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
				if (data.units) {
					const enemyList = data.units.filter(
						(unit) => unit.character !== '@',
					) as Unit[];
					setEnemies(enemyList);
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
			if (isAnimating) return;

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

				const enemyList = (data.units || []).filter(
					(unit) => unit.character !== '@',
				) as Unit[];

				setActionCount((prev) => prev + 1);

				if (data.events && data.events.length > 0) {
					console.log(data.events);
					runTurn(data.events, data.player || null, enemyList, () => {
						if (data.player) updateCharacter(data.player);
						if (data.units) setEnemies(enemyList);
					});
				} else {
					if (data.player) updateCharacter(data.player);
					if (data.units) setEnemies(enemyList);
				}
			} catch (err) {
				console.error('Failed to send move:', err);
			}
		},
		[isAnimating, runTurn, updateCharacter],
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
				activeUnitStates={activeUnitStates}
				visualPositions={visualPositions}
			/>
			<Stats>
				<GameLog actionTrigger={actionCount} />
				<PlayerStats />
			</Stats>
		</Container>
	);
};

export default Game;

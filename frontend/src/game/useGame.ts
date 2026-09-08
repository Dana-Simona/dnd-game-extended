import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../constants/routes';
import type { GameEvent } from '../constants/gameEvent';
import type { AllPlayerData, Unit } from '../constants/interfaces/player';
import { useCharacter } from '../utils/characterContext/CharacterContext';
import { useGameAnimation } from '../utils/animation/useGameAnimation/useGameAnimation';
import { usePreloader } from '../utils/animation/usePreloader';

export interface BoardData {
	grid: string[];
	player: AllPlayerData;
	units: AllPlayerData[];
	events?: GameEvent[];
}

const VALID_KEYS = new Set(['w', 'a', 's', 'd', 'e', 'q']);

export const isValidKey = (key: string): boolean =>
	VALID_KEYS.has(key.toLowerCase());

export const filterEnemies = (units: AllPlayerData[] = []): Unit[] =>
	units.filter((unit) => unit.character !== '@') as Unit[];

export const postApi = async (
	path: string,
	body: string,
	signal?: AbortSignal,
): Promise<BoardData> => {
	const res = await fetch(`http://localhost:8080/api/${path}`, {
		method: 'POST',
		headers: { 'Content-Type': 'text/plain' },
		body,
		signal,
	});
	if (!res.ok) throw new Error(`Server status: ${res.status}`);
	return res.json();
};

export const useAuthGuard = (character: unknown) => {
	const navigate = useNavigate();
	useEffect(() => {
		if (!character) navigate(ROUTES.CHARACTER_SELECTION);
	}, [character, navigate]);
};

export const useGame = (level?: string) => {
	const { character, updateCharacter } = useCharacter();
	const [board, setBoard] = useState<string[]>([]);
	const [actionCount, setActionCount] = useState<number>(0);
	const [enemies, setEnemies] = useState<Unit[]>([]);

	const {
		isAnimating,
		activeUnitStates,
		visualPositions,
		runTurn,
		cameraStyle,
		activeVfxList,
	} = useGameAnimation(enemies, character);

	usePreloader(enemies, character);
	useAuthGuard(character);

	const applyBoardState = useCallback((data: BoardData) => {
		setBoard(data.grid);
		setActionCount((prev) => prev + 1);
	}, []);

	const applyUnitState = useCallback(
		(data: BoardData, enemyList: Unit[]) => {
			if (data.player) updateCharacter(data.player);
			if (data.units) setEnemies(enemyList);
		},
		[updateCharacter],
	);

	const executeTurn = useCallback(
		(data: BoardData, enemyList: Unit[]) => {
			const onDone = () => applyUnitState(data, enemyList);
			if (data.events?.length) {
				runTurn(data.events, data.player || null, enemyList, onDone);
				console.log('[EVENTS]: ', data.events);
			} else {
				onDone();
			}
		},
		[runTurn, applyUnitState],
	);

	const handleKeyPress = useCallback(
		async (key: string) => {
			if (isAnimating || !isValidKey(key)) return;
			try {
				const data = await postApi('action', key.toLowerCase());
				applyBoardState(data);
				executeTurn(data, filterEnemies(data.units));
			} catch (err) {
				console.error('Failed move:', err);
			}
		},
		[isAnimating, applyBoardState, executeTurn],
	);

	const loadLevel = useCallback(
		async (lvl?: string, signal?: AbortSignal) => {
			const idx = lvl ? parseInt(lvl, 10) : 0;
			const data = await postApi('select-level', idx.toString(), signal);
			applyBoardState(data);
			applyUnitState(data, filterEnemies(data.units));
		},
		[applyBoardState, applyUnitState],
	);

	useEffect(() => {
		if (!character) return;
		const controller = new AbortController();
		loadLevel(level, controller.signal).catch((err) => {
			if (err?.name !== 'AbortError')
				console.error('Level load error:', err);
		});
		return () => controller.abort();
	}, [level]);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => handleKeyPress(e.key);
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [handleKeyPress]);

	return {
		board,
		actionCount,
		enemies,
		activeUnitStates,
		visualPositions,
		cameraStyle,
		activeVfxList,
	};
};

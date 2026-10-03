import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';

import { ROUTES } from '../constants/routes';
import type { GameEvent } from '../constants/gameEvent';
import { usePreloader } from '../utils/animation/usePreloader';
import { UnitType, type Unit } from '../constants/interfaces/unit';
import type { AllPlayerData } from '../constants/interfaces/player';
import { useCharacter } from '../utils/characterContext/CharacterContext';
import { useGameAnimation } from '../utils/animation/useGameAnimation/useGameAnimation';

interface BoardData {
	grid: string[];
	player: AllPlayerData;
	units: AllPlayerData[];
	events?: GameEvent[];
}

const VALID_KEYS = new Set(['w', 'a', 's', 'd', 'e', 'q']);

const isValidKey = (key: string): boolean => VALID_KEYS.has(key.toLowerCase());

export const filterEnemies = (units: AllPlayerData[] = []): Unit[] =>
	units.filter((unit) => unit.unitType !== UnitType.PLAYER) as Unit[];

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

export const useGame = () => {
	const { character, updateCharacter } = useCharacter();
	const [board, setBoard] = useState<string[]>([]);
	const [actionCount, setActionCount] = useState<number>(0);
	const [enemies, setEnemies] = useState<Unit[]>([]);
	const [isLevelLoaded, setIsLevelLoaded] = useState<boolean>(false);

	const isProcessingRef = useRef<boolean>(false);

	const {
		isAnimating,
		activeSpriteStates,
		activeUnitPhases,
		visualPositions,
		unitTransforms,
		runTurn,
		resetPositions,
		panZoomMotion,
		effectMotion,
		activeVfxList,
		hpStates,
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

			resetPositions(data.player || null, enemyList);
		},
		[updateCharacter, resetPositions],
	);

	const executeTurn = useCallback(
		(data: BoardData, enemyList: Unit[]) => {
			const onDone = () => {
				applyUnitState(data, enemyList);
				isProcessingRef.current = false;
			};

			if (data.events?.length) {
				runTurn(data.events, data.player || null, enemyList, onDone);
			} else {
				onDone();
			}
		},
		[runTurn, applyUnitState],
	);

	const handleKeyPress = useCallback(
		async (key: string) => {
			if (isAnimating || isProcessingRef.current || !isValidKey(key))
				return;

			isProcessingRef.current = true;
			try {
				const data = await postApi('action', key.toLowerCase());
				applyBoardState(data);
				executeTurn(data, filterEnemies(data.units));
			} catch (err) {
				console.error('Failed move:', err);
				isProcessingRef.current = false;
			}
		},
		[isAnimating, applyBoardState, executeTurn],
	);

	const loadLevel = useCallback(
		async (signal?: AbortSignal) => {
			const data = await postApi('select-level', '1', signal);
			applyBoardState(data);
			applyUnitState(data, filterEnemies(data.units));
		},
		[applyBoardState, applyUnitState],
	);

	useEffect(() => {
		if (!character || isLevelLoaded) return;

		const controller = new AbortController();

		const initLevel = async () => {
			try {
				await loadLevel(controller.signal);
				if (!controller.signal.aborted) {
					setIsLevelLoaded(true);
				}
			} catch (err: any) {
				if (err?.name !== 'AbortError') {
					console.error('Level load error:', err);
				}
			}
		};

		initLevel();

		return () => controller.abort();
	}, [character, isLevelLoaded, loadLevel]);

	useEffect(() => {
		const onKeyDown = (e: KeyboardEvent) => {
			if (e.repeat) return;
			handleKeyPress(e.key);
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [handleKeyPress]);

	return {
		board,
		actionCount,
		enemies,
		activeSpriteStates,
		activeUnitPhases,
		visualPositions,
		unitTransforms,
		panZoomMotion,
		effectMotion,
		activeVfxList,
		hpStates,
	};
};

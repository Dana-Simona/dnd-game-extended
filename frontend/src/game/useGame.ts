import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';

import { ROUTES } from '../constants/routes';
import type { GameOutcome } from './endScreen/EndScreen';
import { usePreloader } from '../utils/animation/usePreloader';
import { UnitType, type Unit } from '../constants/interfaces/unit';
import type { AllPlayerData } from '../constants/interfaces/player';
import { ActionType, type GameEvent } from '../constants/gameEvent';
import { useCharacter } from '../utils/characterContext/CharacterContext';
import { useGameAnimation } from '../utils/animation/useGameAnimation/useGameAnimation';
import {
	LEVEL_TRANSITION_HOLD_MS,
	LEVEL_TRANSITION_MS,
} from '../constants/animationStates/vfxStates';
import { API_BASE_URL } from '../constants/apiUrl';

interface BoardData {
	grid: string[];
	player: AllPlayerData;
	units: AllPlayerData[];
	events?: GameEvent[];
	level: number;
}

const VALID_KEYS = new Set(['w', 'a', 's', 'd', 'e', 'q']);
const isValidKey = (key: string): boolean => VALID_KEYS.has(key.toLowerCase());

export const detectOutcome = (
	events: GameEvent[] = [],
	player?: AllPlayerData | null,
): GameOutcome | null => {
	if (events.some((e) => e.type === ActionType.LOSE)) return 'lose';
	if (events.some((e) => e.type === ActionType.WIN)) return 'win';
	if (player && player.currentHealth <= 0) return 'lose';
	return null;
};

const INTRO_EVENT_TYPES = new Set<string>([ActionType.BOSS_LEVEL]);

const LEVEL_REVEAL_MS = LEVEL_TRANSITION_HOLD_MS + LEVEL_TRANSITION_MS;
const BOSS_INTRO_GOAL_DELAY_MS = 300;

export const splitIntroEvents = (events: GameEvent[] = []) => ({
	turnEvents: events.filter((e) => !INTRO_EVENT_TYPES.has(e.type)),
	introEvents: events.filter((e) => INTRO_EVENT_TYPES.has(e.type)),
});

export const filterEnemies = (units: AllPlayerData[] = []): Unit[] =>
	units.filter((unit) => unit.unitType !== UnitType.PLAYER) as Unit[];

export const postApi = async (
	path: string,
	body: string,
	signal?: AbortSignal,
): Promise<BoardData> => {
	const res = await fetch(`${API_BASE_URL}/api/${path}`, {
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
	const [level, setLevel] = useState<number>(1);
	const [actionCount, setActionCount] = useState<number>(0);
	const [enemies, setEnemies] = useState<Unit[]>([]);
	const [isLevelLoaded, setIsLevelLoaded] = useState<boolean>(false);
	const [pendingIntro, setPendingIntro] = useState<GameEvent[] | null>(null);
	const [outcome, setOutcome] = useState<GameOutcome | null>(null);

	const isProcessingRef = useRef<boolean>(false);
	const isMountedRef = useRef<boolean>(true);
	const outcomeRef = useRef<GameOutcome | null>(null);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	const {
		isAnimating,
		activeSpriteStates,
		activeUnitPhases,
		visualPositions,
		unitTransforms,
		trapStates,
		runTurn,
		resetPositions,
		triggerUnit,
		panZoomMotion,
		effectMotion,
		activeVfxList,
		hpStates,
		activeBossId,
		startLevelMusic,
		announceLevelGoal,
	} = useGameAnimation(enemies, character);

	usePreloader(enemies, character);
	useAuthGuard(character);

	const applyBoardState = useCallback((data: BoardData) => {
		setBoard(data.grid);

		if (typeof data.level === 'number' && data.level > 0) {
			setLevel(data.level);
		}
	}, []);

	const applyUnitState = useCallback(
		(data: BoardData, enemyList: Unit[]) => {
			if (data.player) updateCharacter(data.player);
			if (data.units) setEnemies(enemyList);

			resetPositions(data.player || null, enemyList);
		},
		[updateCharacter, resetPositions],
	);

	const scheduleIntro = useCallback(
		(introEvents: GameEvent[]) => {
			if (!introEvents.length) return false;

			introEvents
				.filter((e) => e.type === ActionType.BOSS_LEVEL && e.sourceId)
				.forEach((e) => {
					void triggerUnit.fadeOut(e.sourceId, 0, 0);
				});

			isProcessingRef.current = true;
			setPendingIntro(introEvents);
			return true;
		},
		[triggerUnit],
	);

	const executeTurn = useCallback(
		(data: BoardData, enemyList: Unit[]) => {
			const { turnEvents, introEvents } = splitIntroEvents(data.events);

			const onDone = () => {
				if (!isMountedRef.current) return;
				applyBoardState(data);
				applyUnitState(data, enemyList);

				const result = detectOutcome(turnEvents, data.player);
				if (result) {
					outcomeRef.current = result;
					isProcessingRef.current = true;
					setOutcome(result);
					return;
				}

				const enteredNewLevel = turnEvents.some(
					(e) => e.type === ActionType.NEXT_LEVEL,
				);
				if (enteredNewLevel) startLevelMusic(enemyList);

				if (!scheduleIntro(introEvents)) {
					isProcessingRef.current = false;
					if (enteredNewLevel) {
						void announceLevelGoal(enemyList, LEVEL_REVEAL_MS);
					}
				}
			};

			if (turnEvents.length) {
				runTurn(turnEvents, data.player || null, enemyList, onDone);
			} else {
				onDone();
			}
		},
		[
			runTurn,
			applyBoardState,
			applyUnitState,
			scheduleIntro,
			startLevelMusic,
			announceLevelGoal,
		],
	);

	useEffect(() => {
		if (!pendingIntro) return;
		const events = pendingIntro;
		setPendingIntro(null);

		runTurn(events, character, enemies, () => {
			isProcessingRef.current = false;
			void announceLevelGoal(enemies, BOSS_INTRO_GOAL_DELAY_MS);
		});
	}, [pendingIntro, runTurn, character, enemies, announceLevelGoal]);

	const handleKeyPress = useCallback(
		async (key: string) => {
			if (
				outcomeRef.current ||
				isAnimating ||
				isProcessingRef.current ||
				!isValidKey(key)
			)
				return;

			isProcessingRef.current = true;
			try {
				const data = await postApi('action', key.toLowerCase());
				setActionCount((prev) => prev + 1);
				executeTurn(data, filterEnemies(data.units));
			} catch (err) {
				console.error('Failed move:', err);
				isProcessingRef.current = false;
			}
		},
		[isAnimating, executeTurn],
	);

	const loadLevel = useCallback(
		async (targetLevel: number = 1, signal?: AbortSignal) => {
			setLevel(targetLevel);
			const data = await postApi(
				'select-level',
				targetLevel.toString(),
				signal,
			);
			applyBoardState(data);
			setActionCount((prev) => prev + 1);
			const enemyList = filterEnemies(data.units);
			applyUnitState(data, enemyList);
			startLevelMusic(enemyList);
			const hasIntro = scheduleIntro(
				splitIntroEvents(data.events).introEvents,
			);
			if (!hasIntro) void announceLevelGoal(enemyList);
		},
		[
			applyBoardState,
			applyUnitState,
			scheduleIntro,
			startLevelMusic,
			announceLevelGoal,
		],
	);

	useEffect(() => {
		if (!character || isLevelLoaded) return;

		const controller = new AbortController();

		const initLevel = async () => {
			try {
				await loadLevel(1, controller.signal);
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
			if (e.repeat || outcomeRef.current) return;
			handleKeyPress(e.key);
		};
		window.addEventListener('keydown', onKeyDown);
		return () => window.removeEventListener('keydown', onKeyDown);
	}, [handleKeyPress]);

	return {
		board,
		level,
		actionCount,
		enemies,
		activeSpriteStates,
		activeUnitPhases,
		visualPositions,
		unitTransforms,
		trapStates,
		panZoomMotion,
		effectMotion,
		activeVfxList,
		hpStates,
		activeBossId,
		outcome,
	};
};

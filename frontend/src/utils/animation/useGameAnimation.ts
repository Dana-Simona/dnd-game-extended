import { useState, useCallback, useEffect, useRef } from 'react';
import { setupAnimations } from './setupAnimations';
import { animationRegistry } from './animationRegistry';
import type { GameEvent } from '../../constants/gameEvent';
import { getUnitSpriteConfig } from './unitAnimations';
import type { AllPlayerData, Unit } from '../../constants/interfaces/player';

export interface Position {
	x: number;
	y: number;
}

export const useGameAnimation = (
	units: Unit[],
	player: Unit | AllPlayerData | null,
	tileSize: number = 32,
	zoom: number = 2,
) => {
	const [isAnimating, setIsAnimating] = useState(false);
	const [activeUnitStates, setActiveUnitStates] = useState<
		Record<string, string>
	>({});
	const [visualPositions, setVisualPositions] = useState<
		Record<string, Position>
	>({});

	const targetPositionsRef = useRef<Record<string, Position>>({});
	const allUnitsRef = useRef<Unit[]>([]);

	useEffect(() => {
		allUnitsRef.current = combinePlayerAndUnits(player, units);
		setVisualPositions((prev) =>
			updateMissingPositions(prev, allUnitsRef.current),
		);
	}, [units, player]);

	const isUnitInViewport = useCallback(
		(unitId: string): boolean => {
			if (!player) return true;
			const pos = findUnitPosition(
				unitId,
				visualPositions,
				allUnitsRef.current,
			);
			if (!pos) return false;
			return checkViewportBoundary(
				pos,
				player,
				getVisibleTileLimits(tileSize, zoom),
			);
		},
		[player, visualPositions, tileSize, zoom],
	);

	const playUnitAnimation = useCallback(
		async (unitId: string, action: string): Promise<void> => {
			const targetPos = targetPositionsRef.current[unitId];
			if (!isUnitInViewport(unitId)) {
				if (targetPos)
					setVisualPositions((p) =>
						updateSinglePosition(p, unitId, targetPos),
					);
				return;
			}
			const unit = allUnitsRef.current.find((u) => u.id === unitId);
			const duration = calculateAnimDuration(unit, action);
			return triggerUnitAnim(
				unitId,
				action,
				duration,
				targetPos,
				setVisualPositions,
				setActiveUnitStates,
			);
		},
		[isUnitInViewport],
	);

	const spawnVFX = useCallback(async () => {}, []);
	const triggerCamera = useCallback(async () => {}, []);

	useEffect(() => {
		setupAnimations({ playUnitAnimation, spawnVFX, triggerCamera });
	}, [playUnitAnimation, spawnVFX, triggerCamera]);

	const runTurn = useCallback(
		async (
			events: GameEvent[],
			nextPlayer: AllPlayerData | null,
			nextEnemies: Unit[],
			onComplete: () => void,
		) => {
			setIsAnimating(true);
			const targets = buildTargetPositions(nextPlayer, nextEnemies);
			targetPositionsRef.current = targets;
			await executeEventSteps(events);
			setVisualPositions(targets);
			setIsAnimating(false);
			onComplete();
		},
		[],
	);

	return { isAnimating, activeUnitStates, visualPositions, runTurn };
};

export const combinePlayerAndUnits = (
	player: Unit | AllPlayerData | null,
	units: Unit[],
): Unit[] => (player ? [player as Unit, ...units] : [...units]);

export const updateMissingPositions = (
	prev: Record<string, Position>,
	units: Unit[],
): Record<string, Position> => {
	const missing = units.filter((u) => !prev[u.id]);
	if (missing.length === 0) return prev;
	const next = { ...prev };
	missing.forEach((u) => {
		next[u.id] = { x: u.x, y: u.y };
	});
	return next;
};

export const getVisibleTileLimits = (
	tileSize: number,
	zoom: number,
): Position => ({
	x: window.innerWidth / (tileSize * zoom) / 2 + 2,
	y: window.innerHeight / (tileSize * zoom) / 2 + 2,
});

export const checkViewportBoundary = (
	pos: Position,
	playerPos: Position,
	limits: Position,
): boolean =>
	Math.abs(pos.x - playerPos.x) <= limits.x &&
	Math.abs(pos.y - playerPos.y) <= limits.y;

export const findUnitPosition = (
	unitId: string,
	visuals: Record<string, Position>,
	units: Unit[],
): Position | undefined =>
	visuals[unitId] || units.find((u) => u.id === unitId);

export const calculateAnimDuration = (
	unit: Unit | undefined,
	action: string,
): number => {
	const config = getUnitSpriteConfig(unit, action);
	const fps = config?.fps || 8;
	const frameCount = config?.frameCount || 4;
	return (frameCount / fps) * 1000;
};

export const updateSinglePosition = (
	prev: Record<string, Position>,
	id: string,
	pos?: Position,
) => (pos ? { ...prev, [id]: pos } : prev);

export const removeActiveState = (
	prev: Record<string, string>,
	unitId: string,
) => {
	const next = { ...prev };
	delete next[unitId];
	return next;
};

export const triggerUnitAnim = (
	unitId: string,
	action: string,
	duration: number,
	targetPos: Position | undefined,
	setVisuals: React.Dispatch<React.SetStateAction<Record<string, Position>>>,
	setStates: React.Dispatch<React.SetStateAction<Record<string, string>>>,
): Promise<void> =>
	new Promise((resolve) => {
		if (targetPos)
			setVisuals((prev) => updateSinglePosition(prev, unitId, targetPos));
		setStates((prev) => ({ ...prev, [unitId]: action }));
		setTimeout(() => {
			setStates((prev) => removeActiveState(prev, unitId));
			resolve();
		}, duration);
	});

export const buildTargetPositions = (
	player: AllPlayerData | null,
	enemies: Unit[] = [],
): Record<string, Position> => {
	const targets: Record<string, Position> = {};
	if (player) targets[player.id] = { x: player.x, y: player.y };
	enemies.forEach((e) => {
		targets[e.id] = { x: e.x, y: e.y };
	});
	return targets;
};

export const groupEventsByStep = (
	events: GameEvent[],
): Map<number, GameEvent[]> => {
	const map = new Map<number, GameEvent[]>();
	events.forEach((evt) => {
		const list = map.get(evt.step) || [];
		map.set(evt.step, [...list, evt]);
	});
	return map;
};

export const executeEventSteps = async (events: GameEvent[]): Promise<void> => {
	const stepsMap = groupEventsByStep(events);
	const sortedSteps = Array.from(stepsMap.keys()).sort((a, b) => a - b);
	for (const stepNum of sortedSteps) {
		const stepEvents = stepsMap.get(stepNum) || [];
		await Promise.all(
			stepEvents.map((evt) => animationRegistry.execute(evt)),
		);
	}
};

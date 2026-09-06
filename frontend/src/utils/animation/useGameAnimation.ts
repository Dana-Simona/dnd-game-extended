import { useState, useCallback, useEffect, useRef } from 'react';
import { setupAnimations } from './setupAnimations';
import { animationRegistry } from './animationRegistry';
import type { GameEvent } from '../../constants/gameEvent';
import { getUnitSpriteConfig } from './unitAnimations';
import type { AllPlayerData, Unit } from '../../constants/interfaces/player';

interface Position {
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

	// Buffers target positions returned from backend
	const targetPositionsRef = useRef<Record<string, Position>>({});
	const allUnitsRef = useRef<Unit[]>([]);

	useEffect(() => {
		const list = player ? [player as Unit, ...units] : [...units];
		allUnitsRef.current = list;

		setVisualPositions((prev) => {
			const next = { ...prev };
			let updated = false;
			list.forEach((u) => {
				if (!next[u.id]) {
					next[u.id] = { x: u.x, y: u.y };
					updated = true;
				}
			});
			return updated ? next : prev;
		});
	}, [units, player]);

	const isUnitInViewport = useCallback(
		(unitId: string): boolean => {
			if (!player) return true;

			const unitPos =
				visualPositions[unitId] ||
				allUnitsRef.current.find((u) => u.id === unitId);
			if (!unitPos) return false;

			const visibleTilesX = window.innerWidth / (tileSize * zoom) / 2 + 2; // +2 padding
			const visibleTilesY =
				window.innerHeight / (tileSize * zoom) / 2 + 2;

			const diffX = Math.abs(unitPos.x - player.x);
			const diffY = Math.abs(unitPos.y - player.y);

			return diffX <= visibleTilesX && diffY <= visibleTilesY;
		},
		[player, visualPositions, tileSize, zoom],
	);

	const playUnitAnimation = useCallback(
		async (unitId: string, action: string): Promise<void> => {
			const targetUnit = allUnitsRef.current.find((u) => u.id === unitId);
			const isVisible = isUnitInViewport(unitId);
			const targetPos = targetPositionsRef.current[unitId];

			if (!isVisible) {
				if (targetPos) {
					setVisualPositions((prev) => ({
						...prev,
						[unitId]: targetPos,
					}));
				}
				return;
			}

			const spriteConfig = getUnitSpriteConfig(targetUnit, action);
			const fps = spriteConfig?.fps || 8;
			const frameCount = spriteConfig?.frameCount || 4;
			const durationMs = (frameCount / fps) * 1000;

			return new Promise((resolve) => {
				if (targetPos) {
					setVisualPositions((prev) => ({
						...prev,
						[unitId]: targetPos,
					}));
				}
				setActiveUnitStates((prev) => ({ ...prev, [unitId]: action }));

				setTimeout(() => {
					setActiveUnitStates((prev) => {
						const next = { ...prev };
						delete next[unitId];
						return next;
					});
					resolve();
				}, durationMs);
			});
		},
		[isUnitInViewport],
	);

	const spawnVFX = useCallback(async () => {}, []);
	const triggerCamera = useCallback(async () => {}, []);

	useEffect(() => {
		setupAnimations({
			playUnitAnimation,
			spawnVFX,
			triggerCamera,
		});
	}, [playUnitAnimation, spawnVFX, triggerCamera]);

	const runTurn = useCallback(
		async (
			events: GameEvent[],
			nextPlayerState: AllPlayerData | null,
			nextEnemiesState: Unit[],
			onComplete: () => void,
		) => {
			setIsAnimating(true);

			const targets: Record<string, Position> = {};
			if (nextPlayerState)
				targets[nextPlayerState.id] = {
					x: nextPlayerState.x,
					y: nextPlayerState.y,
				};
			if (nextEnemiesState) {
				nextEnemiesState.forEach((e) => {
					targets[e.id] = { x: e.x, y: e.y };
				});
			}
			targetPositionsRef.current = targets;

			const stepsMap = new Map<number, GameEvent[]>();
			events.forEach((evt) => {
				if (!stepsMap.has(evt.step)) stepsMap.set(evt.step, []);
				stepsMap.get(evt.step)!.push(evt);
			});

			const sortedSteps = Array.from(stepsMap.keys()).sort(
				(a, b) => a - b,
			);

			for (const stepNum of sortedSteps) {
				const stepEvents = stepsMap.get(stepNum) || [];
				await Promise.all(
					stepEvents.map((evt) => animationRegistry.execute(evt)),
				);
			}

			setVisualPositions(targets);

			setIsAnimating(false);
			onComplete();
		},
		[],
	);

	return { isAnimating, activeUnitStates, visualPositions, runTurn };
};

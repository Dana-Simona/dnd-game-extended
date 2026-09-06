import { useState, useCallback, useEffect } from 'react';
import { setupAnimations } from './setupAnimations';
import { animationRegistry } from './animationRegistry';
import type { GameEvent } from '../../constants/gameEvent';
import { getUnitSpriteConfig } from './unitAnimations';
import type { AllPlayerData, Unit } from '../../constants/interfaces/player';

export const useGameAnimation = (
	units: Unit[],
	player: Unit | AllPlayerData | null,
) => {
	const [isAnimating, setIsAnimating] = useState(false);

	const [activeUnitStates, setActiveUnitStates] = useState<
		Record<string, string>
	>({});

	const playUnitAnimation = useCallback(
		async (unitId: string, action: string): Promise<void> => {
			const allUnits = player ? [player, ...units] : [...units];
			const targetUnit = allUnits.find((u) => u.id === unitId);

			// 2. Pass 'action' directly to your config generator (no more casting)
			const spriteConfig = getUnitSpriteConfig(targetUnit, action);
			const fps = spriteConfig?.fps || 8;
			const frameCount = spriteConfig?.frameCount || 4;
			const durationMs = (frameCount / fps) * 1000;

			return new Promise((resolve) => {
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
		[units, player],
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
		async (events: GameEvent[], onComplete: () => void) => {
			setIsAnimating(true);

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

			setIsAnimating(false);
			onComplete();
		},
		[],
	);

	return { isAnimating, activeUnitStates, runTurn };
};

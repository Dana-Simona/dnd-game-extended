import { useState, useCallback, useEffect } from 'react';

import { useAnimationControl } from './useAnimationControl';
import { useCameraControl } from './useCameraControl';
import { useVfxControl } from './useVfxControl';
import type { GameEvent } from '../../../constants/gameEvent';
import type { Unit, AllPlayerData } from '../../../constants/interfaces/player';
import { setupAnimations } from '../setupAnimations';
import { buildTargetPositions, executeEventSteps } from './animationUtils';

export const useGameAnimation = (
	units: Unit[],
	player: Unit | AllPlayerData | null,
	tileSize: number = 32,
	zoom: number = 2,
) => {
	const [isAnimating, setIsAnimating] = useState(false);

	const {
		activeUnitStates,
		visualPositions,
		setVisualPositions,
		targetPositionsRef,
		playUnitAnimation,
	} = useAnimationControl(units, player, tileSize, zoom);

	const { triggerCamera, resetCamera, cameraStyle } = useCameraControl(
		player,
		units,
		visualPositions,
		tileSize,
		zoom,
	);

	const { spawnVFX, activeVfxList } = useVfxControl(
		visualPositions,
		tileSize,
	);

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
			try {
				const targets = buildTargetPositions(nextPlayer, nextEnemies);
				targetPositionsRef.current = targets;

				await executeEventSteps(events);

				setVisualPositions(targets);
			} finally {
				resetCamera();
				setIsAnimating(false);
				onComplete();
			}
		},
		[resetCamera, setVisualPositions, targetPositionsRef],
	);

	return {
		isAnimating,
		activeUnitStates,
		visualPositions,
		cameraStyle,
		runTurn,
		activeVfxList,
	};
};

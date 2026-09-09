import { useState, useCallback, useEffect } from 'react';

import { useAnimationControl } from './useAnimationControl';
import { useCameraControl } from './useCameraControl';
import { useVfxControl } from './useVfxControl';
import { useUnitControl } from './useUnitControl';
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

	const { triggerUnit, unitTransforms, resetAllTransforms } =
		useUnitControl(visualPositions);

	useEffect(() => {
		setupAnimations({
			playUnitAnimation,
			spawnVFX,
			triggerCamera,
			triggerUnit,
		});
	}, [playUnitAnimation, spawnVFX, triggerCamera, triggerUnit]);

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
				resetAllTransforms();
				setIsAnimating(false);
				onComplete();
			}
		},
		[
			resetCamera,
			setVisualPositions,
			targetPositionsRef,
			resetAllTransforms,
		],
	);

	return {
		isAnimating,
		activeUnitStates,
		visualPositions,
		unitTransforms,
		cameraStyle,
		runTurn,
		activeVfxList,
	};
};

import { useState, useCallback, useEffect } from 'react';

import { useVfxControl } from './useVfxControl';
import { useUnitControl } from './unitControl/useUnitControl';
import { setupAnimations } from '../setupAnimations';
import type { GameEvent } from '../../../constants/gameEvent';
import { useCameraControl } from './cameraControl/useCameraControl';
import type { Unit, AllPlayerData } from '../../../constants/interfaces/player';
import { useAnimationControl } from './spriteAnimationControl/useAnimationControl';
import {
	buildTargetPositions,
	executeEventSteps,
} from './spriteAnimationControl/animationUtils';

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

	const { triggerCamera, resetCamera, cameraMotion, cameraStyle } =
		useCameraControl(player, units, visualPositions, tileSize, zoom);

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
		cameraMotion,
		cameraStyle,
		runTurn,
		activeVfxList,
	};
};

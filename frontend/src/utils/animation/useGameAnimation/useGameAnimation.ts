import { useState, useCallback, useEffect } from 'react';

import { useVfxControl } from './vfxControl/useVfxControl';
import { setupAnimations } from '../setupAnimations';
import { playTurnSequence } from '../playTurnSequence';
import { useUnitControl } from './unitControl/useUnitControl';
import type { GameEvent } from '../../../constants/gameEvent';
import type { Unit } from '../../../constants/interfaces/unit';
import { useCameraControl } from './cameraControl/useCameraControl';
import type { AllPlayerData } from '../../../constants/interfaces/player';
import { buildTargetPositions } from './spriteAnimationControl/animationUtils';
import { useAnimationControl } from './spriteAnimationControl/useAnimationControl';

export const useGameAnimation = (
	units: Unit[],
	player: Unit | AllPlayerData | null,
	tileSize: number = 32,
	zoom: number = 2,
) => {
	const [isAnimating, setIsAnimating] = useState(false);

	const {
		activeUnitStates,
		activeUnitPhases,
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

	const resetPositions = useCallback(
		(nextPlayer: Unit | AllPlayerData | null, nextEnemies: Unit[]) => {
			const targets = buildTargetPositions(
				nextPlayer as AllPlayerData | null,
				nextEnemies,
			);
			targetPositionsRef.current = targets;
			setVisualPositions(targets);
			resetCamera();
			resetAllTransforms();
		},
		[
			setVisualPositions,
			targetPositionsRef,
			resetCamera,
			resetAllTransforms,
		],
	);

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

				await playTurnSequence(events);

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
		activeUnitPhases,
		visualPositions,
		unitTransforms,
		cameraMotion,
		cameraStyle,
		runTurn,
		resetPositions,
		activeVfxList,
	};
};

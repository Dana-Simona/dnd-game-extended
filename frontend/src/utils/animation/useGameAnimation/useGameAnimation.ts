import { useState, useCallback, useEffect } from 'react';

import { useVfxControl } from './vfxControl/useVfxControl';
import { setupAnimations } from '../setupAnimations';
import { playTurnSequence } from '../playTurnSequence';
import { useUnitControl } from './unitControl/useUnitControl';
import type { GameEvent } from '../../../constants/gameEvent';
import type { Unit } from '../../../constants/interfaces/unit';
import { useHpBarControl } from './hpBarControl/useHpBarControl';
import { useCameraControl } from './cameraControl/useCameraControl';
import type { AllPlayerData } from '../../../constants/interfaces/player';
import { buildTargetPositions } from './spriteAnimationControl/animationUtils';
import { useSpriteAnimationControl } from './spriteAnimationControl/useSpriteAnimationControl';

export const useGameAnimation = (
	units: Unit[],
	player: Unit | AllPlayerData | null,
	tileSize: number = 32,
	zoom: number = 2,
) => {
	const [isAnimating, setIsAnimating] = useState(false);

	const {
		activeSpriteStates,
		activeUnitPhases,
		visualPositions,
		setVisualPositions,
		targetPositionsRef,
		playSpriteAnimation,
	} = useSpriteAnimationControl(units, player, tileSize, zoom);

	const {
		triggerCamera,
		resetCamera,
		panZoomMotion,
		effectMotion,
		effectKey,
	} = useCameraControl(player, units, visualPositions, tileSize, zoom);

	const { spawnVFX, activeVfxList } = useVfxControl(
		visualPositions,
		tileSize,
	);

	const { triggerUnit, unitTransforms, resetAllTransforms } =
		useUnitControl(visualPositions);

	const {
		hpStates,
		triggerHpBar,
		showDamagePreview,
		depleteHp,
		clearPreview,
		resetHpStates,
	} = useHpBarControl(units, player);

	const getUnitById = useCallback(
		(id: string): Unit | undefined => {
			if (player && 'id' in player && player.id === id) {
				return player as Unit;
			}
			return units.find((u) => u.id === id);
		},
		[units, player],
	);

	useEffect(() => {
		setupAnimations({
			triggerSpriteAnimation: ({ unitId, type, phase }) =>
				playSpriteAnimation(
					unitId,
					type as Parameters<typeof playSpriteAnimation>[1],
					phase,
				),
			triggerVfx: ({ type, targetIds, amount, sourceId }) =>
				spawnVFX(type, targetIds, amount, sourceId),
			triggerCamera,
			triggerUnit,
			triggerHpBar,
			getUnitById,
		});
	}, [
		playSpriteAnimation,
		spawnVFX,
		triggerCamera,
		triggerUnit,
		triggerHpBar,
		getUnitById,
	]);

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
			resetHpStates(nextPlayer, nextEnemies);
		},
		[
			setVisualPositions,
			targetPositionsRef,
			resetCamera,
			resetAllTransforms,
			resetHpStates,
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
				resetHpStates(nextPlayer, nextEnemies);
				setIsAnimating(false);
				onComplete();
			}
		},
		[
			resetCamera,
			setVisualPositions,
			targetPositionsRef,
			resetAllTransforms,
			resetHpStates,
		],
	);

	return {
		isAnimating,
		activeSpriteStates,
		activeUnitPhases,
		visualPositions,
		unitTransforms,
		panZoomMotion,
		effectMotion,
		effectKey,
		runTurn,
		resetPositions,
		activeVfxList,
		hpStates,
		triggerHpBar,
		showDamagePreview,
		depleteHp,
		clearPreview,
	};
};

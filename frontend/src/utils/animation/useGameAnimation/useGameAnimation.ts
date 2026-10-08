import { useState, useCallback, useEffect, useRef } from 'react';

import { useVfxControl } from './vfxControl/useVfxControl';
import { setupAnimations } from '../setupAnimations';
import { playTurnSequence } from '../playTurnSequence';
import { useUnitControl } from './unitControl/useUnitControl';
import { ActionType, type GameEvent } from '../../../constants/gameEvent';
import { LEVEL_TRANSITION_HOLD_MS } from '../../../constants/animationStates/vfxStates';
import type { Unit } from '../../../constants/interfaces/unit';
import { useHpBarControl } from './hpBarControl/useHpBarControl';
import { useCameraControl } from './cameraControl/useCameraControl';
import type { AllPlayerData } from '../../../constants/interfaces/player';
import { buildTargetPositions } from './spriteAnimationControl/animationUtils';
import { useSpriteAnimationControl } from './spriteAnimationControl/useSpriteAnimationControl';
import { useSoundControl } from './soundControl/useSoundControl';
import { useBossControl } from './bossControl/useBossControl';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const LEVEL_TRANSITION_EVENTS = new Set<string>([
	ActionType.NEXT_LEVEL,
	ActionType.WIN,
]);

export const useGameAnimation = (
	units: Unit[],
	player: Unit | AllPlayerData | null,
	tileSize: number = 32,
	zoom: number = 2,
) => {
	const [isAnimating, setIsAnimating] = useState(false);
	const [isTransitioning, setIsTransitioning] = useState(false);

	const {
		activeSpriteStates,
		activeUnitPhases,
		visualPositions,
		setVisualPositions,
		targetPositionsRef,
		playSpriteAnimation,
		triggerSpriteAnimation,
	} = useSpriteAnimationControl(units, player, tileSize, zoom);

	const { triggerCamera, resetCamera, panZoomMotion, effectMotion } =
		useCameraControl(player, units, visualPositions, tileSize, zoom);

	const { triggerVfx, activeVfxList } = useVfxControl(
		visualPositions,
		tileSize,
	);

	const { triggerUnit, unitTransforms, trapStates, resetAllTransforms } =
		useUnitControl(visualPositions);

	const {
		hpStates,
		triggerHpBar,
		showDamagePreview,
		drainHp,
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

	const { triggerSound } = useSoundControl();
	const { activeBossId, triggerBoss } = useBossControl();

	const playerRef = useRef(player);
	playerRef.current = player;

	const triggerVfxRef = useRef(triggerVfx);
	triggerVfxRef.current = triggerVfx;

	useEffect(() => {
		setupAnimations({
			triggerSpriteAnimation,
			triggerVfx,
			triggerCamera,
			triggerUnit,
			triggerHpBar,
			triggerSound,
			triggerBoss,
			getUnitById,
		});
	}, [
		triggerSpriteAnimation,
		triggerVfx,
		triggerCamera,
		triggerUnit,
		triggerHpBar,
		triggerSound,
		triggerBoss,
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

	// The NEXT_LEVEL animation closes the screen. Once the new level has been
	// swapped in underneath, hold for a moment (so its tiles can load) and open
	// the screen again. Input stays blocked until the reveal is done.
	const revealNewLevel = useCallback(async () => {
		try {
			await delay(LEVEL_TRANSITION_HOLD_MS);
			await triggerVfxRef.current.levelTransition(false);
		} finally {
			setIsTransitioning(false);
		}
	}, []);

	const runTurn = useCallback(
		async (
			events: GameEvent[],
			nextPlayer: AllPlayerData | null,
			nextEnemies: Unit[],
			onComplete: () => void,
		) => {
			setIsAnimating(true);
			let changesLevel = false;
			try {
				const targets = buildTargetPositions(nextPlayer, nextEnemies);

				changesLevel = events.some(
					(e) => e.type === ActionType.NEXT_LEVEL,
				);

				const endsLevel = events.some((e) =>
					LEVEL_TRANSITION_EVENTS.has(e.type),
				);
				const turnTargets = { ...targets };
				if (endsLevel && nextPlayer) {
					const playerId = nextPlayer.id || 'player';
					const current = playerRef.current;
					if (current) {
						turnTargets[playerId] = { x: current.x, y: current.y };
					} else {
						delete turnTargets[playerId];
					}
				}
				targetPositionsRef.current = turnTargets;

				await playTurnSequence(events);

				targetPositionsRef.current = targets;

				setVisualPositions(targets);
			} finally {
				resetCamera();
				resetAllTransforms();
				resetHpStates(nextPlayer, nextEnemies);
				if (changesLevel) setIsTransitioning(true);
				setIsAnimating(false);
				onComplete();
				if (changesLevel) revealNewLevel();
			}
		},
		[
			revealNewLevel,
			resetCamera,
			setVisualPositions,
			targetPositionsRef,
			resetAllTransforms,
			resetHpStates,
		],
	);

	return {
		isAnimating: isAnimating || isTransitioning,
		activeSpriteStates,
		activeUnitPhases,
		visualPositions,
		unitTransforms,
		trapStates,
		panZoomMotion,
		effectMotion,
		runTurn,
		resetPositions,
		activeVfxList,
		hpStates,
		triggerHpBar,
		triggerUnit,
		showDamagePreview,
		drainHp,
		triggerSpriteAnimation,
		playSpriteAnimation,
		activeBossId,
	};
};

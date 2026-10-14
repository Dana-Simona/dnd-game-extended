import { useState, useCallback, useEffect, useRef } from 'react';

import { setupAnimations } from '../setupAnimations';
import { playTurnSequence } from '../playTurnSequence';
import { useVfxControl } from './vfxControl/useVfxControl';
import { useBossControl } from './bossControl/useBossControl';
import { useUnitControl } from './unitControl/useUnitControl';
import { useHpBarControl } from './hpBarControl/useHpBarControl';
import { useSoundControl } from './soundControl/useSoundControl';
import { useCameraControl } from './cameraControl/useCameraControl';
import { UnitType, type Unit } from '../../../constants/interfaces/unit';
import type { AllPlayerData } from '../../../constants/interfaces/player';
import { ActionType, type GameEvent } from '../../../constants/gameEvent';
import { SoundPreset } from '../../../constants/animationStates/soundStates';
import { buildTargetPositions } from './spriteAnimationControl/animationUtils';
import { LEVEL_TRANSITION_HOLD_MS } from '../../../constants/animationStates/vfxStates';
import { useSpriteAnimationControl } from './spriteAnimationControl/useSpriteAnimationControl';

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

	const { triggerUnit, unitTransforms, trapStates, resetAllTransforms } =
		useUnitControl(visualPositions);

	const { triggerVfx, activeVfxList } = useVfxControl(
		visualPositions,
		tileSize,
		unitTransforms,
	);

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

	const triggerSoundRef = useRef(triggerSound);
	triggerSoundRef.current = triggerSound;

	const startLevelMusic = useCallback((levelEnemies: Unit[]) => {
		const hasBoss = levelEnemies.some((e) => e.unitType === UnitType.BOSS);
		void triggerSoundRef.current.playMusic(
			hasBoss ? SoundPreset.BG_MUSIC_BOSS : SoundPreset.BG_MUSIC_REGULAR,
		);
	}, []);

	const announceLevelGoal = useCallback(
		async (levelEnemies: Unit[], delayMs: number = 0) => {
			if (delayMs > 0) await delay(delayMs);
			const boss = levelEnemies.find((e) => e.unitType === UnitType.BOSS);
			
			await triggerVfxRef.current.bannerGoal(
				boss ? `Destroy ${boss.name}` : 'Kill all enemies',
				!!boss,
			);
		},
		[],
	);

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
		startLevelMusic,
		announceLevelGoal,
	};
};

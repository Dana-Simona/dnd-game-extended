import {
	useState,
	useCallback,
	useEffect,
	useRef,
	type Dispatch,
	type SetStateAction,
} from 'react';

import type { Unit } from '../../../../constants/interfaces/unit';
import type { AllPlayerData } from '../../../../constants/interfaces/player';
import {
	combinePlayerAndUnits,
	updateMissingPositions,
	findUnitPosition,
	checkViewportBoundary,
	getVisibleTileLimits,
	updateSinglePosition,
	calculateAnimDuration,
	triggerUnitAnim,
} from './animationUtils';
import {
	AnimationPhase,
	SpritePresets,
} from '../../../../constants/animationStates/spriteStates';
import type { Position } from '../unitControl/unitCalculations';

export const useSpriteAnimationControl = (
	units: Unit[],
	player: Unit | AllPlayerData | null,
	tileSize: number = 32,
	zoom: number = 2,
) => {
	const [activeSpriteStates, setActiveSpriteStates] = useState<
		Record<string, SpritePresets>
	>({});

	const [activeUnitPhases, setActiveUnitPhases] = useState<
		Record<string, AnimationPhase>
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

	const playSpriteAnimation = useCallback(
		async (
			unitId: string,
			action: SpritePresets,
			phase: AnimationPhase = AnimationPhase.FULL,
		): Promise<void> => {
			const targetPos = targetPositionsRef.current[unitId];
			if (!isUnitInViewport(unitId)) {
				if (targetPos) {
					setVisualPositions((p) =>
						updateSinglePosition(p, unitId, targetPos),
					);
				}
				return;
			}
			const unit = allUnitsRef.current.find((u) => u.id === unitId);
			const duration = calculateAnimDuration(unit, action, phase);

			const animPromise = triggerUnitAnim(
				unitId,
				action,
				phase,
				duration,
				targetPos,
				setVisualPositions,
				setActiveSpriteStates as Dispatch<
					SetStateAction<Record<string, string>>
				>,
				setActiveUnitPhases,
			);

			const isMoveAction =
				action === SpritePresets.MOVE && phase === AnimationPhase.FULL;

			if (isMoveAction) {
				const earlyResolveMs = Math.floor(duration * 0.5);
				return new Promise<void>((resolve) => {
					const timer = setTimeout(resolve, earlyResolveMs);
					animPromise.then(() => {
						clearTimeout(timer);
						resolve();
					});
				});
			}

			return animPromise;
		},
		[isUnitInViewport],
	);

	return {
		activeSpriteStates,
		activeUnitPhases,
		visualPositions,
		setVisualPositions,
		targetPositionsRef,
		playSpriteAnimation,
	};
};

export type UseSpriteAnimationControlReturn = ReturnType<
	typeof useSpriteAnimationControl
>;
export type PlaySpriteAnimationFn =
	UseSpriteAnimationControlReturn['playSpriteAnimation'];

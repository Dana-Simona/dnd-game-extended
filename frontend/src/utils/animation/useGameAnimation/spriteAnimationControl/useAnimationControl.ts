import { useState, useCallback, useEffect, useRef } from 'react';

import { ActionType } from '../../../../constants/gameEvent';
import type { Position } from '../cameraControl/cameraControl';
import type {
	Unit,
	AllPlayerData,
} from '../../../../constants/interfaces/player';
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

export const useAnimationControl = (
	units: Unit[],
	player: Unit | AllPlayerData | null,
	tileSize: number = 32,
	zoom: number = 2,
) => {
	const [activeUnitStates, setActiveUnitStates] = useState<
		Record<string, string>
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

	const playUnitAnimation = useCallback(
		async (unitId: string, action: ActionType): Promise<void> => {
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
			const duration = calculateAnimDuration(unit, action);

			const animPromise = triggerUnitAnim(
				unitId,
				action,
				duration,
				targetPos,
				setVisualPositions,
				setActiveUnitStates,
			);

			const isMoveAction = action === ActionType.MOVE;

			if (isMoveAction) {
				const earlyResolveMs = Math.floor(duration * 0.6);
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
		activeUnitStates,
		visualPositions,
		setVisualPositions,
		targetPositionsRef,
		playUnitAnimation,
	};
};

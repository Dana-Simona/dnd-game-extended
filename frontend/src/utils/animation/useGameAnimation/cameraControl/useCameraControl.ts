import type { MotionProps } from 'framer-motion';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useAnimationControls } from 'framer-motion';

import type { Position } from '../unitControl/unitCalculations';
import type { Unit } from '../../../../constants/interfaces/unit';
import type { AllPlayerData } from '../../../../constants/interfaces/player';
import {
	calcRangeZoom,
	calcTwoTargetCamera,
	getTargetCoords,
} from './cameraCalculations';
import type { TriggerCameraAPI } from '../../../../constants/animationStates/cameraStates';
import {
	cameraEffectVariants,
	panTo,
	zoomTo,
	panZoomTo,
} from './cameraVariants';
import {
	combinePlayerAndUnits,
	findUnitPosition,
} from '../spriteAnimationControl/animationUtils';
import { getBoardViewportSize } from '../../../../game/gameBoard/GameBoardStyles';

export interface UseCameraControlReturn {
	triggerCamera: TriggerCameraAPI;
	resetCamera: (duration?: number) => Promise<void>;
	panZoomMotion: MotionProps;
	effectMotion: MotionProps;
}

interface CameraFocusState {
	focusPos: Position | null;
	zoom: number;
	effect: 'idle' | 'shake' | 'thump';
	effectIntensity: number;
	effectBaseWidth?: number;
	effectNonce: number;
}

const halfWidth = 50;
const halfHeight = 50;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useCameraControl = (
	player: Unit | AllPlayerData | null,
	units: Unit[],
	visualPositions: Record<string, Position>,
	tileSize: number = 32,
	defaultZoom: number = 2,
): UseCameraControlReturn => {
	const panZoomControls = useAnimationControls();
	const effectControls = useAnimationControls();

	const [cameraState, setCameraState] = useState<CameraFocusState>({
		focusPos: null,
		zoom: defaultZoom,
		effect: 'idle',
		effectIntensity: 10,
		effectBaseWidth: 10,
		effectNonce: 0,
	});

	const getUnitPos = useCallback(
		(targetId?: string): Position | null => {
			if (!targetId) return null;
			const allUnits = combinePlayerAndUnits(player, units);
			return (
				findUnitPosition(targetId, visualPositions, allUnits) ?? null
			);
		},
		[player, units, visualPositions],
	);

	const focusTarget = useCallback(
		async (
			targetId: string,
			duration = 450,
			offsetPx?: Position,
		): Promise<void> => {
			const targetPos = getUnitPos(targetId);
			if (targetPos) {
				const focusPos = offsetPx
					? {
							x: targetPos.x + offsetPx.x / tileSize,
							y: targetPos.y + offsetPx.y / tileSize,
						}
					: targetPos;
				setCameraState((prev) => ({ ...prev, focusPos }));
			}
			await delay(duration);
		},
		[getUnitPos, tileSize],
	);

	const zoomIn = useCallback(
		async (
			targetId?: string,
			zoomLevel = 3,
			duration = 450,
		): Promise<void> => {
			const targetPos = getUnitPos(targetId);
			setCameraState((prev) => ({
				...prev,
				focusPos: targetPos ?? prev.focusPos,
				zoom: zoomLevel,
			}));
			await delay(duration);
		},
		[getUnitPos],
	);

	const zoomOut = useCallback(
		async (duration = 450): Promise<void> => {
			setCameraState((prev) => ({ ...prev, zoom: defaultZoom }));
			await delay(duration);
		},
		[defaultZoom],
	);

	const zoomTwoTargets = useCallback(
		async (
			target1: string,
			target2: string,
			duration = 450,
		): Promise<void> => {
			const pos1 = getUnitPos(target1);
			const pos2 = getUnitPos(target2);
			if (pos1 && pos2) {
				const calculated = calcTwoTargetCamera(pos1, pos2);
				setCameraState((prev) => ({
					...prev,
					focusPos: { x: calculated.focusX, y: calculated.focusY },
					zoom: calculated.zoom,
				}));
			}
			await delay(duration);
		},
		[getUnitPos],
	);

	const zoomToRange = useCallback(
		async (
			range: number,
			targetId?: string,
			duration = 450,
			marginTiles = 1.5,
		): Promise<void> => {
			const targetPos = getUnitPos(targetId);
			const { width, height } = getBoardViewportSize();
			const calculatedZoom = calcRangeZoom(
				range,
				tileSize,
				marginTiles,
				width,
				height,
			);

			setCameraState((prev) => ({
				...prev,
				focusPos: targetPos ?? prev.focusPos,
				zoom: calculatedZoom,
			}));

			await delay(duration);
		},
		[getUnitPos, tileSize],
	);

	const shake = useCallback(
		async (
			intensity = 12,
			baseWidth = 10,
			duration = 450,
		): Promise<void> => {
			setCameraState((prev) => ({
				...prev,
				effect: 'shake',
				effectIntensity: intensity,
				effectBaseWidth: baseWidth,
				effectNonce: prev.effectNonce + 1,
			}));
			await delay(duration);
		},
		[],
	);

	const thump = useCallback(
		async (intensity = 12, duration = 450): Promise<void> => {
			setCameraState((prev) => ({
				...prev,
				effect: 'thump',
				effectIntensity: intensity,
				effectNonce: prev.effectNonce + 1,
			}));
			await delay(duration);
		},
		[],
	);

	const reset = useCallback(
		async (duration = 400): Promise<void> => {
			setCameraState({
				focusPos: null,
				zoom: defaultZoom,
				effect: 'idle',
				effectIntensity: 10,
				effectBaseWidth: 10,
				effectNonce: 0,
			});
			await delay(duration);
		},
		[defaultZoom],
	);

	const triggerCamera = useMemo<TriggerCameraAPI>(
		() => ({
			focusTarget,
			zoomIn,
			zoomOut,
			zoomTwoTargets,
			zoomToRange,
			shake,
			thump,
			reset,
		}),
		[
			focusTarget,
			zoomIn,
			zoomOut,
			zoomTwoTargets,
			zoomToRange,
			shake,
			thump,
			reset,
		],
	);

	// Get current player position dynamically from visualPositions / player data
	const playerPos = useMemo(() => {
		if (!player) return { x: 0, y: 0 };
		const playerId = 'id' in player ? player.id : undefined;
		return getUnitPos(playerId) ?? { x: 0, y: 0 };
	}, [player, getUnitPos]);

	const activeTarget = useMemo(() => {
		if (cameraState.focusPos) {
			return cameraState.focusPos;
		}

		return (
			getTargetCoords(
				{
					focusX: undefined,
					focusY: undefined,
					zoom: cameraState.zoom,
					shakeX: 0,
					shakeY: 0,
					thumpScale: 1,
					isShaking: false,
				},
				player,
				visualPositions,
			) ?? playerPos
		);
	}, [
		cameraState.focusPos,
		cameraState.zoom,
		player,
		visualPositions,
		playerPos,
	]);

	const pixelX = activeTarget.x * tileSize + tileSize / 2;
	const pixelY = activeTarget.y * tileSize + tileSize / 2;
	const zoom = cameraState.zoom;

	const lastPanRef = useRef<{ x: number; y: number } | null>(null);
	const lastZoomRef = useRef<number | null>(null);
	const isFirstRender = useRef(true);

	useEffect(() => {
		if (isFirstRender.current) {
			panZoomControls.set({
				transformOrigin: `${pixelX}px ${pixelY}px`,
				x: `calc(${halfWidth}cqw - ${pixelX}px)`,
				y: `calc(${halfHeight}cqh - ${pixelY}px)`,
				scale: zoom,
			});
			isFirstRender.current = false;
		} else {
			const panChanged =
				!lastPanRef.current ||
				lastPanRef.current.x !== pixelX ||
				lastPanRef.current.y !== pixelY;

			const zoomChanged =
				lastZoomRef.current === null || lastZoomRef.current !== zoom;

			if (panChanged && zoomChanged) {
				panZoomControls.start(
					panZoomTo({ pixelX, pixelY, zoom, halfWidth, halfHeight }),
				);
			} else if (panChanged) {
				panZoomControls.start(
					panTo({ pixelX, pixelY, zoom, halfWidth, halfHeight }),
				);
			} else if (zoomChanged) {
				panZoomControls.start(zoomTo({ zoom }));
			}
		}

		lastPanRef.current = { x: pixelX, y: pixelY };
		lastZoomRef.current = zoom;
	}, [pixelX, pixelY, zoom, panZoomControls]);

	useEffect(() => {
		if (cameraState.effectNonce > 0 && cameraState.effect !== 'idle') {
			effectControls.start(cameraState.effect).then(() => {
				setCameraState((prev) => ({ ...prev, effect: 'idle' }));
			});
		}
	}, [cameraState.effectNonce, cameraState.effect, effectControls]);

	const panZoomProps: MotionProps = useMemo(
		() => ({
			initial: { scale: defaultZoom },
			animate: panZoomControls,
		}),
		[panZoomControls, defaultZoom],
	);

	const effectProps: MotionProps = useMemo(
		() => ({
			variants: cameraEffectVariants,
			animate: effectControls,
			custom: {
				intensity: cameraState.effectIntensity,
				baseWidth: cameraState.effectBaseWidth,
			},
			style: { transformOrigin: `${pixelX}px ${pixelY}px` },
		}),
		[
			effectControls,
			cameraState.effectIntensity,
			cameraState.effectBaseWidth,
			pixelX,
			pixelY,
		],
	);

	return {
		triggerCamera,
		resetCamera: reset,
		panZoomMotion: panZoomProps,
		effectMotion: effectProps,
	};
};

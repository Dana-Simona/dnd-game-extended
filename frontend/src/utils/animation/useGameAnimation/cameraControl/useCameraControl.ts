import type { MotionProps } from 'framer-motion';
import { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { useAnimationControls } from 'framer-motion';

import type { Position } from '../unitControl/unitCalculations';
import type { Unit } from '../../../../constants/interfaces/unit';
import type { AllPlayerData } from '../../../../constants/interfaces/player';
import { calcTwoTargetCamera, getTargetCoords } from './cameraCalculations';
import {
	cameraEffectVariants,
	panZoomTo,
	type PanZoomCustomParams,
} from './cameraVariants';
import {
	combinePlayerAndUnits,
	findUnitPosition,
} from '../spriteAnimationControl/animationUtils';
import {
	type CameraCommand,
	CameraPreset,
} from '../../../../constants/animationStates/cameraStates';
import {
	VIEWPORT_WIDTH_VW,
	VIEWPORT_HEIGHT_VH,
} from '../../../../game/gameBoard/GameBoardStyles';

export interface UseCameraControlReturn {
	triggerCamera: (command: CameraCommand) => Promise<void>;
	resetCamera: (duration?: number) => Promise<void>;
	panZoomMotion: MotionProps;
	effectMotion: MotionProps;
}

interface CameraFocusState {
	focusPos: Position | null;
	zoom: number;
	effect: 'idle' | 'shake' | 'thump';
	effectIntensity: number;
	effectNonce: number;
}

const halfWidth = VIEWPORT_WIDTH_VW / 2;
const halfHeight = VIEWPORT_HEIGHT_VH / 2;

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

	const triggerCamera = useCallback(
		async (command: CameraCommand): Promise<void> => {
			const {
				type,
				targetIds = [],
				duration = 450,
				intensity = 12,
				zoomLevel = 3,
			} = command;

			setCameraState((prev) => {
				let nextFocus = prev.focusPos;
				let nextZoom = prev.zoom;
				let nextEffect = prev.effect;

				switch (type) {
					case CameraPreset.FOCUS_TARGET:
						nextFocus = getUnitPos(targetIds[0]) ?? prev.focusPos;
						break;

					case CameraPreset.ZOOM_IN:
						if (targetIds[0]) nextFocus = getUnitPos(targetIds[0]);
						nextZoom = zoomLevel;
						break;

					case CameraPreset.ZOOM_OUT:
						nextZoom = defaultZoom;
						break;

					case CameraPreset.ZOOM_TWO_TARGETS: {
						const pos1 = getUnitPos(targetIds[0]);
						const pos2 = getUnitPos(targetIds[1]);
						if (pos1 && pos2) {
							const calculated = calcTwoTargetCamera(pos1, pos2);
							nextFocus = {
								x: calculated.focusX,
								y: calculated.focusY,
							};
							nextZoom = calculated.zoom;
						}
						break;
					}

					case CameraPreset.SHAKE:
						nextEffect = 'shake';
						break;

					case CameraPreset.THUMP:
						nextEffect = 'thump';
						break;

					case CameraPreset.RESET:
						nextFocus = null;
						nextZoom = defaultZoom;
						nextEffect = 'idle';
						break;
				}

				return {
					focusPos: nextFocus,
					zoom: nextZoom,
					effect: nextEffect,
					effectIntensity: intensity,
					effectNonce: prev.effectNonce + 1,
				};
			});

			return new Promise((resolve) => setTimeout(resolve, duration));
		},
		[getUnitPos, defaultZoom],
	);

	const resetCamera = useCallback(
		(duration: number = 400): Promise<void> => {
			return triggerCamera({ type: CameraPreset.RESET, duration });
		},
		[triggerCamera],
	);

	const activeTarget = useMemo(() => {
		return (
			cameraState.focusPos ??
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
			)
		);
	}, [cameraState.focusPos, cameraState.zoom, player, visualPositions]);

	const pixelX = activeTarget.x * tileSize + tileSize / 2;
	const pixelY = activeTarget.y * tileSize + tileSize / 2;
	const zoom = cameraState.zoom;

	const tileKey = `${Math.round(activeTarget.x)},${Math.round(activeTarget.y)},${zoom}`;
	const lastTileRef = useRef<string>('');

	useEffect(() => {
		if (lastTileRef.current !== tileKey) {
			lastTileRef.current = tileKey;

			const customParams: PanZoomCustomParams = {
				pixelX,
				pixelY,
				zoom,
				halfWidth,
				halfHeight,
			};

			panZoomControls.start(panZoomTo(customParams));
		}
	}, [tileKey, pixelX, pixelY, zoom, panZoomControls]);

	useEffect(() => {
		if (cameraState.effectNonce > 0 && cameraState.effect !== 'idle') {
			effectControls.start(cameraState.effect).then(() => {
				setCameraState((prev) => ({ ...prev, effect: 'idle' }));
			});
		}
	}, [cameraState.effectNonce, cameraState.effect, effectControls]);

	const panZoomProps: MotionProps = useMemo(
		() => ({
			animate: panZoomControls,
		}),
		[panZoomControls],
	);

	const effectProps: MotionProps = useMemo(
		() => ({
			variants: cameraEffectVariants,
			animate: effectControls,
			custom: cameraState.effectIntensity,
			style: { transformOrigin: 'center center' },
		}),
		[effectControls, cameraState.effectIntensity],
	);

	return {
		triggerCamera,
		resetCamera,
		panZoomMotion: panZoomProps,
		effectMotion: effectProps,
	};
};

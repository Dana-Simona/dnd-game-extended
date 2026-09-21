import type { MotionProps } from 'framer-motion';
import { useState, useCallback, useMemo } from 'react';

import { runCameraShake, runThump } from './cameraAnimations';
import type { Position } from '../unitControl/unitCalculations';
import type { Unit } from '../../../../constants/interfaces/unit';
import { getTargetCoords, calculateOffsets } from './cameraCalculations';
import { buildCameraMotion, buildCameraStyle } from './cameraStyleBuilders';
import type { AllPlayerData } from '../../../../constants/interfaces/player';
import {
	combinePlayerAndUnits,
	findUnitPosition,
} from '../spriteAnimationControl/animationUtils';
import {
	applyCameraStateWithDelay,
	focusOn,
	zoomTo,
	resetCameraState,
	focusTwoTargetsState,
} from './cameraStateUpdaters';
import {
	type CameraCommand,
	type CameraState,
	CameraPreset,
} from '../../../../constants/animationStates/cameraStates';

export interface UseCameraControlReturn {
	triggerCamera: (command: CameraCommand) => Promise<void>;
	resetCamera: (duration?: number) => Promise<void>;
	cameraMotion: MotionProps;
	cameraStyle: React.CSSProperties;
}

export const useCameraControl = (
	player: Unit | AllPlayerData | null,
	units: Unit[],
	visualPositions: Record<string, Position>,
	tileSize: number = 32,
	defaultZoom: number = 2,
): UseCameraControlReturn => {
	const [cameraState, setCameraState] = useState<CameraState>({
		zoom: defaultZoom,
		shakeX: 0,
		shakeY: 0,
		thumpScale: 1,
		isShaking: false,
	});

	const triggerCamera = useCallback(
		async (command: CameraCommand): Promise<void> => {
			return new Promise((resolve) => {
				const {
					type,
					targetIds = [],
					duration = 500,
					intensity = 10,
					zoomLevel = 3,
				} = command;
				const allUnits = combinePlayerAndUnits(player, units);
				const getPos = (id: string) =>
					findUnitPosition(id, visualPositions, allUnits);

				switch (type) {
					case CameraPreset.SHAKE:
						runCameraShake(
							setCameraState,
							duration,
							intensity,
							resolve,
						);
						break;
					case CameraPreset.THUMP:
						runThump(setCameraState, resolve);
						break;
					case CameraPreset.FOCUS_TARGET:
						applyCameraStateWithDelay(
							setCameraState,
							focusOn(getPos(targetIds[0])),
							duration,
							resolve,
						);
						break;
					case CameraPreset.ZOOM_IN:
						applyCameraStateWithDelay(
							setCameraState,
							zoomTo(zoomLevel, getPos(targetIds[0])),
							duration,
							resolve,
						);
						break;
					case CameraPreset.ZOOM_OUT:
						applyCameraStateWithDelay(
							setCameraState,
							zoomTo(defaultZoom),
							duration,
							resolve,
						);
						break;
					case CameraPreset.ZOOM_TWO_TARGETS:
						applyCameraStateWithDelay(
							setCameraState,
							focusTwoTargetsState(
								getPos(targetIds[0]),
								getPos(targetIds[1]),
							),
							duration,
							resolve,
						);
						break;
					case CameraPreset.RESET:
						applyCameraStateWithDelay(
							setCameraState,
							resetCameraState(defaultZoom),
							duration,
							resolve,
						);
						break;
					default:
						resolve();
				}
			});
		},
		[player, units, visualPositions, defaultZoom],
	);

	const resetCamera = useCallback(
		(duration: number = 500): Promise<void> => {
			return triggerCamera({ type: CameraPreset.RESET, duration });
		},
		[triggerCamera],
	);

	const { cameraMotion, cameraStyle } = useMemo(() => {
		const target = getTargetCoords(cameraState, player, visualPositions);
		const totalZoom = cameraState.zoom * cameraState.thumpScale;
		const { pixelTargetX, pixelTargetY, offsetX, offsetY } =
			calculateOffsets(
				target,
				tileSize,
				totalZoom,
				cameraState.shakeX,
				cameraState.shakeY,
			);

		return {
			cameraMotion: buildCameraMotion(
				offsetX,
				offsetY,
				totalZoom,
				cameraState.isShaking,
			),
			cameraStyle: buildCameraStyle(
				pixelTargetX,
				pixelTargetY,
				cameraState.shakeX,
				cameraState.shakeY,
				totalZoom,
				cameraState.isShaking,
			),
		};
	}, [cameraState, player, visualPositions, tileSize]);

	return { triggerCamera, resetCamera, cameraMotion, cameraStyle };
};

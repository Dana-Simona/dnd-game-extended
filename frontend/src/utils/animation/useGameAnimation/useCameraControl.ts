import { useState, useCallback, useMemo } from 'react';
import { combinePlayerAndUnits, findUnitPosition } from './animationUtils';
import type { Unit, AllPlayerData } from '../../../constants/interfaces/player';
import {
	VIEWPORT_WIDTH_VW,
	VIEWPORT_HEIGHT_VH,
} from '../../../game/gameBoard/GameBoardStyles';
import {
	CameraPreset,
	type CameraCommand,
	type CameraState,
	type Position,
} from '../../../constants/cameraControl';

const halfWidth = VIEWPORT_WIDTH_VW / 2;
const halfHeight = VIEWPORT_HEIGHT_VH / 2;

export const useCameraControl = (
	player: Unit | AllPlayerData | null,
	units: Unit[],
	visualPositions: Record<string, Position>,
	tileSize: number = 32,
	defaultZoom: number = 2,
) => {
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
						setCameraState((prev) => ({
							...prev,
							isShaking: true,
						}));
						const start = Date.now();
						const shakeInterval = setInterval(() => {
							if (Date.now() - start > duration) {
								clearInterval(shakeInterval);
								setCameraState((prev) => ({
									...prev,
									shakeX: 0,
									shakeY: 0,
									isShaking: false,
								}));
								resolve();
							} else {
								setCameraState((prev) => ({
									...prev,
									shakeX: (Math.random() - 0.5) * intensity,
									shakeY: (Math.random() - 0.5) * intensity,
								}));
							}
						}, 16);
						break;
					case CameraPreset.THUMP:
						setCameraState((prev) => ({
							...prev,
							thumpScale: 1.1,
						}));
						setTimeout(() => {
							setCameraState((prev) => ({
								...prev,
								thumpScale: 1.0,
							}));
							setTimeout(resolve, 150);
						}, 150);
						break;
					case CameraPreset.FOCUS_TARGET:
						if (targetIds[0]) {
							const pos = getPos(targetIds[0]);
							if (pos)
								setCameraState((prev) => ({
									...prev,
									focusX: pos.x,
									focusY: pos.y,
								}));
						}
						setTimeout(resolve, duration);
						break;
					case CameraPreset.ZOOM_IN:
						if (targetIds[0]) {
							const pos = getPos(targetIds[0]);
							if (pos)
								setCameraState((prev) => ({
									...prev,
									focusX: pos.x,
									focusY: pos.y,
									zoom: zoomLevel,
								}));
						} else {
							setCameraState((prev) => ({
								...prev,
								zoom: zoomLevel,
							}));
						}
						setTimeout(resolve, duration);
						break;
					case CameraPreset.ZOOM_OUT:
						setCameraState((prev) => ({
							...prev,
							zoom: defaultZoom,
						}));
						setTimeout(resolve, duration);
						break;
					case CameraPreset.ZOOM_TWO_TARGETS:
						if (targetIds.length >= 2) {
							const pos1 = getPos(targetIds[0]);
							const pos2 = getPos(targetIds[1]);
							if (pos1 && pos2) {
								const midX = (pos1.x + pos2.x) / 2;
								const midY = (pos1.y + pos2.y) / 2;
								const distance = Math.hypot(
									pos1.x - pos2.x,
									pos1.y - pos2.y,
								);
								const newZoom = Math.max(
									1.5,
									6 / Math.max(distance, 1),
								);
								setCameraState((prev) => ({
									...prev,
									focusX: midX,
									focusY: midY,
									zoom: Math.min(newZoom, 4),
								}));
							}
						}
						setTimeout(resolve, duration);
						break;
					case CameraPreset.RESET:
						setCameraState((prev) => ({
							...prev,
							focusX: undefined,
							focusY: undefined,
							zoom: defaultZoom,
						}));
						setTimeout(resolve, duration);
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

	const cameraStyle = useMemo(() => {
		let targetX = 0;
		let targetY = 0;

		if (
			cameraState.focusX !== undefined &&
			cameraState.focusY !== undefined
		) {
			targetX = cameraState.focusX;
			targetY = cameraState.focusY;
		} else if (player) {
			const playerPos = visualPositions[player.id] || {
				x: player.x,
				y: player.y,
			};
			targetX = playerPos.x;
			targetY = playerPos.y;
		}

		const totalZoom = cameraState.zoom * cameraState.thumpScale;

		return {
			transform: `scale(${totalZoom}) translate(
            calc(${halfWidth}vw / ${totalZoom} - ${targetX * tileSize}px + ${cameraState.shakeX}px),
            calc(${halfHeight}vh / ${totalZoom} - ${targetY * tileSize}px + ${cameraState.shakeY}px)
        )
    `,
			transformOrigin: 'top left',
			transition: cameraState.isShaking
				? 'none'
				: 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)',
		};
	}, [cameraState, player, visualPositions, tileSize]);

	return { triggerCamera, resetCamera, cameraStyle };
};

import { calcTwoTargetCamera } from './cameraCalculations';
import type { CameraState, Position } from '../../../../constants/animationStates/cameraStates';

export const applyCameraStateWithDelay = (
	setCamera: React.Dispatch<React.SetStateAction<CameraState>>,
	updater: (prev: CameraState) => CameraState,
	duration: number,
	resolve: () => void,
) => {
	setCamera(updater);
	setTimeout(resolve, duration);
};

export const focusOn =
	(pos?: Position) =>
	(prev: CameraState): CameraState =>
		pos ? { ...prev, focusX: pos.x, focusY: pos.y } : prev;

export const zoomTo =
	(zoom: number, pos?: Position) =>
	(prev: CameraState): CameraState => ({
		...prev,
		...(pos ? { focusX: pos.x, focusY: pos.y } : {}),
		zoom,
	});

export const resetCameraState =
	(defaultZoom: number) =>
	(prev: CameraState): CameraState => ({
		...prev,
		focusX: undefined,
		focusY: undefined,
		zoom: defaultZoom,
	});

export const focusTwoTargetsState =
	(pos1?: Position, pos2?: Position) =>
	(prev: CameraState): CameraState => {
		if (!pos1 || !pos2) return prev;
		const { focusX, focusY, zoom } = calcTwoTargetCamera(pos1, pos2);
		return { ...prev, focusX, focusY, zoom };
	};

export type TriggerCamera = (command: CameraCommand) => Promise<void>;

export const CameraPreset = {
	ZOOM_IN: 'ZOOM_IN',
	ZOOM_OUT: 'ZOOM_OUT',
	ZOOM_TWO_TARGETS: 'ZOOM_TWO_TARGETS',
	FOCUS_TARGET: 'FOCUS_TARGET',
	SHAKE: 'SHAKE',
	THUMP: 'THUMP',
	RESET: 'RESET',
} as const;

export type CameraPreset = (typeof CameraPreset)[keyof typeof CameraPreset];

export interface CameraCommand {
	type: CameraPreset;
	targetIds?: string[];
	duration?: number;
	intensity?: number;
	zoomLevel?: number;
}

export interface CameraState {
	focusX?: number;
	focusY?: number;
	zoom: number;
	shakeX: number;
	shakeY: number;
	thumpScale: number;
	isShaking: boolean;
}

export interface Position {
	x: number;
	y: number;
}

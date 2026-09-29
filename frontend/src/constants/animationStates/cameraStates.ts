export interface TriggerCameraAPI {
	focusTarget: (targetId: string, duration?: number) => Promise<void>;
	zoomIn: (
		targetId?: string,
		zoomLevel?: number,
		duration?: number,
	) => Promise<void>;
	zoomOut: (duration?: number) => Promise<void>;
	zoomTwoTargets: (
		target1: string,
		target2: string,
		duration?: number,
	) => Promise<void>;
	zoomToRange: (range: number) => Promise<void>;
	shake: (
		intensity?: number,
		baseWidth?: number,
		duration?: number,
	) => Promise<void>;
	thump: (intensity?: number, duration?: number) => Promise<void>;
	reset: (duration?: number) => Promise<void>;
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

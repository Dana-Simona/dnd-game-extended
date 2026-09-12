import type { CameraState } from './cameraControl';

export const updateShakeOffset = (
	setCamera: React.Dispatch<React.SetStateAction<CameraState>>,
	intensity: number,
) => {
	setCamera((p) => ({
		...p,
		shakeX: (Math.random() - 0.5) * intensity,
		shakeY: (Math.random() - 0.5) * intensity,
	}));
};

export const stopShake = (
	setCamera: React.Dispatch<React.SetStateAction<CameraState>>,
	intervalId: ReturnType<typeof setInterval>,
	resolve: () => void,
) => {
	clearInterval(intervalId);
	setCamera((p) => ({ ...p, shakeX: 0, shakeY: 0, isShaking: false }));
	resolve();
};

export const runCameraShake = (
	setCamera: React.Dispatch<React.SetStateAction<CameraState>>,
	duration: number,
	intensity: number,
	resolve: () => void,
) => {
	setCamera((prev) => ({ ...prev, isShaking: true }));
	const start = Date.now();
	const interval = setInterval(() => {
		if (Date.now() - start > duration)
			stopShake(setCamera, interval, resolve);
		else updateShakeOffset(setCamera, intensity);
	}, 16);
};

export const runThump = (
	setCamera: React.Dispatch<React.SetStateAction<CameraState>>,
	resolve: () => void,
) => {
	setCamera((prev) => ({ ...prev, thumpScale: 1.1 }));
	setTimeout(() => {
		setCamera((prev) => ({ ...prev, thumpScale: 1.0 }));
		setTimeout(resolve, 150);
	}, 150);
};

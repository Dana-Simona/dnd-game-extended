import type { Variants, TargetAndTransition } from 'framer-motion';

export interface PanCustomParams {
	pixelX: number;
	pixelY: number;
	zoom: number; 
	halfWidth?: number;
	halfHeight?: number;
}

export interface ZoomCustomParams {
	zoom: number;
}

export interface PanZoomCustomParams
	extends PanCustomParams, ZoomCustomParams {}

export const panTo = ({
	pixelX = 0,
	pixelY = 0,
	zoom = 2,
	halfWidth = 50,
	halfHeight = 50,
}: PanCustomParams): TargetAndTransition => ({
	transformOrigin: `${pixelX}px ${pixelY}px`,
	x: `calc(${halfWidth}vw - ${pixelX}px)`,
	y: `calc(${halfHeight}vh - ${pixelY}px)`,
	scale: [null, zoom * 0.99, zoom * 1.01, zoom],
	transition: {
		x: {
			type: 'spring',
			stiffness: 120,
			damping: 22,
			mass: 0.8,
		},
		y: {
			type: 'spring',
			stiffness: 120,
			damping: 22,
			mass: 0.8,
		},
		scale: {
			duration: 0.6,
			times: [0, 0.3, 0.7, 1],
			ease: ['easeOut', 'easeInOut', 'easeOut'],
		},
	},
});

export const zoomTo = ({
	zoom = 2,
}: ZoomCustomParams): TargetAndTransition => ({
	scale: [null, zoom * 0.99, zoom * 1.01, zoom],
	transition: {
		scale: {
			duration: 0.6,
			times: [0, 0.3, 0.7, 1],
			ease: ['easeOut', 'easeInOut', 'easeOut'],
		},
	},
});

export const panZoomTo = (params: PanZoomCustomParams): TargetAndTransition => {
	const pan = panTo(params);
	const zoom = zoomTo(params);

	return {
		...pan,
		...zoom,
		transition: {
			...pan.transition,
			...zoom.transition,
		},
	};
};

export const cameraEffectVariants: Variants = {
	idle: { x: 0, y: 0, scale: 1 },
	shake: (intensity: number = 10) => ({
		x: [
			0,
			-intensity,
			intensity,
			-intensity * 0.7,
			intensity * 0.7,
			-intensity * 0.3,
			0,
		],
		y: [
			0,
			intensity * 0.8,
			-intensity * 0.8,
			intensity * 0.5,
			-intensity * 0.5,
			-intensity * 0.2,
			0,
		],
		transition: { duration: 0.45, ease: 'easeInOut' },
	}),

	thump: {
		scale: [1, 1.1, 0.98, 1],
		transition: { duration: 0.3, ease: 'easeOut' },
	},
};

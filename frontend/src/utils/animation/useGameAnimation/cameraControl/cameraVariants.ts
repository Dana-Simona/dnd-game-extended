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
	x: `calc(${halfWidth}cqw - ${pixelX}px)`,
	y: `calc(${halfHeight}cqh - ${pixelY}px)`,
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

export type ShakeParams = {
	intensity?: number;
	baseWidth?: number;
};

export const cameraEffectVariants: Variants = {
	idle: { x: 0, y: 0, scale: 1 },

	shake: ({ intensity = 10, baseWidth = 10 }: ShakeParams = {}) => {
		const count = Math.max(1, Math.round(intensity));
		const x: number[] = [0];
		const y: number[] = [0];

		for (let i = 0; i < count; i++) {
			const sign = i % 2 === 0 ? -1 : 1;
			const decay = 1 - (i / count) * 0.7;

			x.push(sign * baseWidth * decay);
			y.push(-sign * (baseWidth * 0.8) * decay);
		}

		x.push(0);
		y.push(0);

		return {
			x,
			y,
			transition: {
				duration: Math.max(0.15, count * 0.05),
				ease: 'easeInOut' as const,
			},
		};
	},

	thump: ({ intensity = 1 } = {}) => {
		const scaleDelta = 0.05 * Math.max(0, intensity);

		return {
			scale: [1, 1 + scaleDelta, 1 - scaleDelta * 0.4, 1],
			transition: {
				duration: 0.3,
				ease: 'easeOut' as const,
			},
		};
	},
};

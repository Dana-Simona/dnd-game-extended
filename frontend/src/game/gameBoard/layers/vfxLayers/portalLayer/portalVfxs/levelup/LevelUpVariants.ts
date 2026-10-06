import type { Variants } from 'framer-motion';

export const bgVariants: Variants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: { duration: 0.4 },
	},
};

export const ringVariants: Variants = {
	hidden: { opacity: 0, scale: 0.5 },
	visible: {
		opacity: 1,
		scale: 1,
		transition: { duration: 0.3, delay: 0.15, ease: 'easeOut' },
	},
};

export const vHolderVariants: Variants = {
	hidden: { opacity: 0, scale: 0.2, y: 30 },
	visible: {
		opacity: 1,
		scale: [0.2, 1.2, 1],
		y: 0,
		transition: {
			duration: 0.35,
			delay: 0.1,
			ease: 'easeOut',
		},
	},
};

export const rightWingVariants: Variants = {
	hidden: { opacity: 0, y: 160, rotate: 0 },
	visible: {
		opacity: [0, 1, 1, 1, 1, 1, 1, 1],
		y: [160, 0, 0, 0, 0],
		rotate: [15, 0, 32, 32, -12, 0],
		transition: {
			delay: 0.3,
			duration: 1.25,
			times: [0, 0.28, 0.55, 0.8, 0.92, 1],
			ease: ['easeOut', 'easeInOut', 'linear', 'easeIn', 'easeOut'],
		},
	},
};

export const leftWingVariants: Variants = {
	hidden: { opacity: 0, y: 160, rotate: 0 },
	visible: {
		opacity: [0, 1, 1, 1, 1, 1, 1, 1],
		y: [160, 0, 0, 0, 0],
		rotate: [-15, 0, -32, -32, 12, 0],
		transition: {
			delay: 0.3,
			duration: 1.25,
			times: [0, 0.28, 0.55, 0.8, 0.92, 1],
			ease: ['easeOut', 'easeInOut', 'linear', 'easeIn', 'easeOut'],
		},
	},
};

export const rightArmorVariants: Variants = {
	hidden: { opacity: 0, x: 0, scale: 0.6 },
	visible: {
		opacity: [0, 1, 1, 1, 1, 1, 1, 1],
		x: [0, 95, 100, 90, 98, 92, 0, 0],
		rotate: [0, -5, -10, -3, -0, -5, -2, 0],
		scale: [0.6, 1.15, 1.1, 1.14, 1.08, 1.4, 0.82, 1],
		transition: {
			delay: 0.7,
			duration: 0.8,
			times: [0, 0.15, 0.32, 0.48, 0.65, 0.82, 0.92, 1],
			ease: [
				'easeOut',
				'easeInOut',
				'easeInOut',
				'easeInOut',
				'easeIn',
				'easeOut',
				'easeInOut',
			],
		},
	},
};

export const leftArmorVariants: Variants = {
	hidden: { opacity: 0, x: 0, scale: 0.6 },
	visible: {
		opacity: [0, 1, 1, 1, 1, 1, 1, 1],
		x: [0, -95, -100, -90, -98, -92, 0, 0],
		rotate: [0, 5, 10, 3, 0, 5, 2, 0],
		scale: [0.6, 1.15, 1.1, 1.14, 1.08, 1.4, 0.82, 1],
		transition: {
			delay: 0.7,
			duration: 0.8,
			times: [0, 0.15, 0.32, 0.48, 0.65, 0.82, 0.92, 1],
			ease: [
				'easeOut',
				'easeInOut',
				'easeInOut',
				'easeInOut',
				'easeIn',
				'easeOut',
				'easeInOut',
			],
		},
	},
};

export const gemVariants: Variants = {
	hidden: { opacity: 0, scale: 0 },
	visible: {
		opacity: [0, 1, 1, 1, 1, 1],
		scale: [0, 1.6, 0.85, 1.1, 1],
		transition: {
			delay: 1.42,
			duration: 0.45,
			times: [0, 0.38, 0.62, 0.82, 1],
			ease: 'easeOut',
		},
	},
};

export const textVariants: Variants = {
	hidden: { opacity: 0, scale: 0.3, y: -30 },
	visible: {
		opacity: [0, 1, 1, 1],
		scale: [0.3, 1.25, 0.95, 1],
		y: 0,
		transition: {
			delay: 1.5,
			duration: 0.4,
			ease: 'easeOut',
		},
	},
};

export const levelNumVariants: Variants = {
	hidden: { opacity: 0, scale: 0, y: 20 },
	visible: {
		opacity: [0, 1, 1, 1],
		scale: [0, 1.3, 0.9, 1],
		y: 0,
		transition: {
			delay: 1.55,
			duration: 0.4,
			ease: 'easeOut',
		},
	},
};

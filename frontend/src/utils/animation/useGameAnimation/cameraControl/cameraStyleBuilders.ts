import type { MotionProps } from 'framer-motion';
import {
	VIEWPORT_WIDTH_VW,
	VIEWPORT_HEIGHT_VH,
} from '../../../../game/gameBoard/GameBoardStyles';

const halfWidth = VIEWPORT_WIDTH_VW / 2;
const halfHeight = VIEWPORT_HEIGHT_VH / 2;

export const buildCameraMotion = (
	offsetX: number,
	offsetY: number,
	totalZoom: number,
	isShaking: boolean,
): MotionProps => ({
	animate: {
		x: `calc(${halfWidth}vw + ${offsetX}px)`,
		y: `calc(${halfHeight}vh + ${offsetY}px)`,
		scale: totalZoom,
	},
	style: { transformOrigin: '0 0' },
	transition: isShaking
		? { duration: 0 }
		: { type: 'tween', ease: 'easeInOut', duration: 0.4 },
});

export const buildCameraStyle = (
	pixelTargetX: number,
	pixelTargetY: number,
	shakeX: number,
	shakeY: number,
	totalZoom: number,
	isShaking: boolean,
): React.CSSProperties => ({
	transform: `translate(${halfWidth}vw, ${halfHeight}vh) scale(${totalZoom}) translate(${-pixelTargetX + shakeX}px, ${-pixelTargetY + shakeY}px)`,
	transformOrigin: '0 0',
	transition: isShaking ? 'none' : 'transform 0.4s ease-in-out',
});

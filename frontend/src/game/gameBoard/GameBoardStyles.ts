import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import { VfxTypes } from '../../constants/animationStates/vfxStates';

export const BOARD_ASPECT_RATIO = 16 / 9;
export const GAME_MAX_WIDTH_PX = 980;
export const GAME_PADDING_PX = 16;
export const GAME_MAX_BOARD_HEIGHT_VH = 60;

export const GAME_COLUMN_WIDTH = `min(100%, ${GAME_MAX_WIDTH_PX}px, calc(${GAME_MAX_BOARD_HEIGHT_VH}vh * ${BOARD_ASPECT_RATIO}))`;

const ROOT_MAX_WIDTH_PX = 1126;
export const getBoardViewportSize = (): { width: number; height: number } => {
	const winW = typeof window !== 'undefined' ? window.innerWidth : 1920;
	const winH = typeof window !== 'undefined' ? window.innerHeight : 1080;
	const width = Math.min(
		Math.min(winW, ROOT_MAX_WIDTH_PX) - GAME_PADDING_PX * 2,
		GAME_MAX_WIDTH_PX,
		((winH * GAME_MAX_BOARD_HEIGHT_VH) / 100) * BOARD_ASPECT_RATIO,
	);
	return { width, height: width / BOARD_ASPECT_RATIO };
};

const SCREEN_VFX_STYLES: Partial<
	Record<VfxTypes | string, ReturnType<typeof css>>
> = {
	[VfxTypes.SCREEN_DARKEN]: css`
		filter: sepia(0.5) hue-rotate(0deg) saturate(170%) brightness(0.5)
			grayscale(0%);
	`,
	[VfxTypes.SCREEN_RED_HUE]: css`
		filter: sepia(0.5) hue-rotate(-50deg) saturate(150%) brightness(0.5)
			grayscale(0%);
	`,
	[VfxTypes.SCREEN_DESATURATE]: css`
		filter: sepia(0) hue-rotate(0deg) saturate(100%) brightness(1)
			grayscale(100%);
	`,
	[VfxTypes.SCREEN_RESTORE_COLOR]: css`
		filter: sepia(0) hue-rotate(0deg) saturate(100%) brightness(1)
			grayscale(0%);
	`,
};

interface StaticLayerWrapperProps {
	$activeVfxTypes?: string[];
}

export const ViewportContainer = styled.div`
	width: 100%;
	aspect-ratio: ${BOARD_ASPECT_RATIO};
	container-type: size;
	box-sizing: border-box;
	overflow: hidden;
	position: relative;
	border: 2px solid #383838;
	border-radius: 8px;
	box-shadow: 0 0 15px rgba(76, 139, 127, 0.32);
	background-color: #000;
`;

export const Board = styled(motion.div)`
	position: absolute;
	top: 0;
	left: 0;
	transform-origin: 0 0;
	image-rendering: pixelated;
`;

export const BoardEffectLayer = styled(motion.div)`
	transform-origin: center center;
`;

export const BoardCanvas = styled.div`
	background-color: rgb(114, 117, 32);
	position: relative;
`;

export const StaticLayerWrapper = styled.div<StaticLayerWrapperProps>`
	display: grid;
	grid-template-areas: 'stack';
	position: relative;
	filter: brightness(1) saturate(100%) sepia(0) grayscale(0%) hue-rotate(0deg);
	transition: filter 0.5s ease-in-out;

	${({ $activeVfxTypes }) =>
		$activeVfxTypes?.map((vfxType) => SCREEN_VFX_STYLES[vfxType])}
`;

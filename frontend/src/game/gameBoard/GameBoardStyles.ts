import { motion } from 'framer-motion';
import styled, { css } from 'styled-components';
import { VfxTypes } from '../../constants/animationStates/vfxStates';

export const VIEWPORT_WIDTH_VW = 95;
export const VIEWPORT_HEIGHT_VH = 60;

const SCREEN_VFX_STYLES: Partial<
	Record<VfxTypes | string, ReturnType<typeof css>>
> = {
	[VfxTypes.SCREEN_DARKEN]: css`
		filter: brightness(0.5) saturate(170%) sepia(0.5) grayscale(0%)
			hue-rotate(0deg);
	`,
	[VfxTypes.SCREEN_RED_HUE]: css`
		filter: brightness(1) saturate(400%) sepia(1) grayscale(0%)
			hue-rotate(310deg);
	`,
	[VfxTypes.SCREEN_DESATURATE]: css`
		filter: brightness(1) saturate(100%) sepia(0) grayscale(100%)
			hue-rotate(0deg);
	`,
	[VfxTypes.SCREEN_RESTORE_COLOR]: css`
		filter: brightness(1) saturate(100%) sepia(0) grayscale(0%)
			hue-rotate(0deg);
	`,
};

interface StaticLayerWrapperProps {
	$activeVfxTypes?: string[];
}

export const ViewportContainer = styled.div`
	width: ${VIEWPORT_WIDTH_VW}vw;
	height: ${VIEWPORT_HEIGHT_VH}vh;
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
	position: relative;
`;

export const StaticLayerWrapper = styled.div<StaticLayerWrapperProps>`
	position: relative;
	filter: brightness(1) saturate(100%) sepia(0) grayscale(0%) hue-rotate(0deg);
	transition: filter 0.5s ease-in-out;

	${({ $activeVfxTypes }) =>
		$activeVfxTypes?.map((vfxType) => SCREEN_VFX_STYLES[vfxType])}
`;

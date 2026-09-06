import styled from 'styled-components';

export const VIEWPORT_WIDTH_VW = 95;
export const VIEWPORT_HEIGHT_VH = 60;

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

export const Board = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	transform-origin: top left;
	image-rendering: pixelated;
	/* transform and transition are now handled by cameraStyle */
`;

export const BoardCanvas = styled.div`
	position: relative;
`;

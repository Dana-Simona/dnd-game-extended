import styled from 'styled-components';
import Button from '../utils/button/Button';

export const VIEWPORT_WIDTH_VW = 95;
export const VIEWPORT_HEIGHT_VH = 70;

interface BoardProps {
	$offsetX: number;
	$offsetY: number;
	$zoom: number;
	$transitionDuration: string;
}

export const Container = styled.div`
	background-color: #121212;
	color: #00ffcc;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-family: monospace;
`;

export const ViewportContainer = styled.div`
	width: ${VIEWPORT_WIDTH_VW}vw;
	height: ${VIEWPORT_HEIGHT_VH}vh;
	overflow: hidden;
	position: relative;
	border: 2px solid #00ffcc;
	border-radius: 8px;
	box-shadow: 0 0 15px rgba(0, 255, 204, 0.2);
	background-color: #000;
`;

export const Board = styled.div<BoardProps>`
	position: absolute;
	top: 0;
	left: 0;
	transform-origin: top left;
	transform: translate3d(
			${(props) => props.$offsetX}px,
			${(props) => props.$offsetY}px,
			0
		)
		scale(${(props) => props.$zoom});
	transition: transform ${(props) => props.$transitionDuration}
		cubic-bezier(0.25, 1, 0.5, 1);
	image-rendering: pixelated;
`;

export const BoardRow = styled.div`
	display: flex;
`;

export const Controls = styled.div`
	margin-top: 15px;
	color: #aaa;
`;

export const BackButton = styled(Button)`
	margin-top: 20px;
	padding: 8px 16px;
	font-size: 0.9rem;
`;

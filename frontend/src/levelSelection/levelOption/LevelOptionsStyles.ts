import styled from 'styled-components';

export const Card = styled.div`
	position: relative;
	border-radius: 4px;
	overflow: hidden;
	cursor: pointer;
	background-color: #0d0d0d;
	transition: transform 0.2s ease;
`;

export const BaseCanvas = styled.canvas`
	width: 100%;
	height: 200px;
	display: block;
`;

export const OverlayCanvas = styled.canvas`
	position: absolute;
	inset: 0;
	width: 100%;
	height: 200px;
	display: block;
	pointer-events: none;
	mix-blend-mode: color-burn;
	opacity: 0.5;
`;

export const OverlayLabel = styled.div`
	position: absolute;
	inset: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	background: rgba(0, 0, 0, 0.4);
	color: #00ffcc;
	font-size: 18px;
	font-weight: 700;
	letter-spacing: 1px;
	text-transform: uppercase;
	text-shadow:
		0 0 8px rgba(0, 255, 204, 0.9),
		0 0 18px rgba(0, 255, 204, 0.5);
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.2s ease-in-out;
	z-index: 2;

	${Card}:hover & {
		opacity: 1;
	}
`;

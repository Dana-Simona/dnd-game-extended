import styled, { keyframes, css } from 'styled-components';

interface StyledBoxProps {
	$imagePath: string;
	$width: number;
	$height: number;
	$startFrame: number;
	$frameCount: number;
	$duration: number;
	$loop: boolean;
	$shadow?: boolean;
	$offsetY?: number;
}

const moveSprite = (
	startFrame: number,
	frameCount: number,
	width: number,
) => keyframes`
    from { background-position-x: -${startFrame * width}px; }
    to { background-position-x: -${(startFrame + frameCount) * width}px; }
`;

export const SpriteBox = styled.div<StyledBoxProps>`
	position: relative;
	width: ${(p) => p.$width}px;
	height: ${(p) => p.$height}px;
	background-image: url(${(p) => p.$imagePath});
	background-repeat: no-repeat;
	background-position-y: 0px;
	image-rendering: pixelated;
	animation: ${(p) => css`
		${moveSprite(
			p.$startFrame,
			p.$frameCount,
			p.$width,
		)} ${p.$duration}s steps(${p.$frameCount}) ${p.$loop
			? 'infinite'
			: 'forwards'}
	`};

	${(p) =>
		p.$shadow &&
		css`
			&::before {
				content: '';
				position: absolute;
				bottom: ${(p.$offsetY ?? 0) - 2}px;
				left: 50%;
				transform: translateX(-50%);
				width: 40px;
				height: 20px;
				background: radial-gradient(
					ellipse at center,
					rgba(58, 58, 35, 0.5) 0%,
					rgba(58, 58, 35, 0) 90%
				);
				filter: blur(2px);
				border-radius: 50%;
				z-index: -1;
				pointer-events: none;
			}
		`}
`;

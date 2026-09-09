import styled from 'styled-components';

interface StaticTileProps {
	$imagePath: string;
	$posX: number;
	$posY: number;
}

interface PositionedSpriteProps {
	$frameHeight: number;
	$offsetY?: number;
}

interface SpriteFlipProps {
	$isFlipped?: boolean;
}

export const SpriteTileWrapper = styled.div`
	width: 32px;
	height: 32px;
	position: relative;
	overflow: visible;
`;

export const PositionedSpriteContainer = styled.div<PositionedSpriteProps>`
	position: absolute;
	left: 50%;
	top: 0;
	transform: translate(
		-50%,
		calc(
			-${(props) => props.$frameHeight - 32}px +
				${(props) => props.$offsetY || 0}px
		)
	);
	pointer-events: none;
`;

export const SpriteFlipWrapper = styled.div<SpriteFlipProps>`
	transform: scaleX(${(props) => (props.$isFlipped ? -1 : 1)});
	transition: transform 0.15s ease-in-out;
`;

export const StaticTile = styled.div<StaticTileProps>`
	width: 32px;
	height: 32px;
	background-color: #717520;
	background-image: url(${(props) => props.$imagePath});
	background-position: -${(props) => props.$posX}px -${(props) =>
			props.$posY}px;
	background-repeat: no-repeat;
	image-rendering: pixelated;
`;

import styled, { css } from 'styled-components';

interface StaticTileProps {
	$imagePath: string;
	$posX: number;
	$posY: number;
}

interface SpriteFlipProps {
	$isFlipped?: boolean;
	$isPlayer?: boolean;
}

export const SpriteTileWrapper = styled.div`
	width: 32px;
	height: 32px;
	position: relative;
	overflow: visible;
`;

export const SpriteFlipWrapper = styled.div<SpriteFlipProps>`
	transform-origin: bottom center;
	transition: transform 0.15s ease-in-out;

	${({ $isFlipped, $isPlayer }) => {
		const scaleX = $isFlipped ? -1 : 1;
		const baseScale = $isPlayer ? 0.6 : 1;
		const finalScaleX = baseScale * scaleX;

		return css`
			transform: scale(${finalScaleX}, ${baseScale});
		`;
	}}
`;

export const EmptyTile = styled.div`
	width: 32px;
	height: 32px;
	flex-shrink: 0;
`;

export const StaticTile = styled.div<StaticTileProps>`
	width: 32px;
	height: 32px;
	flex-shrink: 0;
	background-color: transparent;
	background-image: url('${(props) => props.$imagePath}');
	background-position: -${(props) => props.$posX}px -${(props) =>
			props.$posY}px;
	background-repeat: no-repeat;
	image-rendering: pixelated;
`;

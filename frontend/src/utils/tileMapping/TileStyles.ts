import styled from 'styled-components';

interface StaticTileProps {
	$imagePath: string;
	$posX: number;
	$posY: number;
}

export const SpriteTileWrapper = styled.div`
	width: 32px;
	height: 32px;
	position: relative;
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

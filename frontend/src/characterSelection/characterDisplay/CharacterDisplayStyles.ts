import styled from 'styled-components';

export const DisplayContainer = styled.div`
	background-color: #121212;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

export const SpriteScaler = styled.div`
	transform: scale(8);
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const BackgroundAmbiance = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	border-radius: 50%;
	background: radial-gradient(
		circle,
		rgba(121, 255, 228, 0.45) 0%,
		rgba(0, 255, 204, 0.15) 40%,
		rgba(18, 18, 18, 0) 60%
	);
	padding: 16px;
`;

export const CharacterWrapper = styled.div`
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const MainCharacter = styled.div`
	position: relative;
	z-index: 2;
`;

export const Reflection = styled.div`
	position: absolute;
	top: 135%;
	left: 0;
	width: 100%;
	z-index: 10;
	transform: scaleY(-1);
	transform-origin: top;
	opacity: 0.35;
	pointer-events: none;

	mask-image: linear-gradient(
		to bottom,
		rgba(0, 0, 0, 1) 0%,
		rgba(0, 0, 0, 0) 80%
	);
	-webkit-mask-image: linear-gradient(
		to bottom,
		rgba(0, 0, 0, 1) 0%,
		rgba(0, 0, 0, 0) 80%
	);
`;

export const FloorLine = styled.div`
	position: absolute;
	top: 67%;
	left: -50px;
	right: -50px;
	height: 1px;
	height: 50px;
	background-color: #121212;
	z-index: 3;
    filter: blur(4px);
`;

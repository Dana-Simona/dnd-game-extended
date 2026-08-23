import styled from 'styled-components';

export const PageContainer = styled.div`
	background-color: #121212;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 100vh;
	flex-direction: column;
`;

export const MainContainer = styled.div`
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const DisplayContainer = styled.div`
	background-color: #121212;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
`;

export const ArrowButton = styled.button`
	background-color: transparent;
	color: rgba(255, 255, 255, 0.77);
	border: none;
	outline: none;
	font-size: 4rem;
	font-family: monospace;
	cursor: pointer;
	padding: 10px 20px;
	user-select: none;
	transition: all 0.2s ease-in-out;
	z-index: 20;

	&:hover {
		color: #ffffff;
		transform: scale(1.25);
		text-shadow:
			0 0 10px rgba(255, 255, 255, 0.9),
			0 0 20px rgba(255, 255, 255, 0.6);
	}

	&:active {
		transform: scale(1);
	}
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
	padding: 16rem;
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
	height: 100%;
	background-color: #121212;
	filter: blur(1rem);
`;

export const Title = styled.h1`
	position: absolute;
	top: 5rem;
	font-size: 4rem;
	width: 100%;
	left: 0;
	font-family:
		'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans',
		Arial, sans-serif;
	text-transform: capitalize;
	text-shadow: 0 0 15px #f4fcc9;
`;

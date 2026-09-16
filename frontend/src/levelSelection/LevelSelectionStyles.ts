import styled from 'styled-components';

export const Container = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: start;
	min-height: 100vh;
	background-color: #0d0d0d;
	color: #ffffff;
	font-family: monospace;
	padding: 20px;
`;

export const Title = styled.h1`
	font-size: 24px;
	margin-bottom: 30px;
	text-transform: uppercase;
	letter-spacing: 2px;
	color: #ffffff;
	text-shadow: 0 0 8px rgba(0, 255, 255, 0.6);
`;

export const Grid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 20px;
	max-width: 900px;
	width: 100%;

	@media (max-width: 768px) {
		grid-template-columns: repeat(2, 1fr);
	}
`;

export const CharacterWrapper = styled.div`
	position: absolute;
	bottom: -5%;
	transform-origin: bottom;
	left: 50%;
	transform: scale(5) scaleX(-1);
	z-index: 10;
	pointer-events: none;
	display: flex;
	justify-content: center;
	align-items: center;
	filter: brightness(0) drop-shadow(-0.5px 0px 0px #9eaaa9)
		drop-shadow(1px 0px 0px #ffcdf4) drop-shadow(-0.5px 0px 1px #f4fffd7c)
		drop-shadow(1px 0px 1px #ffffff7a) blur(0.5px);
`;

export const ButtonContainer = styled.div`
	width: 100%;
	display: flex;
`;

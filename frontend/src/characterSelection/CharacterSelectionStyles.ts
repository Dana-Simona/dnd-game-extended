import styled from 'styled-components';

export const DisplayContainer = styled.div`
	background-color: #121212;
	min-height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10rem;
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

export const ActionButton = styled.button`
	background-color: #000;
	color: #00ffcc;
	border: 1px solid #00ffcc;
	padding: 8px 16px;
	font-family: monospace;
	cursor: pointer;
	margin: 0 5px;

	&:hover {
		background-color: #00ffcc;
		color: #121212;
	}
`;

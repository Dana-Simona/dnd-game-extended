import styled from 'styled-components';

export const Container = styled.div`
	background-color: #121212;
	color: #00ffcc;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-family: monospace;
	text-align: center;
	padding: 20px;
`;

export const ErrorCode = styled.h1`
	font-size: 6rem;
	margin-bottom: 3rem;
	color: #ff3366;
	text-shadow: 0 0 15px rgba(255, 51, 102, 0.6);
`;

export const Title = styled.h2`
	font-size: 1.5rem;
	letter-spacing: 2px;
	margin-top: 10px;
	margin-bottom: 15px;
	color: #00ffcc;
`;

export const Message = styled.p`
	color: #aaa;
	max-width: 450px;
	line-height: 1.5;
	margin-bottom: 30px;
`;

export const MenuButton = styled.button`
	background-color: #000;
	color: #00ffcc;
	border: 2px solid #00ffcc;
	padding: 12px 24px;
	font-family: monospace;
	font-size: 1rem;
	cursor: pointer;
	border-radius: 4px;
	transition: all 0.2s ease-in-out;
	box-shadow: 0 0 8px rgba(0, 255, 204, 0.1);

	&:hover {
		background-color: #00ffcc;
		color: #121212;
		box-shadow: 0 0 15px rgba(0, 255, 204, 0.6);
		transform: translateY(-2px);
	}

	&:active {
		transform: translateY(0);
	}
`;

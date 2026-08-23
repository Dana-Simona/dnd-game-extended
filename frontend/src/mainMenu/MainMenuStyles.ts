import styled from 'styled-components';

export const Title = styled.h1`
	font-size: 3rem;
	color: #00ffcc;
	text-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
	margin-bottom: 2rem;
	letter-spacing: 4px;
`;

export const MenuBox = styled.div`
	display: flex;
	flex-direction: column;
	gap: 15px;
	width: 250px;
`;

export const Container = styled.div`
	background-color: #121212;
	color: #00ffcc;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-family: monospace;
`;

export const Board = styled.pre`
	background-color: #000;
	padding: 20px;
	border-radius: 8px;
	font-size: 20px;
	line-height: 1.2;
	letter-spacing: 3px;
	box-shadow: 0 0 15px rgba(0, 255, 204, 0.2);
`;

export const Controls = styled.div`
	margin-top: 15px;
	color: #aaa;
`;

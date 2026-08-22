import styled from 'styled-components';

export const DisplayContainer = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 15px;
`;

export const SpriteScaler = styled.div`
	transform: scale(10);
	margin-top: 10rem;
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

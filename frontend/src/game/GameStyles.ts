import styled from 'styled-components';
import Button from '../utils/button/Button';

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

export const Controls = styled.div`
	margin-top: 15px;
	color: #aaa;
`;

export const BackButton = styled(Button)`
	margin-top: 20px;
	padding: 8px 16px;
	font-size: 0.9rem;
`;

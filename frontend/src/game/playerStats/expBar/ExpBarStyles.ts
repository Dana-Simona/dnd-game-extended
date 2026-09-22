import styled from 'styled-components';

export const ExpBarContainer = styled.div`
	width: 100%;
	height: 2px;
	background-color: #333; 
	margin-bottom: 16px; 
`;

export const ExpBarFill = styled.div<{ $percentage: number }>`
	height: 100%;
	background-color: #f1c40f; 
	width: ${({ $percentage }) => Math.min(Math.max($percentage, 0), 100)}%;
	transition: width 0.3s ease-in-out;
`;
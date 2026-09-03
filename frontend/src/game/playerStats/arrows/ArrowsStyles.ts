import styled from 'styled-components';

export const ArrowSection = styled.div`
	background: #222;
	padding: 10px 14px;
	border-radius: 6px;
	border: 1px solid #333;
	margin-bottom: 12px;
`;

export const ArrowHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 8px;
	font-size: 0.85rem;
	font-weight: bold;
	color: #aaa;
`;

export const ArrowCountValue = styled.span`
	color: #f1c40f;
`;

export const CircleGrid = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
`;

export const ArrowDot = styled.div`
	width: 12px;
	height: 12px;
	border-radius: 50%;
	background-color: '#f1c40f';
	border: 1px solid '#f39c12';
	box-shadow: '0 0 6px rgba(241, 196, 15, 0.5)';
	transition: all 0.2s ease;
`;

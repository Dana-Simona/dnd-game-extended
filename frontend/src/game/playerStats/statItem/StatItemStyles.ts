import styled from 'styled-components';

export const StatBox = styled.div`
	background: #222;
	padding: 8px 12px;
	border-radius: 6px;
	border: 1px solid #333;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-weight: bold;
	font-size: 0.9rem;
`;

export const StatBoxLabel = styled.span`
	color: #aaa;
	font-size: 0.8rem;
`;

export const StatValue = styled.span<{ $color?: string }>`
	color: ${(props) => props.$color || '#e0e0e0'};
`;

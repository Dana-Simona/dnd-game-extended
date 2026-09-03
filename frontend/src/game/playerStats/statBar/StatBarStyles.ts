import styled from 'styled-components';

export const StatSection = styled.div`
	margin-bottom: 12px;
`;

export const StatLabelRow = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 6px;
	font-size: 0.9rem;
	font-weight: bold;
`;

export const LabelGroup = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
`;

export const CostText = styled.span`
	font-size: 0.75rem;
	color: #aaa;
	font-weight: normal;
`;

export const BarBackground = styled.div`
	width: 100%;
	height: 14px;
	background-color: #2a2a2a;
	border-radius: 7px;
	overflow: hidden;
	border: 1px solid #444;
`;

export const BarFill = styled.div<{ $percent: number; $color: string }>`
	height: 100%;
	width: ${(props) => props.$percent}%;
	background-color: ${(props) => props.$color};
	transition: width 0.3s ease-in-out;
`;

export const HighlightValue = styled.span<{ $color: string }>`
	color: ${(props) => props.$color};
`;

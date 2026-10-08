import styled from 'styled-components';

export const StatsContainer = styled.div`
	background-color: #1a1a1a;
	border: 2px solid #383838;
	border-radius: 8px;
	padding: 16px;
	width: 100%;
	margin: 10px;
	max-width: 350px;
	color: #e0e0e0;
	font-family: monospace;
	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.5);
	box-sizing: border-box;
`;

export const HeaderInfo = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: baseline;
	margin-bottom: 16px;
`;

export const PlayerName = styled.h3`
	margin: 0;
	color: #00ffcc;
	font-size: 1.2rem;
`;

export const PlayerLevel = styled.span`
	color: #888;
	font-size: 0.9rem;
`;

export const PrimaryStatsGrid = styled.div<{ $columns: number }>`
	display: grid;
	grid-template-columns: repeat(${(props) => props.$columns}, 1fr);
	gap: 8px;
	margin-bottom: 12px;
`;

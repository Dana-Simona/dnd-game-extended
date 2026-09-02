import styled from 'styled-components';

export const LogContainer = styled.div`
	width: 100%;
	max-width: 600px;
	height: 150px;
	background-color: #1a1a1a;
	border: 1px solid #333;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	margin: 1rem 0;
	font-family: monospace;
	overflow: hidden;
`;

export const LogHeader = styled.div`
	background-color: #2a2a2a;
	color: #ccc;
	padding: 6px 12px;
	font-size: 0.85rem;
	font-weight: bold;
	border-bottom: 1px solid #333;
	text-transform: uppercase;
	letter-spacing: 0.05em;
`;

export const LogBody = styled.div`
	flex: 1;
	padding: 8px 12px;
	overflow-y: auto;
	display: flex;
	flex-direction: column;
	gap: 4px;
`;

export const LogEntry = styled.p`
	margin: 0;
	color: #ffffff;
	font-size: 0.85rem;
	line-height: 1.3;
	white-space: pre-wrap;
	word-break: break-word;
`;

export const HighlightTeal = styled.span`
	color: #00ffcc;
	font-weight: bold;
`;

export const HighlightRed = styled.span`
	color: #ff4d4d;
	font-weight: bold;
`;

export const HighlightBlue = styled.span`
	color: #4da6ff;
	font-weight: bold;
`;

export const HighlightPurple = styled.span`
	color: #b366ff;
	font-weight: bold;
`;

export const HighlightGreen = styled.span`
	color: #4dff88;
	font-weight: bold;
`;

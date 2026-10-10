import styled from 'styled-components';
import { motion } from 'framer-motion';

export const LogContainer = styled(motion.div)`
	flex: 1 1 0;
	min-width: 0;
	max-height: 30vh;
	background-color: #1a1a1a;
	border: 1px solid #333;
	border-radius: 8px;
	display: flex;
	flex-direction: column;
	margin: 1rem 0;
	font-family: monospace;
	overflow: auto;
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
	padding: 1rem;
	display: flex;
	flex-direction: column;
	gap: 0.25rem;
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

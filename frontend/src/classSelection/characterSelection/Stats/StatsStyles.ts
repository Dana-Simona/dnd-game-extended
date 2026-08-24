import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Container = styled.div`
	position: absolute;
	left: 120px;
	top: -80px;
	display: flex;
	flex-direction: column;
	gap: 5px;
	font-family: monospace;
	color: white;
	width: 150px;
`;

export const StatRow = styled.div`
	display: flex;
	flex-direction: column;
`;

export const StatLabel = styled.span`
	font-size: 10px;
	text-transform: uppercase;
	letter-spacing: 1px;
	color: #00ffcc;
`;

export const StringValue = styled.span`
	font-size: 12px;
	font-family: monospace;
	color: #00ffcc;
	text-shadow: 0 0 5px #00ffcc;
`;

export const BarBackground = styled.div`
	width: 100%;
	height: 12px;
	background-color: rgba(0, 0, 0, 0.5);
	border: 1px solid #00b691;
	border-radius: 2px;
	overflow: hidden;
	box-shadow: 0 0 4px rgba(0, 255, 255, 0.2);
`;

export const BarFill = styled(motion.div)`
	height: 100%;
	background-color: #00cea5;
	box-shadow: 0 0 8px #00ffcc;
`;

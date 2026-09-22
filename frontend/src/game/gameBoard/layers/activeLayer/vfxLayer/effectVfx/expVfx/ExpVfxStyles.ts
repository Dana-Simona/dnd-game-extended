import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

export const ExpOrbContainer = styled(motion.div)`
	position: absolute;
	width: 6px; 
	height: 6px;
	pointer-events: none;
	z-index: 50;
	transform: translate(-50%, -50%);
`;

const pulse = keyframes`
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.4); opacity: 0.4; }
    100% { transform: scale(1); opacity: 0.8; }
`;

export const ExpOrbGlow = styled.div`
	position: absolute;
	inset: -4px; /* Scaled down glow */
	background: radial-gradient(
		circle,
		rgba(255, 215, 0, 0.9) 0%,
		rgba(255, 215, 0, 0) 70%
	);
	border-radius: 50%;
	animation: ${pulse} 1.5s infinite ease-in-out;
`;

export const ExpOrbCore = styled.div`
	position: absolute;
	inset: 0;
	background: #fffde7;
	border: 1px solid #ffeb3b;
	border-radius: 50%;
	box-shadow:
		0 0 6px 2px rgba(255, 215, 0, 0.7),
		inset 0 0 2px #ffffff;
`;

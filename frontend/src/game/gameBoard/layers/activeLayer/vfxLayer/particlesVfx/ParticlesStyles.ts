import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Container = styled.div<{ $x: number; $y: number }>`
	position: absolute;
	left: ${(props) => props.$x}px;
	top: ${(props) => props.$y}px;
	pointer-events: none;
	z-index: 100;
`;

export const ParticleShape = styled(motion.div)<{
	$size: number;
	$color: string;
}>`
	position: absolute;
	width: ${(props) => props.$size}px;
	height: ${(props) => props.$size}px;
	background-color: ${(props) => props.$color};
	border-radius: 0;
	image-rendering: pixelated;
`;

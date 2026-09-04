import styled from 'styled-components';
import { motion } from 'framer-motion';

export const ActiveLayerContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	pointer-events: none;
`;

interface AnimatedUnitWrapperProps {
	$tileSize: number;
	$zIndex: number;
}

export const AnimatedUnitWrapper = styled(motion.div)<AnimatedUnitWrapperProps>`
	position: absolute;
	top: 0;
	left: 0;
	width: ${(props) => props.$tileSize}px;
	height: ${(props) => props.$tileSize}px;
	pointer-events: none;
	z-index: ${(props) => props.$zIndex};
`;

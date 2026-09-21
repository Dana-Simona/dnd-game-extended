import styled from 'styled-components';
import { motion } from 'framer-motion';

interface RangeRingProps {
	$range: number;
	$tileSize: number;
}

const BaseRangeRing = styled(motion.div)<RangeRingProps>`
	position: absolute;

	top: calc(50% - ${({ $range, $tileSize }) => $range * $tileSize}px);
	left: calc(50% - ${({ $range, $tileSize }) => $range * $tileSize}px);

	width: ${({ $range, $tileSize }) => $range * 2 * $tileSize}px;
	height: ${({ $range, $tileSize }) => $range * 2 * $tileSize}px;

	border-radius: 50%;
	pointer-events: none;
	box-sizing: border-box;
`;

export const VisionRangeRing = styled(BaseRangeRing)`
	border: 2px solid #9ca3af;
	background-color: rgba(156, 163, 175, 0.15);
	box-shadow: 0 0 12px rgba(156, 163, 175, 0.3);
	z-index: 10;
`;

export const AbilityRangeRing = styled(BaseRangeRing)`
	border: 2px solid #a855f7;
	background-color: rgba(168, 85, 247, 0.2);
	box-shadow: 0 0 14px rgba(168, 85, 247, 0.4);
	z-index: 11;
`;

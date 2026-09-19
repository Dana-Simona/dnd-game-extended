import styled from 'styled-components';
import { motion } from 'framer-motion';

export const BarContainer = styled.div<{ $offsetY?: number }>`
	position: absolute;
	top: ${({ $offsetY = 0 }) => `${-8 + $offsetY}px`};
	left: 50%;
	transform: translateX(-50%);
	width: 32px;
	height: 6px;
	background-color: rgba(10, 10, 12, 0.75);
	border-radius: 2px;
	backdrop-filter: blur(4px);
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10;
	user-select: none;
`;

export const BarFill = styled(motion.div)<{ $hasPreview?: boolean }>`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	border-radius: ${({ $hasPreview }) =>
		$hasPreview ? '1px 0 0 1px' : '1px'};
	background-color: #ef4444;
`;

export const PreviewBarFill = styled(motion.div)`
	position: absolute;
	top: 0;
	height: 100%;
	border-radius: 0 1px 1px 0;
	background-color: #ffcc33;
`;

export const HealthText = styled.span`
	position: relative;
	z-index: 1;
	font-family:
		-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', sans-serif;
	font-size: 5px;
	font-weight: 300;
	text-align: center;
	letter-spacing: 0.2px;
	color: #ffffff;
	line-height: 0.8;
	pointer-events: none;

	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;

	span {
		opacity: 0.7;
		font-size: 4px;
		font-weight: 300;
		margin-left: 0.5px;
	}
`;

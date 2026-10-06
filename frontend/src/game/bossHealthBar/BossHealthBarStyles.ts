import styled from 'styled-components';
import { motion } from 'framer-motion';

export const BossBarWrapper = styled(motion.div)`
	position: absolute;
	top: 14px;
	left: 50%;
	width: min(560px, 60%);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 6px;
	z-index: 50;
	pointer-events: none;
	user-select: none;
`;

export const BossName = styled.span`
	font-family: monospace;
	font-size: 14px;
	font-weight: 700;
	letter-spacing: 3px;
	text-transform: uppercase;
	color: #f5e6c8;
	text-shadow:
		0 0 6px rgba(239, 68, 68, 0.7),
		0 2px 0 #000;
`;

export const BossBarContainer = styled.div`
	position: relative;
	width: 100%;
	height: 14px;
	background-color: rgba(10, 10, 12, 0.85);
	border: 1px solid #5a1e1e;
	border-radius: 3px;
	box-shadow:
		0 0 12px rgba(239, 68, 68, 0.35),
		inset 0 0 4px rgba(0, 0, 0, 0.8);
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
`;

export const BossBarFill = styled(motion.div)<{ $hasPreview?: boolean }>`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	background: linear-gradient(180deg, #f87171 0%, #dc2626 55%, #991b1b 100%);
	border-radius: ${({ $hasPreview }) => ($hasPreview ? '2px 0 0 2px' : '2px')};
`;

export const BossPreviewFill = styled(motion.div)<{ $color?: string }>`
	position: absolute;
	top: 0;
	height: 100%;
	background-color: ${({ $color }) => $color ?? '#ffcc33'};
	border-radius: 0 2px 2px 0;
`;

export const BossHealthText = styled.span`
	position: relative;
	z-index: 1;
	font-family: monospace;
	font-size: 10px;
	color: #ffffff;
	text-shadow: 0 1px 0 #000;
	line-height: 1;
`;

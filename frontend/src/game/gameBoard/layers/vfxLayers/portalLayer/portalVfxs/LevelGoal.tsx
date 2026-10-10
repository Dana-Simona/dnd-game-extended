import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
	type VfxItem,
} from '../../../../../../constants/animationStates/vfxStates';

interface Props {
	item: VfxItem;
}

const TEAL = '#00ffcc';
const BLOOD = '#ef4444';
const BONE = '#f5e6c8';

const GOAL_BANNER_MS = 3000;

const LevelGoal: React.FC<Props> = ({ item }) => {
	const isBoss = !!item.isBoss;
	const seconds = (item.durationMs ?? GOAL_BANNER_MS) / 1000;

	return (
		<Positioner>
			<Plate
				$boss={isBoss}
				initial={{ opacity: 0, y: -18, scale: 0.96 }}
				animate={{
					opacity: [0, 1, 1, 0],
					y: [-18, 0, 0, -10],
					scale: [0.96, 1, 1, 1],
				}}
				transition={{
					duration: seconds,
					times: [0, 0.1, 0.88, 1],
					ease: 'easeOut',
				}}
			>
				<Label $boss={isBoss}>Goal:</Label>
				<Objective $boss={isBoss}>{item.text}</Objective>
				<Underline
					$boss={isBoss}
					initial={{ scaleX: 0 }}
					animate={{ scaleX: 1 }}
					transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
				/>
			</Plate>
		</Positioner>
	);
};

export default LevelGoal;

const Positioner = styled.div`
	position: absolute;
	top: 12vh;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	pointer-events: none;
`;

const Plate = styled(motion.div)<{ $boss: boolean }>`
	position: relative;
	display: flex;
	align-items: baseline;
	gap: 14px;
	padding: 14px 28px 16px;
	font-family: monospace;
	text-transform: uppercase;
	white-space: nowrap;
	background: linear-gradient(180deg, #0b0e10 0%, #141a1d 100%);
	border: 2px solid ${({ $boss }) => ($boss ? '#5a1e1e' : '#383838')};
	border-radius: 8px;
	box-shadow: ${({ $boss }) =>
		$boss
			? '0 0 18px rgba(239, 68, 68, 0.4), inset 0 0 10px rgba(0, 0, 0, 0.8)'
			: '0 0 15px rgba(0, 255, 204, 0.3), inset 0 0 10px rgba(0, 0, 0, 0.8)'};
	overflow: hidden;
`;

const Label = styled.span<{ $boss: boolean }>`
	font-size: 1rem;
	font-weight: 700;
	letter-spacing: 3px;
	color: ${({ $boss }) => ($boss ? BLOOD : TEAL)};
	text-shadow: ${({ $boss }) =>
		$boss
			? '0 0 8px rgba(239, 68, 68, 0.7)'
			: '0 0 10px rgba(0, 255, 204, 0.5)'};
`;

const Objective = styled.span<{ $boss: boolean }>`
	font-size: 1.6rem;
	font-weight: 900;
	letter-spacing: 3px;
	color: ${({ $boss }) => ($boss ? BONE : '#e0e0e0')};
	text-shadow: ${({ $boss }) =>
		$boss
			? '0 0 6px rgba(239, 68, 68, 0.7), 0 2px 0 #000'
			: '0 0 6px rgba(0, 255, 204, 0.35), 0 2px 0 #000'};
`;

const Underline = styled(motion.div)<{ $boss: boolean }>`
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
	height: 3px;
	transform-origin: left center;
	background: ${({ $boss }) => ($boss ? BLOOD : TEAL)};
	box-shadow: 0 0 10px
		${({ $boss }) =>
			$boss ? 'rgba(239, 68, 68, 0.8)' : 'rgba(0, 255, 204, 0.8)'};
`;

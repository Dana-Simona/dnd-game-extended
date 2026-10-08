import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import {
	LEVEL_TRANSITION_MS,
	type VfxItem,
} from '../../../../../../constants/animationStates/vfxStates';

interface Props {
	item: VfxItem;
}

const TEAL = '#00ffcc';
const SLATE = '#0b0e10';
const EASE: [number, number, number, number] = [0.76, 0, 0.24, 1];

const LevelTransition: React.FC<Props> = ({ item }) => {
	const covered = item.visible !== false;
	const seconds = (item.durationMs ?? LEVEL_TRANSITION_MS) / 1000;

	return (
		<Curtain>
			<Door
				$side='left'
				initial={{ x: '-100%' }}
				animate={{ x: covered ? '0%' : '-100%' }}
				transition={{ duration: seconds, ease: EASE }}
			/>
			<Door
				$side='right'
				initial={{ x: '100%' }}
				animate={{ x: covered ? '0%' : '100%' }}
				transition={{ duration: seconds, ease: EASE }}
			/>

			<Label
				initial={{ opacity: 0, scale: 0.92 }}
				animate={{
					opacity: covered ? 1 : 0,
					scale: covered ? 1 : 1.06,
				}}
				transition={{
					duration: seconds * 0.5,
					delay: covered ? seconds * 0.75 : 0,
					ease: 'easeOut',
				}}
			>
				<LevelName>Level {item.amount}</LevelName>
			</Label>
		</Curtain>
	);
};

export default LevelTransition;

const Curtain = styled.div`
	position: absolute;
	inset: 0;
	overflow: hidden;
`;

const Door = styled(motion.div)<{ $side: 'left' | 'right' }>`
	position: absolute;
	top: 0;
	bottom: 0;
	${({ $side }) => ($side === 'left' ? 'left: 0;' : 'right: 0;')}
	width: 50.5%;
	background: linear-gradient(180deg, ${SLATE} 0%, #141a1d 100%);
	${({ $side }) =>
		$side === 'left'
			? `border-right: 3px solid ${TEAL};`
			: `border-left: 3px solid ${TEAL};`}
	box-shadow: 0 0 32px rgba(0, 255, 204, 0.35);
`;

const Label = styled(motion.div)`
	position: absolute;
	inset: 0;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 6px;
	font-family: monospace;
	text-transform: uppercase;
	text-align: center;
`;

const LevelName = styled.span`
	color: ${TEAL};
	font-size: 3rem;
	font-weight: 900;
	letter-spacing: 4px;
	text-shadow: 0 0 24px rgba(20, 184, 166, 0.45);
	white-space: nowrap;
`;

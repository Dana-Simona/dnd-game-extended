import React, { useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { VfxItem } from '../../../../../../../constants/animationStates/vfxStates';

interface Props {
	item: VfxItem;
}

interface DropConfig {
	id: number;
	width: number;
	height: number;
	color: string;
	startX: number;
	startY: number;
	driftX: number;
	fall: number;
	delay: number;
	duration: number;
}

const DROP_COUNT = 80;

const BLOOD_COLORS = ['#800000', '#990000', '#cc0000', '#e60000', '#4a0000'];
const DRIP_EASE: [number, number, number, number] = [0.9, 0, 1, 0.5];
const FADE_TIMES = [0, 0.08, 0.8, 1];
const STRETCH_TIMES = [0, 0.7, 1];

const MAX_DELAY_S = 3.5;
const MAX_DURATION_S = 1.7;

const randomBetween = (min: number, max: number) =>
	min + Math.random() * (max - min);

const generateDrops = (): DropConfig[] =>
	Array.from({ length: DROP_COUNT }, (_, i) => ({
		id: i,
		width: 2,
		height: 2,
		color: BLOOD_COLORS[Math.floor(Math.random() * BLOOD_COLORS.length)],
		startX: randomBetween(-9, 9),
		startY: randomBetween(-14, 4),
		driftX: randomBetween(-1.5, 1.5),
		fall: randomBetween(26, 56),
		delay: randomBetween(0, MAX_DELAY_S),
		duration: randomBetween(1.1, MAX_DURATION_S),
	}));

const BloodDrip: React.FC<Props> = ({ item }) => {
	const drops = useMemo(() => generateDrops(), []);

	return (
		<Container
			$x={item.x}
			$y={item.y}
		>
			{drops.map((d) => (
				<Drop
					key={d.id}
					$width={d.width}
					$height={d.height}
					$color={d.color}
					initial={{
						x: d.startX,
						y: d.startY,
						opacity: 0,
						scaleY: 1,
					}}
					animate={{
						x: d.startX + d.driftX,
						y: d.startY + d.fall,
						opacity: [0, 1, 1, 0],
						scaleY: [1, 1, 3],
					}}
					transition={{
						x: {
							duration: d.duration,
							delay: d.delay,
							ease: 'linear',
						},
						y: {
							duration: d.duration,
							delay: d.delay,
							ease: DRIP_EASE,
						},
						opacity: {
							duration: d.duration,
							delay: d.delay,
							times: FADE_TIMES,
							ease: 'linear',
						},
						scaleY: {
							duration: d.duration,
							delay: d.delay,
							times: STRETCH_TIMES,
							ease: 'easeIn',
						},
					}}
				/>
			))}
		</Container>
	);
};

export default BloodDrip;

const Container = styled.div<{ $x: number; $y: number }>`
	position: absolute;
	left: ${(props) => props.$x}px;
	top: ${(props) => props.$y + 30}px;
	pointer-events: none;
	z-index: 100;
`;

const Drop = styled(motion.div)<{
	$width: number;
	$height: number;
	$color: string;
}>`
	position: absolute;
	width: ${(props) => props.$width}px;
	height: ${(props) => props.$height}px;
	background-color: ${(props) => props.$color};
	transform-origin: 50% 0%;
	image-rendering: pixelated;
`;

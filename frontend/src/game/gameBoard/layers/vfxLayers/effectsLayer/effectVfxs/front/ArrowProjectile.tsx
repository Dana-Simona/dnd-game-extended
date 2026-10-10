import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
	ARROW_FADE_MS,
	ARROW_FLIGHT_MS,
	ARROW_HOLD_MS,
	type VfxItem,
} from '../../../../../../../constants/animationStates/vfxStates';

interface Props {
	item: VfxItem;
}

const HAND_OFFSET_X = 8;
const HAND_OFFSET_Y = -4;
const TARGET_OFFSET_Y = -6;

const FADE_IN_MS = 150;
const ARROW_SCALE = 0.6;

const ArrowProjectile: React.FC<Props> = ({ item }) => {
	const holdMs = item.holdMs ?? ARROW_HOLD_MS;
	const flightMs = item.flightMs ?? ARROW_FLIGHT_MS;

	const unitX = item.sourceX ?? item.x;
	const unitY = item.sourceY ?? item.y;
	const towardsEnemy = item.x >= unitX ? 1 : -1;

	const startX =
		unitX + (item.sourceOffsetX ?? 0) + towardsEnemy * HAND_OFFSET_X;
	const startY = unitY + (item.sourceOffsetY ?? 0) + HAND_OFFSET_Y;

	const endX = item.x;
	const endY = item.y + TARGET_OFFSET_Y;

	const deltaX = endX - startX;
	const deltaY = endY - startY;
	const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

	const fadeInMs = Math.min(FADE_IN_MS, holdMs);
	const totalMs = holdMs + flightMs + ARROW_FADE_MS;
	const times = [
		0,
		fadeInMs / totalMs,
		holdMs / totalMs,
		(holdMs + flightMs) / totalMs,
		1,
	];

	return (
		<ArrowAnchor
			$x={startX}
			$y={startY}
		>
			<ArrowContainer
				style={{ rotate: angle, scale: ARROW_SCALE }}
				initial={{ opacity: 0, x: 0, y: 0 }}
				animate={{
					opacity: [0, 1, 1, 1, 0],
					x: [0, 0, 0, deltaX, deltaX],
					y: [0, 0, 0, deltaY, deltaY],
				}}
				transition={{
					duration: totalMs / 1000,
					times,
					ease: ['linear', 'linear', 'easeIn', 'linear'],
				}}
			>
				<ArrowImage
					src='/vfx/effects/arrow.png'
					alt='Arrow Projectile'
				/>
			</ArrowContainer>
		</ArrowAnchor>
	);
};

export default ArrowProjectile;

const ArrowAnchor = styled.div<{ $x: number; $y: number }>`
	position: absolute;
	left: ${({ $x }) => $x}px;
	top: ${({ $y }) => $y}px;
	transform: translate(-50%, -50%);
	pointer-events: none;
	z-index: 10;
	mix-blend-mode: screen;
	filter: brightness(1.2) contrast(1.5);
`;

const ArrowContainer = styled(motion.div)`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ArrowImage = styled.img`
	width: auto;
	max-width: 100px;
	height: auto;
	display: block;
	transform-origin: center center;
`;

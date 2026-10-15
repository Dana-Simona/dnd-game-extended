import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import {
	ARROW_FLIGHT_MS,
	ARROW_HOLD_MS,
	type VfxItem,
} from '../../../../../../../constants/animationStates/vfxStates';

import { assetUrl } from '../../../../../../../utils/assetUrl';

interface Props {
	item: VfxItem;
}

const HAND_OFFSET_X = 8;
const HAND_OFFSET_Y = -15;
const TARGET_OFFSET_Y = -6;

const FADE_IN_MS = 150;
const ARROW_SCALE = 0.85;

const particleData = [
	{ x: 0, y: -15, size: 3, delay: 0 },
	{ x: -4, y: 18, size: 2, delay: 0.1 },
	{ x: 5, y: -22, size: 4, delay: 0.05 },
	{ x: -8, y: 20, size: 2, delay: 0.2 },
	{ x: 10, y: -18, size: 3, delay: 0.15 },
	{ x: -2, y: 25, size: 2, delay: 0.08 },
	{ x: 6, y: -28, size: 3, delay: 0.25 },
	{ x: -12, y: 22, size: 2, delay: 0.12 },
	{ x: 15, y: -20, size: 4, delay: 0.22 },
	{ x: 2, y: 15, size: 2, delay: 0.02 },
	{ x: -20, y: -15, size: 2, delay: 0.3 },
	{ x: 22, y: 15, size: 3, delay: 0.18 },
	{ x: -30, y: 18, size: 2, delay: 0.05 },
	{ x: 32, y: -18, size: 2, delay: 0.2 },
];

const ArrowProjectile: React.FC<Props> = ({ item }) => {
	const holdMs = item.holdMs ?? ARROW_HOLD_MS;

	const flightMs = (item.flightMs ?? ARROW_FLIGHT_MS) * 0.4;

	const wobbleMs = 500;

	const totalMs = holdMs + flightMs;

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

	const times = [0, fadeInMs / totalMs, holdMs / totalMs, 1];

	return (
		<ArrowAnchor
			$x={startX}
			$y={startY}
		>
			<ArrowContainer
				style={{ rotate: angle, scale: ARROW_SCALE }}
				initial={{ opacity: 0, x: 0, y: 0 }}
				animate={{
					opacity: [0, 1, 1, 1],
					x: [0, 0, 0, deltaX],
					y: [0, 0, 0, deltaY],
				}}
				transition={{
					duration: totalMs / 1000,
					times,
					ease: ['linear', 'linear', 'easeIn'],
				}}
			>
				<ParticlesContainer
					animate={{ opacity: [1, 1, 0, 0] }}
					transition={{
						duration: totalMs / 1000,
						times: [
							0,
							Math.max(0, (holdMs - 10) / totalMs),
							holdMs / totalMs,
							1,
						],
						ease: 'linear',
					}}
				>
					{particleData.map((p, i) => (
						<Particle
							key={i}
							$size={p.size}
							initial={{ x: p.x, y: 0, opacity: 0, scale: 0.5 }}
							animate={{
								y: [0, p.y],
								opacity: [0, 1, 0],
								scale: [0.5, 1.5, 0.5],
							}}
							transition={{
								duration: 0.6,
								delay: p.delay,
								repeat: Math.floor(holdMs / 600),
								ease: 'easeOut',
							}}
						/>
					))}
				</ParticlesContainer>

				<GlowShakeContainer
					animate={{
						x: [
							0, 1, 0, -1, 0, 1, 0, -1, 1, 0, -1, 0, 1, 0, -1, 1,
							0, -1, 0, 0,
						],
						y: [
							0, 0, 1, 0, -1, 0, 1, 0, -1, -1, 0, 1, 0, -1, 0, 1,
							0, -1, 0, 0,
						],
						filter: [
							'brightness(1) contrast(1)',
							'brightness(1.5) contrast(1.2)',
							'brightness(2.5) contrast(1.5)',
							'brightness(3) contrast(1.8)',
							'brightness(3.5) contrast(2)',
							'brightness(3) contrast(1.8)',
							'brightness(2.5) contrast(1.5)',
							'brightness(1.5) contrast(1.2)',
							'brightness(1) contrast(1)',
							'brightness(1) contrast(1)',
						],
					}}
					transition={{
						duration: holdMs / 1000,
						ease: 'linear',
					}}
				>
					<WobbleContainer
						initial={{ rotate: 0 }}
						animate={{
							rotate: [0, -30, 20, -10, 5, -2, 0],
						}}
						transition={{
							delay: (holdMs + flightMs) / 1000,
							duration: wobbleMs / 1000,
							ease: 'easeOut',
						}}
					>
						<ArrowImage
							src={assetUrl('/vfx/effects/arrow.png')}
							alt='Arrow Projectile'
						/>
					</WobbleContainer>
				</GlowShakeContainer>
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
	position: relative;
`;

const ParticlesContainer = styled(motion.div)`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 2;
`;

const GlowShakeContainer = styled(motion.div)`
	display: flex;
	align-items: center;
	justify-content: center;
`;

const WobbleContainer = styled(motion.div)`
	display: flex;
	align-items: center;
	justify-content: center;
	transform-origin: 100% 50%;
`;

const ArrowImage = styled.img`
	width: auto;
	max-width: 100px;
	height: auto;
	display: block;
	transform-origin: center center;
`;

const Particle = styled(motion.div)<{ $size: number }>`
	position: absolute;
	width: ${({ $size }) => $size}px;
	height: ${({ $size }) => $size}px;
	background-color: #fffdd0;
	border-radius: 50%;
	box-shadow: 0 0 6px 2px rgba(255, 253, 208, 0.7);
	z-index: 1;
`;

import React, { useMemo } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const baseFilter = 'brightness(0.25) contrast(1.3)';

const BlizzardClouds: React.FC = () => {
	const rainDrops = useMemo(() => {
		return Array.from({ length: 35 }).map((_, i) => ({
			id: i,
			startX: `${(i / 35) * 140 - 20}%`,
			duration: 0.8 + (i % 5) * 0.15,
			delay: (i % 7) * 0.2,
			length: 25 + (i % 4) * 10,
			opacity: 0.2 + (i % 3) * 0.15,
		}));
	}, []);

	return (
		<CloudContainer
			initial={{ opacity: 0, y: -40 }}
			animate={{ opacity: 1, y: -30 }}
			transition={{
				duration: 1.2,
				ease: 'easeOut',
			}}
		>
			<RainContainer>
				{rainDrops.map((drop) => (
					<RainDrop
						key={drop.id}
						$length={drop.length}
						style={{ left: drop.startX }}
						initial={{ x: 0, y: -60, opacity: 0 }}
						animate={{
							x: '-300px',
							y: '105vh',
							opacity: [0, drop.opacity, drop.opacity, 0],
						}}
						transition={{
							duration: drop.duration,
							delay: drop.delay,
							repeat: Infinity,
							ease: 'linear',
						}}
					/>
				))}
			</RainContainer>

			<CloudImage
				$topOffset='-150px'
				src='/vfx/portalVfxs/blizzardCloud1.png'
				initial={{
					right: '-70%',
					filter: baseFilter,
				}}
				animate={{
					right: '-10%',
					filter: [
						baseFilter,
						baseFilter,
						'brightness(0.65) contrast(1.3)',
						'brightness(0.35) contrast(1.3)',
						'brightness(0.50) contrast(1.3)',
						baseFilter,
					],
				}}
				transition={{
					right: { duration: 2, ease: 'easeOut' },
					filter: {
						duration: 4.5,
						repeat: Infinity,
						times: [0, 0.5, 0.52, 0.55, 0.58, 1],
						ease: 'linear',
					},
				}}
			/>

			<CloudImage
				src='/vfx/portalVfxs/blizzardCloud2.png'
				$topOffset='-120px'
				initial={{
					right: '-50%',
					filter: baseFilter,
				}}
				animate={{
					right: '-30%',
					filter: [
						baseFilter,
						baseFilter,
						'brightness(0.7) contrast(1.4)',
						baseFilter,
					],
				}}
				transition={{
					right: { duration: 1.2, ease: 'easeOut', delay: 0.2 },
					filter: {
						duration: 3.2,
						repeat: Infinity,
						times: [0, 0.2, 0.23, 1],
						delay: 0.8,
						ease: 'linear',
					},
				}}
			/>

			<CloudImage
				src='/vfx/portalVfxs/blizzardCloud3.png'
				$topOffset='-150px'
				initial={{
					left: '-70%',
					filter: baseFilter,
				}}
				animate={{
					left: '-10%',
					filter: [
						baseFilter,
						baseFilter,
						'brightness(0.5) contrast(1.3)',
						'brightness(0.3) contrast(1.3)',
						'brightness(0.65) contrast(1.3)',
						'brightness(0.35) contrast(1.3)',
						'brightness(0.45) contrast(1.3)',
						baseFilter,
					],
				}}
				transition={{
					left: { duration: 1.8, ease: 'easeOut', delay: 0.1 },
					filter: {
						duration: 5,
						repeat: Infinity,
						times: [0, 0.65, 0.67, 0.69, 0.72, 0.74, 0.76, 1],
						delay: 0.3,
						ease: 'linear',
					},
				}}
			/>

			<CloudImage
				src='/vfx/portalVfxs/blizzardCloud4.png'
				$topOffset='-180px'
				initial={{
					left: '-50%',
					filter: baseFilter,
				}}
				animate={{
					left: '10%',
					filter: [
						baseFilter,
						baseFilter,
						'brightness(0.75) contrast(1.4)',
						'brightness(0.35) contrast(1.3)',
						'brightness(0.55) contrast(1.3)',
						baseFilter,
					],
				}}
				transition={{
					left: { duration: 1.7, ease: 'easeOut', delay: 0.3 },
					filter: {
						duration: 3.8,
						repeat: Infinity,
						times: [0, 0.35, 0.37, 0.4, 0.43, 1],
						delay: 1.2,
						ease: 'linear',
					},
				}}
			/>
		</CloudContainer>
	);
};

export default BlizzardClouds;

const CloudContainer = styled(motion.div)`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	pointer-events: none;
	z-index: 10;
	overflow: hidden;
`;

const CloudImage = styled(motion.img)<{ $topOffset?: string }>`
	position: absolute;
	top: ${(props) => props.$topOffset || '0'};
	height: auto;
	display: block;
	filter: ${baseFilter};
`;

const RainContainer = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 1;
`;

const RainDrop = styled(motion.div)<{ $length: number }>`
	position: absolute;
	top: 0;
	width: 1px;
	height: ${(props) => props.$length}px;
	background: linear-gradient(
		45deg,
		rgba(255, 255, 255, 0) 0%,
		rgba(180, 220, 255, 0.788) 100%
	);
	transform: rotate(20deg);
	transform-origin: top center;
`;

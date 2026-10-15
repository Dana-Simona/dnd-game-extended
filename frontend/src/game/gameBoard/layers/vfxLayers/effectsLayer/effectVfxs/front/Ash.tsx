import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Sprite from '../../../../../../../utils/sprite/Sprite';
import type { VfxItem } from '../../../../../../../constants/animationStates/vfxStates';

import { assetUrl } from '../../../../../../../utils/assetUrl';

interface Props {
	item: VfxItem;
}

interface ParticleData {
	id: number;
	isLive: boolean;
	size: number;
	startX: number;
	endX: number;
	startY: number;
	yDrift: number;
	duration: number;
	delay: number;
	grayValue: number;
	opacity: number;
	blur: number;
}

const Ash: React.FC<Props> = ({ item }) => {
	const [particles, setParticles] = useState<ParticleData[]>([]);

	useEffect(() => {
		const generatedParticles = Array.from({ length: 120 }).map((_, i) => {
			const isLive = Math.random() > 0.85;
			const size = Math.random() * 20 + 10;
			const startX = Math.random() * 120;
			const endX = startX - (Math.random() * 60 + 60);
			const startY = 100 - Math.random() * Math.random() * 80;
			const yDrift = -(Math.random() * 35 + 10);
			const duration = Math.random() * 12 + 8;
			const delay = Math.random() * 10;
			const grayValue = Math.floor(Math.random() * 100) + 50;
			const opacity = Math.random() * 0.7 + 0.3;
			const blur = Math.random() * 5 + 0.5;

			return {
				id: i,
				isLive,
				size,
				startX,
				endX,
				startY,
				yDrift,
				duration,
				delay,
				grayValue,
				opacity,
				blur,
			};
		});
		setParticles(generatedParticles);
	}, []);

	return (
		<Container
			$x={item.x}
			$y={item.y}
		>
			<SpriteWrapper>
				<Sprite
					imagePath={assetUrl('/vfx/portalVfxs/fireTransition.png')}
					width={142}
					height={80}
					frameCount={15}
				/>
			</SpriteWrapper>

			{particles.map((p) => (
				<Particle
					key={p.id}
					style={{
						width: p.size,
						height: p.size,
						filter: `blur(${p.blur}px)`,
						background: p.isLive
							? 'radial-gradient(circle, #ff0000 15%, #ffcc00 40%, rgba(50, 50, 50, 0.8) 80%)'
							: `rgba(${p.grayValue}, ${p.grayValue}, ${p.grayValue}, ${p.opacity})`,
						top: `${p.startY}vh`,
					}}
					initial={{ x: `${p.startX}vw`, opacity: 0 }}
					animate={{
						x: `${p.endX}vw`,
						y: `${p.yDrift}vh`,
						opacity: [0, p.opacity, p.opacity, 0],
					}}
					transition={{
						duration: p.duration,
						repeat: Infinity,
						ease: 'linear',
						delay: p.delay,
					}}
				/>
			))}
		</Container>
	);
};

export default Ash;

const Container = styled.div<{ $x: number; $y: number }>`
	position: absolute;
	left: ${(props) => props.$x - 100}px;
	top: ${(props) => props.$y - 100}px;
	pointer-events: none;
	z-index: 100;
`;

const SpriteWrapper = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 142px;
	height: 80px;
	transform-origin: top left;
	transform: scale(calc(45vh / 80px));
	filter: blur(1px);
`;

const Particle = styled(motion.div)`
	position: absolute;
	border-radius: 50%;
	filter: saturate(200%);
`;

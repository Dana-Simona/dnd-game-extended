import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

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

const Ash: React.FC = () => {
	const [particles, setParticles] = useState<ParticleData[]>([]);

	useEffect(() => {
		const generatedParticles = Array.from({ length: 120 }).map((_, i) => {
			const isLive = Math.random() > 0.85;
			const size = Math.random() * 20 + 10;
			const startX = Math.random() * 120;
			const endX = startX - (Math.random() * 60 + 60);
			const startY = 70 - Math.random() * Math.random() * 50;
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
		<Container>
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

const Container = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 70vh;
	overflow: hidden;
	pointer-events: none;
`;

const Particle = styled(motion.div)`
	position: absolute;
	border-radius: 50%;
	filter: saturate(200%);
`;

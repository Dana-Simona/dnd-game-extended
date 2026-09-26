import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const BlizzardClouds: React.FC = () => {
	return (
		<CloudContainer
			initial={{ opacity: 0, y: -40 }}
			animate={{ opacity: 0.8, y: -30 }}
			transition={{
				duration: 1.2,
				ease: 'easeOut',
			}}
		>
			<CloudImage src='/vfx/portalVfxs/blizzardCloud.png' />
		</CloudContainer>
	);
};

export default BlizzardClouds;

const CloudContainer = styled(motion.div)`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	pointer-events: none;
	z-index: 10;
`;

const CloudImage = styled.img`
	width: 100%;
	height: auto;
	display: block;
	filter: brightness(0.4) contrast(1.2);
`;

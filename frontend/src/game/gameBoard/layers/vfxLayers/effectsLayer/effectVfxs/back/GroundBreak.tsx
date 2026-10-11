import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { VfxItem } from '../../../../../../../constants/animationStates/vfxStates';

interface Props {
	item: VfxItem;
}

const GroundBreak: React.FC<Props> = ({ item }) => {
	return (
		<Container
			$x={item.x}
			$y={item.y}
			initial={{ scale: 0.3, opacity: 0 }}
			animate={{ scale: 0.31, opacity: 1 }}
			transition={{
				duration: 0.5,
				ease: [0.16, 0.5, 0.3, 1],
			}}
		>
			<GroundImage src='/vfx/effects/groundBreak.jpeg' />
		</Container>
	);
};

export default GroundBreak;

const Container = styled(motion.div).attrs<{ $x: number; $y: number }>(
	({ $x, $y }) => ({
		style: {
			left: $x,
			top: $y + 40,
			x: '-50%',
			y: '-50%',
		},
	}),
)<{ $x: number; $y: number }>`
	position: absolute;
	pointer-events: none;
	z-index: 1;
	mix-blend-mode: multiply;
`;

const GroundImage = styled.img`
	width: auto;
	height: auto;
	display: block;
	transform-origin: bottom center;
`;

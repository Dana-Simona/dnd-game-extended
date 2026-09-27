import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { VfxItem } from '../../../../../../../constants/animationStates/vfxStates';
import Sprite from '../../../../../../../utils/sprite/Sprite';

interface Props {
	item: VfxItem;
}

const IceExplode: React.FC<Props> = ({ item }) => {
	return (
		<VfxContainer
			$x={item.x}
			$y={item.y}
			initial={{ scale: 0.2, opacity: 0.8 }}
			animate={{ scale: 0.6, opacity: 1 }}
			transition={{
				duration: 0.8,
				ease: 'easeOut',
			}}
		>
			<Sprite
				imagePath={'/vfx/effects/iceExplode.png'}
				width={640}
				height={360}
				frameCount={20}
				fps={24}
			/>
		</VfxContainer>
	);
};

export default IceExplode;

const VfxContainer = styled(motion.div).attrs<{ $x: number; $y: number }>(
	({ $x, $y }) => ({
		style: {
			left: $x + 2,
			top: $y - 30,
			x: '-50%',
			y: '-50%',
		},
	}),
)<{ $x: number; $y: number }>`
	position: absolute;
	pointer-events: none;
	z-index: 10;
	mix-blend-mode: screen;
	filter: brightness(1.2) contrast(1.1) hue-rotate(-60deg);
`;

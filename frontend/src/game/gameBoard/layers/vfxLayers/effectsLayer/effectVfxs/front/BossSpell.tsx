import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Sprite from '../../../../../../../utils/sprite/Sprite';
import type { VfxItem } from '../../../../../../../constants/animationStates/vfxStates';

interface Props {
	item: VfxItem;
}

const BossSpell: React.FC<Props> = ({ item }) => {
	return (
		<VfxContainer
			$x={item.x}
			$y={item.y}
		>
			<Sprite
				imagePath={'/sprites/enemies/malakorTheUnbroken/spell.png'}
				width={140}
				height={93}
				frameCount={16}
				fps={6}
				loopStartFrame={14}
				loop
				style={{transform: 'scale(2)'}}
			/>
		</VfxContainer>
	);
};

export default BossSpell;

const VfxContainer = styled(motion.div).attrs<{ $x: number; $y: number }>(
	({ $x, $y }) => ({
		style: {
			left: $x + 15,
			top: $y - 75,
			x: '-50%',
			y: '-50%',
		},
	}),
)<{ $x: number; $y: number }>`
	position: absolute;
	pointer-events: none;
	z-index: 10;
`;

import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { VfxItem } from '../../../../../../../constants/animationStates/vfxStates';

import { assetUrl } from '../../../../../../../utils/assetUrl';

interface Props {
	item: VfxItem;
}

const IceFeet: React.FC<Props> = ({ item }) => {
	return (
		<IceContainer
			$x={item.x}
			$y={item.y}
			initial={{ scaleY: 0, scaleX: 0.01, opacity: 0 }}
			animate={{ scaleY: 0.06, scaleX: 0.06, opacity: 1 }}
			transition={{
				duration: 0.5,
				ease: [0.16, 0.5, 0.3, 1],
			}}
		>
			<IceImage
				src={assetUrl('/vfx/effects/iceFeet.png')}
				alt='Ice Feet'
			/>
		</IceContainer>
	);
};

export default IceFeet;

const IceContainer = styled(motion.div).attrs<{ $x: number; $y: number }>(
	({ $x, $y }) => ({
		style: {
			left: $x + 2,
			top: $y + 10,
			x: '-50%',
			y: '-50%',
		},
	}),
)<{ $x: number; $y: number }>`
	position: absolute;
	pointer-events: none;
	z-index: 10;
`;

const IceImage = styled.img`
	width: auto;
	height: auto;
	display: block;
	transform-origin: bottom center;
`;

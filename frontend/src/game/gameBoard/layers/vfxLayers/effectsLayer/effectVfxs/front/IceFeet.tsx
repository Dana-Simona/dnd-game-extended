import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { VfxItem } from '../../../../../../../constants/animationStates/vfxStates';

interface Props {
	item: VfxItem;
}

const IceFeet: React.FC<Props> = ({ item }) => {
	return (
		<IceContainer style={{ left: `${item.x}px`, top: `${item.y}px` }}>
			<IceImage
				src='/vfx/effects/iceFeet.png' 
				alt='Ice Feet'
				initial={{ scaleY: 0, scaleX: 0.5, opacity: 0 }}
				animate={{ scaleY: 1, scaleX: 1, opacity: 1 }}
				transition={{
					duration: 0.5,
					ease: [0.16, 1, 0.3, 1], 
				}}
			/>
		</IceContainer>
	);
};

export default IceFeet;

const IceContainer = styled.div`
	position: absolute;
	transform: translate(-50%, -100%);
	pointer-events: none;
	z-index: 10;
`;

const IceImage = styled(motion.img)`
	width: auto;
	height: auto;
	display: block;
	transform-origin: bottom center;
`;

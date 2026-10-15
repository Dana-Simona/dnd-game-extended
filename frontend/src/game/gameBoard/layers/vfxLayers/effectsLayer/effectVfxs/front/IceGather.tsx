import React from 'react';
import styled from 'styled-components';
import type { VfxItem } from '../../../../../../../constants/animationStates/vfxStates';
import Sprite from '../../../../../../../utils/sprite/Sprite';

import { assetUrl } from '../../../../../../../utils/assetUrl';

interface Props {
	item: VfxItem;
}

const IceGather: React.FC<Props> = ({ item }) => {
	return (
		<VfxContainer
			$x={item.x}
			$y={item.y}
		>
			<Sprite
				imagePath={assetUrl('/vfx/effects/iceGather.png')}
				width={512}
				height={512}
				frameCount={52}
				fps={60}
			/>
		</VfxContainer>
	);
};

export default IceGather;

const VfxContainer = styled.div.attrs<{ $x: number; $y: number }>(
	({ $x, $y }) => ({
		style: {
			left: $x + 3,
			top: $y - 34,
		},
	}),
)<{ $x: number; $y: number }>`
	position: absolute;
	transform: translate(-50%, -50%) scale(0.3);
	pointer-events: none;
	z-index: 10;
	mix-blend-mode: screen;
	filter: brightness(1.2) contrast(1.1) hue-rotate(180deg);
`;

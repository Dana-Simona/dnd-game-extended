import React from 'react';
import styled from 'styled-components';
import type { VfxItem } from '../../../../../../../constants/animationStates/vfxStates';
import Sprite from '../../../../../../../utils/sprite/Sprite';

import { assetUrl } from '../../../../../../../utils/assetUrl';

interface Props {
	item: VfxItem;
}

const LightningStrike: React.FC<Props> = ({ item }) => {
	return (
		<VfxContainer
			$x={item.x}
			$y={item.y}
		>
			<Sprite
				imagePath={assetUrl('/vfx/effects/lightning.png')}
				width={420}
				height={288}
				frameCount={12}
				fps={12}
			/>
		</VfxContainer>
	);
};

export default LightningStrike;

const VfxContainer = styled.div.attrs<{ $x: number; $y: number }>(
	({ $x, $y }) => ({
		style: {
			left: $x - 15,
			top: $y - 105,
		},
	}),
)<{ $x: number; $y: number }>`
	position: absolute;
	transform: translate(-50%, -50%);
	pointer-events: none;
	z-index: 10;
	mix-blend-mode: screen;
	filter: brightness(0.6) contrast(10);
`;

import styled from 'styled-components';
import Sprite from '../../../../../../../utils/sprite/Sprite';
import type { VfxItem } from '../../../../../../../constants/animationStates/vfxStates';

import { assetUrl } from '../../../../../../../utils/assetUrl';

interface Props {
	item: VfxItem;
}

const EffectHeal: React.FC<Props> = ({ item }) => {
	return (
		<Container
			$x={item.x}
			$y={item.y}
		>
			<Sprite
				imagePath={assetUrl('/vfx/effects/heal.png')}
				width={512}
				height={512}
				frameCount={57}
				fps={24}
			/>
		</Container>
	);
};

export default EffectHeal;

const Container = styled.div.attrs<{ $x: number; $y: number }>(
	({ $x, $y }) => ({
		style: {
			left: $x - 10,
			top: $y - 10,
			transform: 'translate(-50%, -50%) scale(0.2) scaleX(-1)',
		},
	}),
)<{ $x: number; $y: number }>`
	position: absolute;
	pointer-events: none;
	mix-blend-mode: screen;
	filter: grayscale(1) sepia(1) hue-rotate(70deg) saturate(2.5) contrast(1.2) opacity(0.6);
	z-index: 999;
`;

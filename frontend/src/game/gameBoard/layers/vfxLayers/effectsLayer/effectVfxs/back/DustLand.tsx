import styled from 'styled-components';
import Sprite from '../../../../../../../utils/sprite/Sprite';
import type { VfxItem } from '../../../../../../../constants/animationStates/vfxStates';

import { assetUrl } from '../../../../../../../utils/assetUrl';

interface Props {
	item: VfxItem;
}

const DustLand: React.FC<Props> = ({ item }) => {
	return (
		<Container
			$x={item.x}
			$y={item.y}
		>
			<Sprite
				imagePath={assetUrl('/vfx/effects/dustLand.png')}
				width={555}
				height={130}
				frameCount={35}
				fps={12}
			/>
		</Container>
	);
};

export default DustLand;

const Container = styled.div.attrs<{ $x: number; $y: number }>(
	({ $x, $y }) => ({
		style: {
			left: $x,
			top: $y,
			transform: 'translate(-50%, -50%) scale(0.2)',
		},
	}),
)<{ $x: number; $y: number }>`
	position: absolute;
	pointer-events: none;
	mix-blend-mode: screen;
	filter: contrast(1.5);
`;

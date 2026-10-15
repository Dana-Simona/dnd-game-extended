import styled from 'styled-components';
import Sprite from '../../../../../../../utils/sprite/Sprite';
import type { VfxItem } from '../../../../../../../constants/animationStates/vfxStates';

import { assetUrl } from '../../../../../../../utils/assetUrl';

interface Props {
	item: VfxItem;
}

const TargetSwirl: React.FC<Props> = ({ item }) => {
	return (
		<Container
			$x={item.x}
			$y={item.y}
		>
			<Sprite
				imagePath={assetUrl('/vfx/effects/targetSwirl.png')}
				width={178}
				height={100}
				frameCount={39}
				loop
			/>
		</Container>
	);
};

export default TargetSwirl;

const Container = styled.div.attrs<{ $x: number; $y: number }>(
	({ $x, $y }) => ({
		style: {
			left: $x - 85,
			top: $y - 50,
			x: '-50%',
			y: '-50%',
		},
	}),
)<{ $x: number; $y: number }>`
	position: absolute;
	pointer-events: none;
	mix-blend-mode: screen;
	filter: brightness(0.7) contrast(1.5);
`;

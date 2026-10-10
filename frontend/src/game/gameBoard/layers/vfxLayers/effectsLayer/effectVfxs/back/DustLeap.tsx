import styled from 'styled-components';
import Sprite from '../../../../../../../utils/sprite/Sprite';
import type { VfxItem } from '../../../../../../../constants/animationStates/vfxStates';

interface Props {
	item: VfxItem;
}

const DustLeap: React.FC<Props> = ({ item }) => {
	return (
		<Container
			$x={item.x}
			$y={item.y}
		>
			<Sprite
				imagePath={'/vfx/effects/dustLeap.png'}
				width={480}
				height={217}
				frameCount={35}
				fps={12}
			/>
		</Container>
	);
};

export default DustLeap;

const Container = styled.div.attrs<{ $x: number; $y: number }>(
	({ $x, $y }) => ({
		style: {
			left: $x - 30,
			top: $y - 10,
			transform: 'translate(-50%, -50%) scale(0.2) scaleX(-1)',
		},
	}),
)<{ $x: number; $y: number }>`
	position: absolute;
	pointer-events: none;
	mix-blend-mode: screen;
	filter: contrast(1.5);
`;

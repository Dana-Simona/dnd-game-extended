import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { VfxItem } from '../../../../../../../constants/animationStates/vfxStates';
import Sprite from '../../../../../../../utils/sprite/Sprite';
import { BOSS_SMOKE_SPRITE } from './bossSmokeConfig';

interface Props {
	item: VfxItem;
}

const BossSmoke: React.FC<Props> = ({ item }) => {
	return (
		<VfxContainer
			$x={item.x}
			$y={item.y}
			initial={{ scale: 0.6, opacity: 0 }}
			animate={{ scale: 1.4, opacity: [0, 1, 1, 0] }}
			transition={{
				duration: BOSS_SMOKE_SPRITE.frameCount / BOSS_SMOKE_SPRITE.fps,
				ease: 'easeOut',
				opacity: { times: [0, 0.1, 0.75, 1] },
			}}
		>
			<Sprite
				imagePath={BOSS_SMOKE_SPRITE.imagePath}
				width={BOSS_SMOKE_SPRITE.width}
				height={BOSS_SMOKE_SPRITE.height}
				frameCount={BOSS_SMOKE_SPRITE.frameCount}
				fps={BOSS_SMOKE_SPRITE.fps}
			/>
		</VfxContainer>
	);
};

export default BossSmoke;

const VfxContainer = styled(motion.div).attrs<{ $x: number; $y: number }>(
	({ $x, $y }) => ({
		style: {
			left: $x,
			top: $y - 16,
			x: '-50%',
			y: '-50%',
		},
	}),
)<{ $x: number; $y: number }>`
	position: absolute;
	pointer-events: none;
	z-index: 10;
`;

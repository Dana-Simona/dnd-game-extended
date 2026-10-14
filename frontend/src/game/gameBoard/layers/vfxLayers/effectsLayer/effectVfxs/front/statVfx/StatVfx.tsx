import React from 'react';

import { StatNumber } from './StatVfxStyles';
import type { VfxItem } from '../../../../../../../../constants/animationStates/vfxStates';

interface StatVfxProps {
	item: VfxItem;
}

export const StatVfx: React.FC<StatVfxProps> = ({ item }) => {
	const isDamage = item.type === 'Damage';
	const prefix = isDamage ? '-' : '+';
	const displayVal =
		item.amount !== undefined ? `${prefix}${item.amount}` : item.type;

	return (
		<StatNumber
			$subType={item.type}
			style={{
				left: item.x,
				top: item.y,
			}}
			initial={{
				x: 0,
				y: 0,
				scale: 0.3,
				opacity: 0,
			}}
			animate={{
				x: 36,
				y: [0, -28, 22],
				scale: [0.3, 1.25, 0.85],
				opacity: [0, 1, 1, 0],
			}}
			transition={{
				x: {
					duration: 0.9,
					ease: [0.16, 1, 0.3, 1],
				},
				y: {
					duration: 0.9,
					times: [0, 0.35, 1],
					ease: ['easeOut', 'easeIn'],
				},
				scale: {
					duration: 0.9,
					times: [0, 0.2, 1],
					ease: [[0.34, 1.56, 0.64, 1], 'easeOut'],
				},
				opacity: {
					duration: 0.9,
					times: [0, 0.1, 0.75, 1],
					ease: 'linear',
				},
			}}
		>
			{displayVal}
		</StatNumber>
	);
};

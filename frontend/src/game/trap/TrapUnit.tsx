import React from 'react';
import { motion, type TargetAndTransition } from 'framer-motion';
import type { Trap as TrapType } from '../../constants/interfaces/monster';

import { assetUrl } from '../../utils/assetUrl';

interface Props {
	trap: TrapType;
	sway?: TargetAndTransition;
}

const REST_POSE: TargetAndTransition = {
	rotate: 0,
	scaleX: 1,
	scaleY: 1,
	skewX: 0,
};

const ROOTED_ORIGIN = { originX: 0.5, originY: 1 } as const;

const toCamelCase = (name: string) => {
	return name
		.trim()
		.split(/\s+/)
		.map((word, index) => {
			if (index === 0) return word.toLowerCase();
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		})
		.join('');
};

export const TrapUnit: React.FC<Props> = ({ trap, sway }) => {
	const folderName = toCamelCase(trap.name);
	const imageSrc = assetUrl(`/sprites/enemies/${folderName}/flower.png`);

	return (
		<motion.div
			style={ROOTED_ORIGIN}
			initial={{ scaleY: 0, scaleX: 0.4, opacity: 0 }}
			animate={{ scaleY: 1, scaleX: 1, opacity: 1 }}
			exit={{ scaleY: 0, scaleX: 0.4, opacity: 0 }}
			transition={{
				type: 'spring',
				stiffness: 260,
				damping: 20,
			}}
		>
			<motion.div
				style={ROOTED_ORIGIN}
				initial={false}
				animate={sway ?? REST_POSE}
			>
				<img
					src={imageSrc}
					style={{ width: '16px', height: 'auto', display: 'block' }}
				/>
			</motion.div>
		</motion.div>
	);
};

export default TrapUnit;

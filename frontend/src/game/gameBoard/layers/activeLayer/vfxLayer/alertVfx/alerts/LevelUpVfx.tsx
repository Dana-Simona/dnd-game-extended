import React from 'react';
import { motion } from 'framer-motion';

import Sprite from '../../../../../../../utils/sprite/Sprite';

const LevelUpVfx: React.FC = () => {
	return (
		<div
			style={{
				position: 'fixed',
				inset: 0,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				pointerEvents: 'none',
				zIndex: 9999,
			}}
		>
			<motion.div
				initial={{ opacity: 0.5, scale: 1, y: -40 }}
				animate={{
					opacity: [0.5, 1, 1, 1, 0],
					scale: [1, 1.06, 1.2, 1.23, 1.25],
					y: [-40, 0, 0, -25, 450],
				}}
				transition={{
					duration: 2.0,
					times: [0, 0.2, 0.7, 0.83, 1],
					ease: ['easeOut', 'linear', 'easeInOut', 'easeIn'],
				}}
			>
				<Sprite
					imagePath='/vfx/level_up.jpg'
					width={200}
					height={200}
					frameCount={1}
					fps={1}
				/>
			</motion.div>
		</div>
	);
};

export default LevelUpVfx;

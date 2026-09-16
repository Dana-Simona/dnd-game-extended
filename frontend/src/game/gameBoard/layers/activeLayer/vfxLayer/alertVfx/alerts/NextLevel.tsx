import { motion } from 'framer-motion';
import Sprite from '../../../../../../../utils/sprite/Sprite';

const NextLevelVfx: React.FC = () => {
	return (
		<motion.div
			initial={{ opacity: 0, x: -100 }}
			animate={{
				opacity: [0, 1, 1, 0],
				x: [-100, 0, 0, 100],
			}}
			transition={{
				duration: 1.5,
				times: [0, 0.2, 0.8, 1],
				ease: 'easeInOut',
			}}
		>
			<Sprite
				imagePath='/assets/vfx/next_level.png'
				width={128}
				height={64}
				frameCount={14}
				fps={12}
			/>
		</motion.div>
	);
};

export default NextLevelVfx;

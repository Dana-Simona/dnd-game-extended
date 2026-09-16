import { motion } from 'framer-motion';
import Sprite from '../../../../../../../utils/sprite/Sprite';

const LoseVfx: React.FC = () => {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 1.4 }}
			animate={{
				opacity: [0, 1, 1, 0],
				scale: [1.4, 1, 1, 0.8],
			}}
			transition={{
				duration: 1.8,
				times: [0, 0.15, 0.85, 1],
				ease: 'easeIn',
			}}
		>
			<Sprite
				imagePath='/assets/vfx/lose.png'
				width={160}
				height={80}
				frameCount={10}
				fps={10}
			/>
		</motion.div>
	);
};


export default LoseVfx;

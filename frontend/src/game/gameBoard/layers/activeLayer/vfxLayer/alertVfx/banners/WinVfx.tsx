import { motion } from 'framer-motion';
import Sprite from '../../../../../../../utils/sprite/Sprite';

const WinVfx: React.FC = () => {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.2, y: 50 }}
			animate={{
				opacity: [0, 1, 1, 0],
				scale: [0.2, 1.2, 1, 0.9],
				y: [50, 0, 0, -20],
			}}
			transition={{
				duration: 2.0,
				times: [0, 0.2, 0.8, 1],
				ease: 'easeOut',
			}}
		>
			<Sprite
				imagePath='/assets/vfx/win.png'
				width={200}
				height={200}
				frameCount={1}
				fps={1}
			/>
		</motion.div>
	);
};

export default WinVfx;

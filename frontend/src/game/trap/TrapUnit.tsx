import React from 'react';
import { motion } from 'framer-motion';
import type { Trap as TrapType } from '../../constants/interfaces/monster';

interface Props {
	trap: TrapType;
}

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

export const TrapUnit: React.FC<Props> = ({ trap }) => {
	const folderName = toCamelCase(trap.name);
	const imageSrc = `/sprites/enemies/${folderName}/flower.png`;

	return (
		<motion.div
			initial={{ scale: 0, offset: 1 }}
			animate={{ scale: 1 }}
			exit={{ scale: 0 }}
			transition={{
				type: 'spring',
				stiffness: 260,
				damping: 20,
			}}
		>
			<img
				src={imageSrc}
				style={{ width: '16px', height: 'auto' }}
			/>
		</motion.div>
	);
};

export default TrapUnit;

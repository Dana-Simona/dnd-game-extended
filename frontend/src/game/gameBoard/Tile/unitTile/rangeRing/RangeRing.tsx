import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { AbilityRangeRing, VisionRangeRing } from './RangeRingStyles';

interface Props {
	isHovered: boolean;
	visionRange?: number;
	abilityRange?: number;
	tileSize?: number;
}

const ringAnimation = {
	initial: { opacity: 0, scale: 0.85 },
	animate: { opacity: 1, scale: 1 },
	exit: { opacity: 0, scale: 0.85 },
	transition: { duration: 0.2, ease: 'easeOut' },
} as const;

const RangeRing: React.FC<Props> = ({
	isHovered,
	visionRange,
	abilityRange,
	tileSize = 32,
}) => {
	return (
		<AnimatePresence>
			{isHovered && visionRange != null && visionRange > 0 && (
				<VisionRangeRing
					$range={visionRange}
					$tileSize={tileSize}
					{...ringAnimation}
				/>
			)}
			{isHovered && abilityRange != null && abilityRange > 0 && (
				<AbilityRangeRing
					$range={abilityRange}
					$tileSize={tileSize}
					{...ringAnimation}
				/>
			)}
		</AnimatePresence>
	);
};

export default RangeRing;

import { Swords, Shield } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import type { VfxItem } from '../../../../../../utils/animation/useGameAnimation/useVfxControl';
import {
	RollNumber,
	RollValueContainer,
	IconWrapper,
	RollValueNumber,
} from './RollVfxStyles';

interface Props {
	item: VfxItem;
}

export const RollVfx: React.FC<Props> = ({ item }) => {
	const [displayVal, setDisplayVal] = useState<string | number>(() => {
		if (item.amount === undefined) return '🎲';
		return Math.floor(Math.random() * 20) + 1;
	});
	const [isFinal, setIsFinal] = useState<boolean>(item.amount === undefined);

	const isAttack = item.type === 'RollAttack';
	const Icon = isAttack ? Swords : Shield;

	useEffect(() => {
		if (item.amount === undefined) return;

		const rollDuration = 450;
		const tickRate = 45;
		const endTime = Date.now() + rollDuration;

		const interval = setInterval(() => {
			if (Date.now() >= endTime) {
				setDisplayVal(item.amount!);
				setIsFinal(true);
				clearInterval(interval);
			} else {
				setDisplayVal(Math.floor(Math.random() * 20) + 1);
			}
		}, tickRate);

		return () => clearInterval(interval);
	}, [item.amount]);

	return (
		<RollNumber
			$subType={item.type}
			$x={item.x}
			$y={item.y}
			initial={{ opacity: 0, y: 12, scale: 0.3 }}
			animate={{
				opacity: [0.5, 1, 1, 1, 0],
				y: [0, -45, -30, -30, -46],
				scale: [0.3, 1.25, 1, 1, 0.85],
			}}
			transition={{
				duration: 1.8,
				times: [0, 0.12, 0.25, 0.82, 1],
				ease: 'easeInOut',
			}}
		>
			<RollValueContainer>
				<AnimatePresence mode='popLayout'>
					<RollValueNumber
						key={`${displayVal}-${isFinal}`}
						initial={
							isFinal
								? { scale: 1.8, rotateX: -90, opacity: 0 }
								: {
										y: -10,
										rotateX: -90,
										opacity: 0.2,
										scale: 0.7,
									}
						}
						animate={
							isFinal
								? { scale: 1, rotateX: 0, opacity: 1 }
								: { y: 0, rotateX: 0, opacity: 1, scale: 1 }
						}
						exit={
							isFinal
								? { opacity: 0 }
								: {
										y: 10,
										rotateX: 90,
										opacity: 0.2,
										scale: 0.7,
									}
						}
						transition={{
							duration: isFinal ? 0.25 : 0.045,
							ease: isFinal ? [0.34, 1.56, 0.64, 1] : 'easeInOut',
						}}
					>
						{displayVal}
					</RollValueNumber>
				</AnimatePresence>
				<IconWrapper>
					<Icon
						size={7}
						strokeWidth={2.5}
					/>
				</IconWrapper>
			</RollValueContainer>
		</RollNumber>
	);
};

import React, { useEffect, useMemo } from 'react';
import { useAnimation } from 'framer-motion';

import { ExpOrbContainer, ExpOrbGlow, ExpOrbCore } from './ExpVfxStyles';
import type { VfxItem } from '../../../../../../../constants/animationStates/vfxStates';

interface Props {
	item: VfxItem;
}

interface ScatterTarget {
	scatterX: number;
	dropY: number;
	arcHeight: number;
}

const calculateScatterTarget = (x: number, y: number): ScatterTarget => {
	const angle = Math.random() * Math.PI * 2;
	const radius = Math.random() * 32;
	return {
		scatterX: x + Math.cos(angle) * radius,
		dropY: y + Math.sin(angle) * radius,
		arcHeight: 20 + Math.random() * 20,
	};
};

type AnimationControls = ReturnType<typeof useAnimation>;

const animateScatterArc = async (
	controls: AnimationControls,
	origin: { x: number; y: number },
	target: ScatterTarget,
	delay: number,
) => {
	const { scatterX, dropY, arcHeight } = target;
	await controls.start({
		x: [origin.x, origin.x + (scatterX - origin.x) / 2, scatterX],
		y: [origin.y, origin.y - arcHeight, dropY],
		opacity: [0, 1, 1],
		scale: [0.2, 1.2, 1],
		transition: {
			duration: 0.5,
			delay,
			times: [0, 0.5, 1],
			ease: 'easeOut',
		},
	});
};

const animateHoverBob = async (controls: AnimationControls, dropY: number) => {
	await controls.start({
		y: [dropY, dropY - 4, dropY],
		transition: {
			duration: 0.8 + Math.random() * 0.2,
			ease: 'easeInOut',
		},
	});
};

const animateFlyToBottomRight = async (
	controls: AnimationControls,
	startX: number,
	startY: number,
) => {
	const targetX = window.outerWidth;
	const targetY = window.innerHeight - 60;

	const anticipateX = startX - 12;
	const anticipateY = startY - 40;

	await controls.start({
		x: [startX, anticipateX, targetX],
		y: [startY, anticipateY, targetY],
		scale: [1, 1.25, 0.2],
		opacity: [1, 1, 0],
		transition: {
			duration: 0.5 + Math.random() * 0.2,
			times: [0, 0.25, 1],
			ease: ['easeOut', 'easeIn'],
		},
	});
};

const SingleOrb: React.FC<{ item: VfxItem; index: number }> = ({
	item,
	index,
}) => {
	const controls = useAnimation();

	useEffect(() => {
		const sequence = async () => {
			const target = calculateScatterTarget(item.x, item.y);
			const delay = index * 0.05;

			await animateScatterArc(
				controls,
				{ x: item.x, y: item.y },
				target,
				delay,
			);
			await animateHoverBob(controls, target.dropY);
			await animateFlyToBottomRight(
				controls,
				target.scatterX,
				target.dropY,
			);
		};

		sequence();
	}, [controls, item.x, item.y, index]);

	return (
		<ExpOrbContainer
			animate={controls}
			initial={{ x: item.x, y: item.y, opacity: 0, scale: 0 }}
		>
			<ExpOrbGlow />
			<ExpOrbCore />
		</ExpOrbContainer>
	);
};

export const ExpVfx: React.FC<Props> = ({ item }) => {
	const orbCount = useMemo(() => {
		const expAmount = item.amount || 1;
		return Math.max(1, Math.min(15, Math.ceil(expAmount / 10)));
	}, [item.amount]);

	return (
		<>
			{Array.from({ length: orbCount }).map((_, index) => (
				<SingleOrb
					key={`${item.id}-orb-${index}`}
					item={item}
					index={index}
				/>
			))}
		</>
	);
};

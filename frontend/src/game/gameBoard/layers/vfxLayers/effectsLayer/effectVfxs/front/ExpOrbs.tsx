import React, { useEffect, useMemo } from 'react';
import { useAnimation } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

import type { VfxItem } from '../../../../../../../constants/animationStates/vfxStates';

import { assetUrl } from '../../../../../../../utils/assetUrl';

const EXP_SOUNDS = [
	assetUrl('/sfx/exp1.mp3'),
	assetUrl('/sfx/exp2.mp3'),
	assetUrl('/sfx/exp3.mp3'),
	assetUrl('/sfx/exp4.mp3'),
	assetUrl('/sfx/exp5.mp3'),
];

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
			const delay = index * 0.2;

			await animateScatterArc(
				controls,
				{ x: item.x, y: item.y },
				target,
				delay,
			);
			await animateHoverBob(controls, target.dropY);

			if (typeof Audio !== 'undefined' && EXP_SOUNDS.length > 0) {
				const randomSoundFile =
					EXP_SOUNDS[Math.floor(Math.random() * EXP_SOUNDS.length)];
				const audio = new Audio(randomSoundFile);
				audio.volume = 0.4;
				audio.play().catch((err) => {
					console.warn(
						`Failed to play exp sound: ${randomSoundFile}`,
						err,
					);
				});
			}

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

const ExpOrbs: React.FC<Props> = ({ item }) => {
	const orbCount = useMemo(() => {
		const expAmount = item.amount || 1;
		return Math.max(1, Math.min(15, Math.ceil(expAmount / 10)));
	}, [item.amount]);

	useEffect(() => {
		if (typeof Audio !== 'undefined') {
			const popAudio = new Audio(assetUrl('/sfx/expPop.mp3'));
			popAudio.volume = 0.5; 
			popAudio.play().catch((err) => {
				console.warn(
					'Failed to play group pop sound: /sfx/expPop.mp3',
					err,
				);
			});
		}
	}, []); 

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

export default ExpOrbs;

export const ExpOrbContainer = styled(motion.div)`
	position: absolute;
	width: 6px;
	height: 6px;
	pointer-events: none;
	z-index: 50;
	transform: translate(-50%, -50%);
`;

const pulse = keyframes`
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.4); opacity: 0.4; }
    100% { transform: scale(1); opacity: 0.8; }
`;

export const ExpOrbGlow = styled.div`
	position: absolute;
	inset: -4px;
	background: radial-gradient(
		circle,
		rgba(255, 215, 0, 0.9) 0%,
		rgba(255, 215, 0, 0) 70%
	);
	border-radius: 50%;
	animation: ${pulse} 1.5s infinite ease-in-out;
`;

export const ExpOrbCore = styled.div`
	position: absolute;
	inset: 0;
	background: #fffde7;
	border: 1px solid #ffeb3b;
	border-radius: 50%;
	box-shadow:
		0 0 6px 2px rgba(255, 215, 0, 0.7),
		inset 0 0 2px #ffffff;
`;

import React, { useMemo } from 'react';

export type DirectionInput = number | 'up' | 'down' | 'left' | 'right';

export interface DirectionalVfxItem extends VfxItem {
	direction?: DirectionInput;
}

interface Props {
	item: DirectionalVfxItem;
}

interface ParticleConfig {
	id: number;
	size: number;
	color: string;
	startX: number;
	startY: number;
	tx: number;
	ty: number;
	delay: number;
	duration: number;
}

const BLOOD_COLORS = ['#800000', '#990000', '#cc0000', '#e60000', '#4a0000'];

const getStartPosition = (baseAngle: number) => ({
	startX: Math.cos(baseAngle) * 30,
	startY: Math.sin(baseAngle) * 30,
});

const getRandomColor = () =>
	BLOOD_COLORS[Math.floor(Math.random() * BLOOD_COLORS.length)];

const getParticleAngle = (
	i: number,
	count: number,
	baseAngle: number,
	isDirectional: boolean,
	spreadAngle: number,
) =>
	isDirectional
		? baseAngle + (Math.random() - 0.5) * spreadAngle
		: (i / count) * spreadAngle + (Math.random() - 0.5) * 0.2;

const getParticleTarget = (angle: number) => {
	const distance = 15 + Math.random() * 60;
	return {
		tx: Math.cos(angle) * distance,
		ty: Math.sin(angle) * distance - (8 + Math.random() * 16),
	};
};

const createParticle = (
	i: number,
	count: number,
	baseAngle: number,
	isDirectional: boolean,
	spreadAngle: number,
	startPos: { startX: number; startY: number },
): ParticleConfig => {
	const angle = getParticleAngle(
		i,
		count,
		baseAngle,
		isDirectional,
		spreadAngle,
	);
	const { tx, ty } = getParticleTarget(angle);
	return {
		id: i,
		size: 2,
		color: getRandomColor(),
		...startPos,
		tx,
		ty,
		delay: Math.random() * 30,
		duration: 0.7 + Math.random() * 0.5,
	};
};

const generateParticles = (
	count: number,
	baseAngle: number,
	isDirectional: boolean,
): ParticleConfig[] => {
	const spreadAngle = isDirectional ? Math.PI / 4 : Math.PI * 2;
	const startPos = getStartPosition(baseAngle);
	return Array.from({ length: count }, (_, i) =>
		createParticle(
			i,
			count,
			baseAngle,
			isDirectional,
			spreadAngle,
			startPos,
		),
	);
};

const resolveDirectionAngle = (
	item: DirectionalVfxItem,
): { baseAngle: number; isDirectional: boolean } => {
	if (item.direction !== undefined) {
		if (typeof item.direction === 'number') {
			const rad =
				Math.abs(item.direction) > Math.PI * 2
					? (item.direction * Math.PI) / 180
					: item.direction;
			return { baseAngle: rad, isDirectional: true };
		}

		const cardinalAngles: Record<string, number> = {
			right: 0,
			down: Math.PI / 2,
			left: Math.PI,
			up: -Math.PI / 2,
		};

		const angle = cardinalAngles[item.direction.toLowerCase()];
		if (angle !== undefined) {
			return { baseAngle: angle, isDirectional: true };
		}
	}

	if (item.sourceX !== undefined && item.sourceY !== undefined) {
		const dx = item.x - item.sourceX;
		const dy = item.y - item.sourceY;
		if (Math.abs(dx) > 0.001 || Math.abs(dy) > 0.001) {
			return { baseAngle: Math.atan2(dy, dx), isDirectional: true };
		}
	}

	return { baseAngle: 0, isDirectional: false };
};

const ParticlesVfx: React.FC<Props> = ({ item }) => {
	const { baseAngle, isDirectional } = useMemo(
		() => resolveDirectionAngle(item),
		[item.direction, item.x, item.y, item.sourceX, item.sourceY],
	);

	const particles = useMemo(
		() => generateParticles(32, baseAngle, isDirectional),
		[baseAngle, isDirectional],
	);

	return (
		<Container
			$x={item.x}
			$y={item.y}
		>
			{particles.map((p) => (
				<ParticleShape
					key={p.id}
					$size={p.size}
					$color={p.color}
					initial={{
						x: p.startX,
						y: p.startY,
						opacity: 1,
					}}
					animate={{
						x: p.startX + p.tx,
						y: p.startY + p.ty,
						opacity: 1,
					}}
					transition={{
						duration: p.duration,
						ease: [0.1, 0.85, 0.25, 1],
						delay: p.delay / 1000,
					}}
				/>
			))}
		</Container>
	);
};

export default ParticlesVfx;

import styled from 'styled-components';
import { motion } from 'framer-motion';
import type { VfxItem } from '../../../../../../../constants/animationStates/vfxStates';

export const Container = styled.div<{ $x: number; $y: number }>`
	position: absolute;
	left: ${(props) => props.$x}px;
	top: ${(props) => props.$y}px;
	pointer-events: none;
	z-index: 100;
`;

export const ParticleShape = styled(motion.div)<{
	$size: number;
	$color: string;
}>`
	position: absolute;
	width: ${(props) => props.$size}px;
	height: ${(props) => props.$size}px;
	background-color: ${(props) => props.$color};
	border-radius: 0;
	image-rendering: pixelated;
`;

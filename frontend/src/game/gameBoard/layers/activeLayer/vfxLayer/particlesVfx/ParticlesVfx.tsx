import React, { useMemo } from 'react';
import {
	VfxTypes,
	type VfxItem,
} from '../../../../../../utils/animation/useGameAnimation/vfxControl/vfxTypes';
import { Container, ParticleShape } from './ParticlesStyles';

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

	const particles = useMemo(() => {
		const count = 32;
		const result: ParticleConfig[] = [];
		const spreadAngle = isDirectional ? Math.PI / 4 : Math.PI * 2;

		const startX = -Math.cos(baseAngle) * -30;
		const startY = -Math.sin(baseAngle) * -30;

		for (let i = 0; i < count; i++) {
			const angle = isDirectional
				? baseAngle + (Math.random() - 0.5) * spreadAngle
				: (i / count) * spreadAngle + (Math.random() - 0.5) * 0.2;

			const distance = 15 + Math.random() * 60;
			const tx = Math.cos(angle) * distance;
			const ty = Math.sin(angle) * distance - (8 + Math.random() * 16); 

			result.push({
				id: i,
				size: 2,
				color: BLOOD_COLORS[
					Math.floor(Math.random() * BLOOD_COLORS.length)
				],
				startX,
				startY,
				tx,
				ty,
				delay: Math.random() * 30,
				duration: 0.7 + Math.random() * 0.5,
			});
		}

		return result;
	}, [baseAngle, isDirectional]);

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

import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
	AmbienceRoot,
	PetalDrop,
	PetalShape,
	PetalSway,
	RaysFromLeft,
	RaysFromRight,
	SunGlow,
} from './AmbienceLayerStyles';

interface Props {
	dimmed?: boolean;
}

const PETAL_COLORS: [string, string][] = [
	['#fff0f6', '#daa87a'],
	['#ffe3ee', '#dfc29a'],
	['#ffd6e6', '#c9d697'],
	['#ffeaf2', '#d6ba86'],
	['#ffdce9', '#ffa8c9'],
];

const MIN_PETALS = 28;
const MAX_PETALS = 110;
const MAP_PX_PER_PETAL = 11000;
const FALL_SPEED_PX_PER_SEC = 20;
const FALL_MARGIN_PX = 60;

interface PetalSeed {
	x: number;
	width: number;
	height: number;
	speedMul: number;
	phase: number;
	drift: number;
	swayAmp: number;
	swayDur: number;
	swayPhase: number;
	flutterDur: number;
	flutterPhase: number;
	rot: number;
	colors: [string, string];
}

const rand = (min: number, max: number) => min + Math.random() * (max - min);

const makePetal = (): PetalSeed => {
	const width = rand(1, 6);
	return {
		x: Math.random() * 100,
		width,
		height: width * rand(0.65, 0.85),
		speedMul: rand(0.7, 1.3),
		phase: Math.random(),
		drift: rand(-20, 70),
		swayAmp: rand(10, 30),
		swayDur: rand(4, 8),
		swayPhase: Math.random(),
		flutterDur: rand(2.5, 5),
		flutterPhase: Math.random(),
		rot: rand(0, 360),
		colors: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
	};
};

const clamp = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, value));

export const AmbienceLayer: React.FC<Props> = ({ dimmed = false }) => {
	const rootRef = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });

	const seeds = useMemo(
		() => Array.from({ length: MAX_PETALS }, makePetal),
		[],
	);

	useEffect(() => {
		const el = rootRef.current;
		if (!el) return;

		const update = () =>
			setSize((prev) =>
				prev.width === el.clientWidth && prev.height === el.clientHeight
					? prev
					: { width: el.clientWidth, height: el.clientHeight },
			);

		update();
		const observer = new ResizeObserver(update);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const petalCount =
		size.width > 0 && size.height > 0
			? clamp(
					Math.round((size.width * size.height) / MAP_PX_PER_PETAL),
					MIN_PETALS,
					MAX_PETALS,
				)
			: 0;

	const fallDistance = size.height + FALL_MARGIN_PX;

	return (
		<AmbienceRoot ref={rootRef} $dimmed={dimmed} aria-hidden='true'>
			<SunGlow />
			{/* <RaysFromLeft $duration={11} $delay={0} />
			<RaysFromRight $duration={17} $delay={-6} /> */}

			{seeds.slice(0, petalCount).map((p, i) => {
				const duration = fallDistance / (FALL_SPEED_PX_PER_SEC * p.speedMul);
				return (
					<PetalDrop
						key={i}
						style={
							{
								left: `${p.x}%`,
								animationDuration: `${duration}s`,
								animationDelay: `${-p.phase * duration}s`,
								'--fall': `${fallDistance}px`,
								'--drift': `${p.drift}px`,
							} as React.CSSProperties
						}
					>
						<PetalSway
							style={
								{
									animationDuration: `${p.swayDur}s`,
									animationDelay: `${-p.swayPhase * p.swayDur}s`,
									'--amp': `${p.swayAmp}px`,
								} as React.CSSProperties
							}
						>
							<PetalShape
								style={
									{
										width: p.width,
										height: p.height,
										background: `linear-gradient(135deg, ${p.colors[0]} 0%, ${p.colors[1]} 100%)`,
										animationDuration: `${p.flutterDur}s`,
										animationDelay: `${-p.flutterPhase * p.flutterDur}s`,
										'--rot': `${p.rot}deg`,
									} as React.CSSProperties
								}
							/>
						</PetalSway>
					</PetalDrop>
				);
			})}
		</AmbienceRoot>
	);
};

export default AmbienceLayer;

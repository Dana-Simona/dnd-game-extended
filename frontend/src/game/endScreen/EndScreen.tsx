import React, { useMemo } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';

import Button from '../../utils/button/Button';
import {
	ButtonWrap,
	Divider,
	EdgeGlow,
	Emblem,
	Eyebrow,
	Halo,
	Overlay,
	Panel,
	Particle,
	ParticleField,
	StatChip,
	StatsRow,
	Sunburst,
	Tagline,
	Title,
	type EndTone,
} from './EndScreenStyles';

export type GameOutcome = EndTone;

interface Props {
	outcome: GameOutcome | null;
	heroName?: string;
	heroClass?: string;
	heroLevel?: number;
	dungeonLevel?: number;
	onReturn: () => void;
}

const COPY = {
	win: {
		eyebrow: 'The dungeon falls silent',
		title: 'Victory',
		tagline:
			'Every foe lies vanquished and the way home lies open. Your legend will be sung for ages.',
		dungeonLabel: 'Floors cleared',
	},
	lose: {
		eyebrow: 'Your journey ends here',
		title: 'Defeat',
		tagline:
			'Darkness claims another hero. Rise again, choose your champion, and try once more.',
		dungeonLabel: 'Fell on floor',
	},
} as const;

const PARTICLE_COUNT = 34;

interface ParticleSeed {
	left: number;
	size: number;
	duration: number;
	delay: number;
	drift: number;
	spin: number;
}

const makeParticles = (): ParticleSeed[] =>
	Array.from({ length: PARTICLE_COUNT }, () => ({
		left: Math.random() * 100,
		size: 3 + Math.random() * 6,
		duration: 9 + Math.random() * 10,
		delay: -Math.random() * 18,
		drift: (Math.random() - 0.5) * 140,
		spin: (Math.random() - 0.5) * 540,
	}));

const CrownIcon: React.FC = () => (
	<svg viewBox='0 0 64 64' fill='none' aria-hidden='true'>
		<path
			d='M6 44 L10 18 L23 31 L32 12 L41 31 L54 18 L58 44 Z'
			fill='currentColor'
			fillOpacity='0.18'
			stroke='currentColor'
			strokeWidth='3'
			strokeLinejoin='round'
		/>
		<rect
			x='8'
			y='47'
			width='48'
			height='7'
			rx='2'
			fill='currentColor'
		/>
		<circle cx='10' cy='16' r='3' fill='currentColor' />
		<circle cx='32' cy='9' r='3.5' fill='currentColor' />
		<circle cx='54' cy='16' r='3' fill='currentColor' />
	</svg>
);

const BrokenSwordIcon: React.FC = () => (
	<svg viewBox='0 0 64 64' fill='none' aria-hidden='true'>
		<path
			d='M30 6 L34 6 L35 24 L29.5 29 Z'
			fill='currentColor'
			fillOpacity='0.25'
			stroke='currentColor'
			strokeWidth='2.5'
			strokeLinejoin='round'
		/>
		<path
			d='M29 33 L36 28 L35 41 L29 41 Z'
			fill='currentColor'
			fillOpacity='0.25'
			stroke='currentColor'
			strokeWidth='2.5'
			strokeLinejoin='round'
		/>
		<rect
			x='17'
			y='41'
			width='30'
			height='5'
			rx='2'
			fill='currentColor'
		/>
		<rect x='29.5' y='46' width='5' height='11' fill='currentColor' />
		<circle cx='32' cy='60' r='3' fill='currentColor' />
	</svg>
);

const titleVariants: Record<GameOutcome, Variants> = {
	win: {
		hidden: { opacity: 0, y: 30, filter: 'blur(12px)' },
		show: (i: number) => ({
			opacity: 1,
			y: 0,
			filter: 'blur(0px)',
			transition: { delay: 1.1 + i * 0.09, duration: 0.8, ease: 'easeOut' },
		}),
	},
	lose: {
		hidden: { opacity: 0, y: -40, filter: 'blur(12px)' },
		show: (i: number) => ({
			opacity: 1,
			y: 0,
			filter: 'blur(0px)',
			transition: { delay: 1.1 + i * 0.11, duration: 0.9, ease: 'easeIn' },
		}),
	},
};

const fadeUp = (delay: number) => ({
	initial: { opacity: 0, y: 14 },
	animate: { opacity: 1, y: 0 },
	transition: { delay, duration: 0.7, ease: 'easeOut' as const },
});

export const EndScreen: React.FC<Props> = ({
	outcome,
	heroName,
	heroClass,
	heroLevel,
	dungeonLevel,
	onReturn,
}) => {
	const particles = useMemo(makeParticles, [outcome]);

	return (
		<AnimatePresence>
			{outcome && (
				<Overlay
					key={outcome}
					$tone={outcome}
					role='dialog'
					aria-modal='true'
					aria-labelledby='end-screen-title'
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 1.4, ease: 'easeInOut' }}
				>
					{outcome === 'win' && <Sunburst />}
					<Halo $tone={outcome} />
					<EdgeGlow $tone={outcome} />

					<ParticleField>
						{particles.map((p, i) => (
							<Particle
								key={i}
								$tone={outcome}
								style={
									{
										left: `${p.left}%`,
										width: p.size,
										height: p.size,
										animationDuration: `${p.duration}s`,
										animationDelay: `${p.delay}s`,
										'--drift': `${p.drift}px`,
										'--spin': `${p.spin}deg`,
									} as React.CSSProperties
								}
							/>
						))}
					</ParticleField>

					<Panel
						$tone={outcome}
						initial={{ opacity: 0, y: 36, scale: 0.94 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						transition={{ delay: 0.6, duration: 0.9, ease: 'easeOut' }}
					>
						<Emblem
							$tone={outcome}
							initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
							animate={{ opacity: 1, scale: 1, rotate: 0 }}
							transition={{
								delay: 0.8,
								duration: 0.9,
								type: 'spring',
								bounce: 0.35,
							}}
						>
							{outcome === 'win' ? (
								<CrownIcon />
							) : (
								<BrokenSwordIcon />
							)}
						</Emblem>

						<Eyebrow $tone={outcome} {...fadeUp(1.0)}>
							{COPY[outcome].eyebrow}
						</Eyebrow>

						<Title
							id='end-screen-title'
							$tone={outcome}
							aria-label={COPY[outcome].title}
						>
							{COPY[outcome].title.split('').map((char, i) => (
								<motion.span
									key={`${outcome}-${i}`}
									aria-hidden='true'
									custom={i}
									variants={titleVariants[outcome]}
									initial='hidden'
									animate='show'
								>
									{char}
								</motion.span>
							))}
						</Title>

						<Divider $tone={outcome} {...fadeUp(1.9)}>
							<i />
						</Divider>

						<Tagline {...fadeUp(2.1)}>{COPY[outcome].tagline}</Tagline>

						<StatsRow {...fadeUp(2.3)}>
							{heroName && (
								<StatChip $tone={outcome}>
									<small>Hero</small>
									<strong>{heroName}</strong>
								</StatChip>
							)}
							{heroClass && (
								<StatChip $tone={outcome}>
									<small>Class</small>
									<strong>{heroClass}</strong>
								</StatChip>
							)}
							{heroLevel !== undefined && (
								<StatChip $tone={outcome}>
									<small>Level</small>
									<strong>{heroLevel}</strong>
								</StatChip>
							)}
							{dungeonLevel !== undefined && (
								<StatChip $tone={outcome}>
									<small>{COPY[outcome].dungeonLabel}</small>
									<strong>
										{outcome === 'win'
											? dungeonLevel
											: `#${dungeonLevel}`}
									</strong>
								</StatChip>
							)}
						</StatsRow>

						<ButtonWrap $tone={outcome} {...fadeUp(2.6)}>
							<Button autoFocus onClick={onReturn}>
								Return to Character Selection
							</Button>
						</ButtonWrap>
					</Panel>
				</Overlay>
			)}
		</AnimatePresence>
	);
};

export default EndScreen;

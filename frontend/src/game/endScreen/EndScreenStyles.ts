import { motion } from 'framer-motion';
import styled, { css, keyframes } from 'styled-components';

export type EndTone = 'win' | 'lose';

const PALETTE = {
	win: {
		accent: '#ffd166',
		accentSoft: 'rgba(255, 209, 102, 0.35)',
		accentGlow: 'rgba(255, 209, 102, 0.55)',
		secondary: '#00ffcc',
		text: '#fff4d6',
		backdrop: `radial-gradient(ellipse at 50% 38%, rgba(255, 209, 102, 0.22) 0%, rgba(10, 28, 24, 0.92) 55%, rgba(0, 0, 0, 0.98) 100%)`,
	},
	lose: {
		accent: '#ff4d5e',
		accentSoft: 'rgba(255, 77, 94, 0.3)',
		accentGlow: 'rgba(255, 40, 60, 0.55)',
		secondary: '#9aa0a6',
		text: '#ffd9dc',
		backdrop: `radial-gradient(ellipse at 50% 42%, rgba(150, 12, 24, 0.28) 0%, rgba(18, 3, 6, 0.94) 55%, rgba(0, 0, 0, 0.99) 100%)`,
	},
} as const;

interface ToneProps {
	$tone: EndTone;
}

const spin = keyframes`
	from { transform: translate(-50%, -50%) rotate(0deg); }
	to { transform: translate(-50%, -50%) rotate(360deg); }
`;

const breathe = keyframes`
	0%, 100% { opacity: 0.55; transform: translate(-50%, -50%) scale(1); }
	50% { opacity: 1; transform: translate(-50%, -50%) scale(1.06); }
`;

const rise = keyframes`
	0% { transform: translate3d(0, 0, 0) scale(0.6); opacity: 0; }
	12% { opacity: 1; }
	85% { opacity: 0.9; }
	100% { transform: translate3d(var(--drift), -105vh, 0) scale(1); opacity: 0; }
`;

const fall = keyframes`
	0% { transform: translate3d(0, 0, 0) rotate(0deg); opacity: 0; }
	12% { opacity: 0.9; }
	85% { opacity: 0.6; }
	100% { transform: translate3d(var(--drift), 108vh, 0) rotate(var(--spin)); opacity: 0; }
`;

const heartbeat = keyframes`
	0%, 100% { opacity: 0.75; }
	14% { opacity: 1; }
	28% { opacity: 0.8; }
	42% { opacity: 1; }
	70% { opacity: 0.75; }
`;

const shine = keyframes`
	0% { transform: translateX(-120%) skewX(-20deg); }
	60%, 100% { transform: translateX(260%) skewX(-20deg); }
`;

export const Overlay = styled(motion.div)<ToneProps>`
	position: fixed;
	inset: 0;
	z-index: 10000;
	display: flex;
	align-items: center;
	justify-content: center;
	overflow: hidden;
	pointer-events: auto;
	font-family: monospace;
	color: ${({ $tone }) => PALETTE[$tone].text};
	background: ${({ $tone }) => PALETTE[$tone].backdrop};
	backdrop-filter: blur(4px) saturate(0.7);
	-webkit-backdrop-filter: blur(4px) saturate(0.7);
`;

export const EdgeGlow = styled.div<ToneProps>`
	position: absolute;
	inset: 0;
	pointer-events: none;
	box-shadow: inset 0 0 18vmin 2vmin ${({ $tone }) => PALETTE[$tone].accentGlow};
	animation: ${heartbeat} ${({ $tone }) => ($tone === 'lose' ? '3.2s' : '6s')}
		ease-in-out infinite;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
	}
`;

export const Sunburst = styled.div`
	position: absolute;
	top: 42%;
	left: 50%;
	width: 190vmax;
	height: 190vmax;
	pointer-events: none;
	background: repeating-conic-gradient(
		from 0deg,
		rgba(255, 214, 102, 0.2) 0deg 5deg,
		transparent 5deg 15deg
	);
	-webkit-mask-image: radial-gradient(circle, #000 0%, transparent 38%);
	mask-image: radial-gradient(circle, #000 0%, transparent 38%);
	animation: ${spin} 140s linear infinite;
	transform: translate(-50%, -50%);

	@media (prefers-reduced-motion: reduce) {
		animation: none;
	}
`;

export const Halo = styled.div<ToneProps>`
	position: absolute;
	top: 42%;
	left: 50%;
	width: min(90vmin, 780px);
	height: min(90vmin, 780px);
	pointer-events: none;
	border-radius: 50%;
	background: radial-gradient(
		circle,
		${({ $tone }) => PALETTE[$tone].accentSoft} 0%,
		transparent 65%
	);
	transform: translate(-50%, -50%);
	animation: ${breathe} 7s ease-in-out infinite;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
	}
`;

export const ParticleField = styled.div`
	position: absolute;
	inset: 0;
	pointer-events: none;
	overflow: hidden;

	@media (prefers-reduced-motion: reduce) {
		display: none;
	}
`;

export const Particle = styled.span<ToneProps>`
	position: absolute;
	border-radius: 50%;
	will-change: transform, opacity;
	opacity: 0;

	${({ $tone }) =>
		$tone === 'win'
			? css`
					bottom: -4vh;
					background: radial-gradient(
						circle,
						#fff6d6 0%,
						#ffd166 45%,
						transparent 72%
					);
					box-shadow: 0 0 10px rgba(255, 209, 102, 0.8);
					animation-name: ${rise};
					animation-timing-function: linear;
				`
			: css`
					top: -4vh;
					background: radial-gradient(
						circle,
						#ff8a5c 0%,
						#a5121f 45%,
						transparent 75%
					);
					box-shadow: 0 0 6px rgba(255, 70, 50, 0.5);
					animation-name: ${fall};
					animation-timing-function: linear;
				`}
	animation-iteration-count: infinite;
`;

export const Panel = styled(motion.div)<ToneProps>`
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 18px;
	width: min(92vw, 560px);
	padding: 44px 40px 36px;
	box-sizing: border-box;
	text-align: center;
	background: linear-gradient(
		180deg,
		rgba(0, 0, 0, 0.55) 0%,
		rgba(0, 0, 0, 0.72) 100%
	);
	border: 1px solid ${({ $tone }) => PALETTE[$tone].accent}66;
	border-radius: 6px;
	box-shadow:
		0 0 0 1px rgba(0, 0, 0, 0.8),
		0 0 40px ${({ $tone }) => PALETTE[$tone].accentSoft},
		inset 0 0 30px rgba(0, 0, 0, 0.6);

	&::before,
	&::after {
		content: '';
		position: absolute;
		width: 22px;
		height: 22px;
		border: 2px solid ${({ $tone }) => PALETTE[$tone].accent};
		pointer-events: none;
	}

	&::before {
		top: -6px;
		left: -6px;
		border-right: none;
		border-bottom: none;
	}

	&::after {
		bottom: -6px;
		right: -6px;
		border-left: none;
		border-top: none;
	}
`;

export const Emblem = styled(motion.div)<ToneProps>`
	width: 84px;
	height: 84px;
	color: ${({ $tone }) => PALETTE[$tone].accent};
	filter: drop-shadow(0 0 12px ${({ $tone }) => PALETTE[$tone].accentGlow});

	svg {
		width: 100%;
		height: 100%;
		display: block;
	}
`;

export const Eyebrow = styled(motion.span)<ToneProps>`
	font-size: 0.8rem;
	letter-spacing: 6px;
	text-transform: uppercase;
	color: ${({ $tone }) => PALETTE[$tone].secondary};
	opacity: 0.9;
`;

export const Title = styled.h1<ToneProps>`
	display: flex;
	justify-content: center;
	margin: 0;
	font-family: Georgia, 'Times New Roman', serif;
	font-size: clamp(2.6rem, 9vw, 4.6rem);
	font-weight: 700;
	line-height: 1;
	letter-spacing: ${({ $tone }) => ($tone === 'win' ? '10px' : '8px')};
	text-transform: uppercase;
	color: ${({ $tone }) => PALETTE[$tone].accent};
	text-shadow:
		0 0 18px ${({ $tone }) => PALETTE[$tone].accentGlow},
		0 3px 0 rgba(0, 0, 0, 0.7);

	span {
		display: inline-block;
		white-space: pre;
	}
`;

export const Divider = styled(motion.div)<ToneProps>`
	display: flex;
	align-items: center;
	gap: 12px;
	width: 80%;

	&::before,
	&::after {
		content: '';
		flex: 1;
		height: 1px;
		background: linear-gradient(
			90deg,
			transparent,
			${({ $tone }) => PALETTE[$tone].accent}cc,
			transparent
		);
	}

	i {
		width: 9px;
		height: 9px;
		transform: rotate(45deg);
		background: ${({ $tone }) => PALETTE[$tone].accent};
		box-shadow: 0 0 10px ${({ $tone }) => PALETTE[$tone].accentGlow};
	}
`;

export const Tagline = styled(motion.p)`
	margin: 0;
	max-width: 400px;
	font-size: 1rem;
	line-height: 1.55;
	color: #cfd6d3;
`;

export const StatsRow = styled(motion.div)`
	display: flex;
	flex-wrap: wrap;
	justify-content: center;
	gap: 10px;
`;

export const StatChip = styled.div<ToneProps>`
	display: flex;
	flex-direction: column;
	gap: 2px;
	min-width: 88px;
	padding: 8px 14px;
	background: rgba(255, 255, 255, 0.04);
	border: 1px solid ${({ $tone }) => PALETTE[$tone].accent}44;
	border-radius: 4px;

	small {
		font-size: 0.68rem;
		letter-spacing: 2px;
		text-transform: uppercase;
		color: #8f9895;
	}

	strong {
		font-size: 1.05rem;
		color: ${({ $tone }) => PALETTE[$tone].text};
	}
`;

export const ButtonWrap = styled(motion.div)<ToneProps>`
	position: relative;
	margin-top: 8px;
	overflow: hidden;
	border-radius: 4px;

	button {
		position: relative;
		padding: 14px 28px;
		font-size: 1.05rem;
		letter-spacing: 1px;
		color: ${({ $tone }) => PALETTE[$tone].accent};
		border-color: ${({ $tone }) => PALETTE[$tone].accent};
		box-shadow: 0 0 14px ${({ $tone }) => PALETTE[$tone].accentSoft};
	}

	button:hover,
	button:focus-visible {
		color: #0b0b0b;
		background-color: ${({ $tone }) => PALETTE[$tone].accent};
		border-color: ${({ $tone }) => PALETTE[$tone].accent};
		box-shadow: 0 0 22px ${({ $tone }) => PALETTE[$tone].accentGlow};
		outline: none;
	}

	&::after {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 35%;
		pointer-events: none;
		background: linear-gradient(
			90deg,
			transparent,
			rgba(255, 255, 255, 0.28),
			transparent
		);
		animation: ${shine} 4.5s ease-in-out 1.8s infinite;
	}

	@media (prefers-reduced-motion: reduce) {
		&::after {
			animation: none;
			display: none;
		}
	}
`;

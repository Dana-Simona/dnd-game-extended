import styled, { keyframes } from 'styled-components';

const fall = keyframes`
	0% { transform: translate3d(0, -30px, 0); opacity: 0; }
	6% { opacity: 1; }
	94% { opacity: 1; }
	100% { transform: translate3d(var(--drift), var(--fall), 0); opacity: 0; }
`;

const sway = keyframes`
	from { transform: translate3d(calc(var(--amp) * -1), 0, 0); }
	to { transform: translate3d(var(--amp), 0, 0); }
`;

const flutter = keyframes`
	from { transform: rotateZ(var(--rot)) rotateX(10deg) rotateY(-30deg); }
	to { transform: rotateZ(calc(var(--rot) + 140deg)) rotateX(70deg) rotateY(40deg); }
`;

const raysBreathe = keyframes`
	0% { opacity: 0.2; }
	100% { opacity: 0.4; }
`;

const glowBreathe = keyframes`
	0% { opacity: 0.6; }
	100% { opacity: 1; }
`;

export const AmbienceRoot = styled.div<{ $dimmed: boolean }>`
	position: absolute;
	inset: 0;
	overflow: hidden;
	pointer-events: none;
	opacity: ${({ $dimmed }) => ($dimmed ? 0.2 : 1)};
	transition: opacity 0.8s ease-in-out;
`;

const raysMask = `radial-gradient(ellipse 130% 130% at var(--sun-x) 0%, #000 0%, rgba(0, 0, 0, 0.55) 55%, rgba(0, 0, 0, 0.25) 100%)`;

export const SunGlow = styled.div`
	position: absolute;
	inset: 0;
	mix-blend-mode: screen;
	background:
		radial-gradient(
			ellipse 60% 55% at 0% 0%,
			rgba(255, 232, 178, 0.3) 0%,
			transparent 70%
		),
		radial-gradient(
			ellipse 45% 45% at 100% 0%,
			rgba(255, 214, 190, 0.18) 0%,
			transparent 70%
		);
	animation: ${glowBreathe} 13s ease-in-out infinite alternate;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
	}
`;

interface RaysProps {
	$duration: number;
	$delay: number;
}

export const RaysFromLeft = styled.div<RaysProps>`
	--sun-x: 0%;
	position: absolute;
	inset: 0;
	mix-blend-mode: screen;
	background: repeating-conic-gradient(
		from 88deg at 0% 0%,
		transparent 0deg,
		rgba(255, 243, 205, 0.2) 1.1deg,
		transparent 4.5deg,
		transparent 6.6deg
	);
	-webkit-mask-image: ${raysMask};
	mask-image: ${raysMask};
	animation: ${raysBreathe} ${({ $duration }) => $duration}s ease-in-out
		${({ $delay }) => $delay}s infinite alternate;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
		opacity: 0.7;
	}
`;

export const RaysFromRight = styled(RaysFromLeft)`
	--sun-x: 100%;
	background: repeating-conic-gradient(
		from 178deg at 100% 0%,
		transparent 0deg,
		rgba(255, 228, 200, 0.16) 1.4deg,
		transparent 3deg,
		transparent 8.1deg
	);
`;

export const PetalDrop = styled.div`
	position: absolute;
	top: 0;
	will-change: transform, opacity;
	animation-name: ${fall};
	animation-timing-function: linear;
	animation-iteration-count: infinite;

	@media (prefers-reduced-motion: reduce) {
		display: none;
	}
`;

export const PetalSway = styled.div`
	animation-name: ${sway};
	animation-timing-function: ease-in-out;
	animation-iteration-count: infinite;
	animation-direction: alternate;
`;

export const PetalShape = styled.div`
	border-radius: 80% 0 80% 0;
	animation-name: ${flutter};
	animation-timing-function: ease-in-out;
	animation-iteration-count: infinite;
	animation-direction: alternate;
	box-shadow:
		inset -1px -1px 2px rgba(255, 255, 255, 0.35),
		0 0 4px rgba(183, 197, 172, 0.45);
`;

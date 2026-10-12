import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
	0%, 100% { opacity: var(--trough); }
	12% { opacity: var(--peak); }
	24% { opacity: calc(var(--trough) + (var(--peak) - var(--trough)) * 0.45); }
	38% { opacity: var(--peak); }
	65% { opacity: var(--trough); }
`;

interface WrapperProps {
	$active: boolean;
}

export const VignetteWrapper = styled.div<WrapperProps>`
	position: fixed;
	inset: 0;
	z-index: 900;
	pointer-events: none;
	opacity: ${({ $active }) => ($active ? 1 : 0)};
	transition: opacity 0.9s ease-in-out;
`;

interface PulseProps {
	$peak: number;
	$trough: number;
	$periodSec: number;
}

export const VignettePulse = styled.div<PulseProps>`
	position: absolute;
	inset: 0;
	--peak: ${({ $peak }) => $peak};
	--trough: ${({ $trough }) => $trough};
	background: radial-gradient(
		ellipse at center,
		rgba(0, 0, 0, 0) 42%,
		rgba(110, 0, 10, 0.32) 72%,
		rgba(190, 0, 20, 0.78) 100%
	);
	box-shadow: inset 0 0 14vmin 3vmin rgba(210, 0, 20, 0.6);
	animation: ${pulse} ${({ $periodSec }) => $periodSec}s ease-in-out infinite;

	@media (prefers-reduced-motion: reduce) {
		animation: none;
		opacity: var(--peak);
	}
`;

import styled, { keyframes } from 'styled-components';

const TEAL = '#00ffcc';

const float = keyframes`
	0% { transform: translateY(0) translateX(0); opacity: 0; }
	10% { opacity: var(--ember-opacity); }
	90% { opacity: var(--ember-opacity); }
	100% { transform: translateY(-110vh) translateX(var(--ember-drift)); opacity: 0; }
`;

const flicker = keyframes`
	0%, 100% { opacity: 1; }
	92% { opacity: 1; }
	93% { opacity: 0.55; }
	94% { opacity: 1; }
	96% { opacity: 0.7; }
	97% { opacity: 1; }
`;

const pulse = keyframes`
	0%, 100% { text-shadow: 0 0 10px rgba(0, 255, 204, 0.5), 0 0 30px rgba(0, 255, 204, 0.25); }
	50% { text-shadow: 0 0 16px rgba(0, 255, 204, 0.85), 0 0 48px rgba(0, 255, 204, 0.45); }
`;

const blink = keyframes`
	0%, 49% { opacity: 1; }
	50%, 100% { opacity: 0; }
`;

const fadeUp = keyframes`
	from { opacity: 0; transform: translateY(14px); }
	to { opacity: 1; transform: translateY(0); }
`;

export const Container = styled.div`
	position: relative;
	overflow: hidden;
	background-color: #121212;
	background-image:
		radial-gradient(
			ellipse at 50% 38%,
			rgba(0, 255, 204, 0.16) 0%,
			rgba(0, 255, 204, 0.05) 35%,
			rgba(18, 18, 18, 0) 70%
		),
		linear-gradient(rgba(0, 255, 204, 0.045) 1px, transparent 1px),
		linear-gradient(90deg, rgba(0, 255, 204, 0.045) 1px, transparent 1px);
	background-size:
		100% 100%,
		40px 40px,
		40px 40px;
	color: ${TEAL};
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-family: monospace;

	/* vignette */
	&::before {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			ellipse at center,
			rgba(0, 0, 0, 0) 45%,
			rgba(0, 0, 0, 0.75) 100%
		);
		z-index: 2;
	}

	/* scanlines */
	&::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: repeating-linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0) 0px,
			rgba(0, 0, 0, 0) 2px,
			rgba(0, 0, 0, 0.14) 3px,
			rgba(0, 0, 0, 0.14) 4px
		);
		z-index: 3;
	}
`;

export const Embers = styled.div`
	position: absolute;
	inset: 0;
	pointer-events: none;
	z-index: 1;
`;

export const Ember = styled.span`
	position: absolute;
	bottom: -10px;
	border-radius: 50%;
	background: ${TEAL};
	box-shadow: 0 0 8px 2px rgba(0, 255, 204, 0.6);
	opacity: 0;
	animation: ${float} linear infinite;
`;

export const Content = styled.div`
	position: relative;
	z-index: 4;
	display: flex;
	flex-direction: column;
	align-items: center;
`;

export const Crest = styled.div`
	font-size: 1.4rem;
	letter-spacing: 14px;
	color: rgba(0, 255, 204, 0.55);
	margin-bottom: 0.75rem;
	padding-left: 14px;
	animation: ${fadeUp} 0.8s ease-out both;
`;

export const Title = styled.h1`
	margin: 0;
	font-size: 4.5rem;
	font-weight: 900;
	color: ${TEAL};
	letter-spacing: 6px;
	text-transform: none;
	animation:
		${pulse} 4s ease-in-out infinite,
		${flicker} 7s linear infinite,
		${fadeUp} 0.8s ease-out both;

	@media (max-width: 600px) {
		font-size: 2.8rem;
		letter-spacing: 3px;
	}
`;

export const TitleExt = styled.span`
	color: #00a887;
`;

export const Cursor = styled.span`
	display: inline-block;
	width: 0.5em;
	height: 0.12em;
	margin-left: 6px;
	background: ${TEAL};
	box-shadow: 0 0 10px ${TEAL};
	animation: ${blink} 1s steps(1) infinite;
`;

export const Byline = styled.p`
	margin: 10px 0 0;
	font-size: 0.8rem;
	letter-spacing: 3px;
	text-transform: uppercase;
	color: #5fbfa8;
	opacity: 0.85;
	animation: ${fadeUp} 0.8s ease-out 0.15s both;
`;

export const Divider = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
	width: 320px;
	max-width: 80vw;
	margin: 2rem 0 2.2rem;
	color: ${TEAL};
	font-size: 0.7rem;
	animation: ${fadeUp} 0.8s ease-out 0.3s both;

	&::before,
	&::after {
		content: '';
		flex: 1;
		height: 1px;
		background: linear-gradient(
			90deg,
			rgba(0, 255, 204, 0),
			rgba(0, 255, 204, 0.7)
		);
	}

	&::after {
		transform: scaleX(-1);
	}
`;

export const MenuBox = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
	gap: 15px;
	width: 250px;
	padding: 28px 32px;
	background: rgba(0, 0, 0, 0.45);
	border: 1px solid rgba(0, 255, 204, 0.18);
	box-shadow:
		0 0 30px rgba(0, 255, 204, 0.08),
		inset 0 0 24px rgba(0, 0, 0, 0.6);
	animation: ${fadeUp} 0.8s ease-out 0.45s both;

	/* corner brackets */
	&::before,
	&::after {
		content: '';
		position: absolute;
		width: 18px;
		height: 18px;
		border: 2px solid ${TEAL};
		filter: drop-shadow(0 0 4px rgba(0, 255, 204, 0.8));
	}

	&::before {
		top: -2px;
		left: -2px;
		border-right: none;
		border-bottom: none;
	}

	&::after {
		bottom: -2px;
		right: -2px;
		border-left: none;
		border-top: none;
	}
`;

export const Board = styled.pre`
	background-color: #000;
	padding: 20px;
	border-radius: 8px;
	font-size: 20px;
	line-height: 1.2;
	letter-spacing: 3px;
	box-shadow: 0 0 15px rgba(0, 255, 204, 0.2);
`;

export const Controls = styled.div`
	margin-top: 15px;
	color: #aaa;
`;

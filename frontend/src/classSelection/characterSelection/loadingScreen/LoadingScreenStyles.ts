import styled, { keyframes } from 'styled-components';

const TEAL = '#00ffcc';

const spin = keyframes`
	to { transform: rotate(360deg); }
`;

const spinReverse = keyframes`
	to { transform: rotate(-360deg); }
`;

const pulse = keyframes`
	0%, 100% { transform: scale(0.85) rotate(45deg); opacity: 0.6; }
	50% { transform: scale(1.1) rotate(45deg); opacity: 1; }
`;

const sweep = keyframes`
	0% { transform: translateX(-100%); }
	100% { transform: translateX(350%); }
`;

const dots = keyframes`
	0% { content: ''; }
	25% { content: '.'; }
	50% { content: '..'; }
	75%, 100% { content: '...'; }
`;

const fadeIn = keyframes`
	from { opacity: 0; transform: translateY(10px); }
	to { opacity: 1; transform: translateY(0); }
`;

const breathe = keyframes`
	0%, 100% { opacity: 0.55; }
	50% { opacity: 1; }
`;

export const Screen = styled.div`
	position: relative;
	overflow: hidden;
	min-height: 100vh;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	font-family: monospace;
	color: ${TEAL};
	background-color: #121212;
	background-image:
		radial-gradient(
			ellipse at 50% 45%,
			rgba(0, 255, 204, 0.14) 0%,
			rgba(0, 255, 204, 0.04) 40%,
			rgba(18, 18, 18, 0) 70%
		),
		linear-gradient(rgba(0, 255, 204, 0.045) 1px, transparent 1px),
		linear-gradient(90deg, rgba(0, 255, 204, 0.045) 1px, transparent 1px);
	background-size:
		100% 100%,
		40px 40px,
		40px 40px;

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
	}

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
	}
`;

export const Content = styled.div`
	position: relative;
	z-index: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	animation: ${fadeIn} 0.6s ease-out both;
`;

export const Emblem = styled.div`
	position: relative;
	width: 130px;
	height: 130px;
	margin-bottom: 2.2rem;
`;

export const Ring = styled.div<{ $reverse?: boolean; $inset: number }>`
	position: absolute;
	inset: ${({ $inset }) => $inset}px;
	border-radius: 50%;
	border: 2px solid rgba(0, 255, 204, 0.12);
	border-top-color: ${TEAL};
	border-right-color: ${({ $reverse }) =>
		$reverse ? 'transparent' : 'rgba(0, 255, 204, 0.5)'};
	filter: drop-shadow(0 0 6px rgba(0, 255, 204, 0.7));
	animation: ${({ $reverse }) => ($reverse ? spinReverse : spin)}
		${({ $reverse }) => ($reverse ? '2.4s' : '1.4s')} linear infinite;
`;

export const Core = styled.div`
	position: absolute;
	top: 50%;
	left: 50%;
	width: 26px;
	height: 26px;
	margin: -13px 0 0 -13px;
	background: ${TEAL};
	box-shadow: 0 0 22px 4px rgba(0, 255, 204, 0.6);
	animation: ${pulse} 1.6s ease-in-out infinite;
`;

export const Heading = styled.h2`
	margin: 0;
	font-size: 1.9rem;
	font-weight: 900;
	letter-spacing: 5px;
	text-transform: uppercase;
	color: ${TEAL};
	text-shadow: 0 0 12px rgba(0, 255, 204, 0.55);

	&::after {
		content: '';
		display: inline-block;
		width: 1.4em;
		text-align: left;
		animation: ${dots} 1.6s steps(1) infinite;
	}
`;

export const Hint = styled.p`
	margin: 12px 0 0;
	font-size: 0.95rem;
	letter-spacing: 2px;
	color: #5fbfa8;
	animation: ${breathe} 2.4s ease-in-out infinite;
`;

export const Bar = styled.div`
	position: relative;
	overflow: hidden;
	width: 260px;
	max-width: 70vw;
	height: 4px;
	margin-top: 1.8rem;
	background: rgba(0, 255, 204, 0.1);
	border: 1px solid rgba(0, 255, 204, 0.25);

	&::before {
		content: '';
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		width: 30%;
		background: linear-gradient(
			90deg,
			rgba(0, 255, 204, 0),
			${TEAL},
			rgba(0, 255, 204, 0)
		);
		box-shadow: 0 0 10px ${TEAL};
		animation: ${sweep} 1.5s ease-in-out infinite;
	}
`;

export const SubHint = styled.p`
	margin: 1rem 0 0;
	font-size: 0.75rem;
	letter-spacing: 1px;
	color: rgba(95, 191, 168, 0.6);
`;

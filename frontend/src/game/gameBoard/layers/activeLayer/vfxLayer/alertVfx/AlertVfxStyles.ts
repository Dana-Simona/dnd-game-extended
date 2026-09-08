import styled, { keyframes, css } from 'styled-components';

const alertPopKeyframes = keyframes`
  0% {
    transform: translate(-50%, -120%) scale(0.6);
    opacity: 0;
  }
  18% {
    transform: translate(-50%, 0) scale(1.08);
    opacity: 1;
  }
  28% {
    transform: translate(-50%, 0) scale(1);
    opacity: 1;
  }
  80% {
    transform: translate(-50%, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -30px) scale(0.8);
    opacity: 0;
  }
`;

export const AlertBanner = styled.div<{ $subType: string }>`
	position: absolute;
	top: 18px;
	left: 50%;
	transform: translateX(-50%);
	padding: 10px 24px;
	border-radius: 8px;
	font-family: 'Press Start 2P', monospace, sans-serif;
	font-size: 16px;
	font-weight: bold;
	text-transform: uppercase;
	letter-spacing: 2px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.6);
	animation: ${alertPopKeyframes} 1.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)
		forwards;

	${({ $subType }) => {
		switch ($subType) {
			case 'Win':
				return css`
					background: linear-gradient(
						180deg,
						#ffe066 0%,
						#d4af37 100%
					);
					color: #1a1400;
					border: 2px solid #fff;
				`;
			case 'Lose':
				return css`
					background: linear-gradient(
						180deg,
						#ff4d4d 0%,
						#990000 100%
					);
					color: #ffffff;
					border: 2px solid #ff9999;
				`;
			case 'LevelUp':
				return css`
					background: linear-gradient(
						180deg,
						#33ccff 0%,
						#0066cc 100%
					);
					color: #ffffff;
					border: 2px solid #99ebff;
				`;
			case 'NextLevel':
			default:
				return css`
					background: linear-gradient(
						180deg,
						#5cdb95 0%,
						#05386b 100%
					);
					color: #edf5e1;
					border: 2px solid #8ee4af;
				`;
		}
	}}
`;

import styled, { keyframes } from 'styled-components';

const abilityPulseKeyframes = keyframes`
  0% {
    transform: translate(-50%, -50%) scale(0.2);
    opacity: 0.9;
  }
  100% {
    transform: translate(-50%, -50%) scale(2);
    opacity: 0;
  }
`;

export const AbilityCastPlaceholder = styled.div<{ $x: number; $y: number }>`
	position: absolute;
	left: ${({ $x }) => $x}px;
	top: ${({ $y }) => $y}px;
	width: 48px;
	height: 48px;
	border: 3px solid #b366ff;
	border-radius: 50%;
	box-shadow: 0 0 12px #b366ff;
	pointer-events: none;
	animation: ${abilityPulseKeyframes} 0.5s ease-out forwards;
`;

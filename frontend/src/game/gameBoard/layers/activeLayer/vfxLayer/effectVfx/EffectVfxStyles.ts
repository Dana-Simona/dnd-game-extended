import styled from 'styled-components';

export const EffectVfxContainer = styled.div<{ $x: number; $y: number }>`
	position: absolute;
	left: ${({ $x }) => $x}px;
	top: ${({ $y }) => $y}px;
	transform: translate(-50%, -50%);
	pointer-events: none;
	user-select: none;
`;

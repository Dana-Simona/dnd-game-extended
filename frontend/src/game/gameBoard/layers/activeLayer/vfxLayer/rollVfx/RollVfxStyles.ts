import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

export const RollValueContainer = styled.div`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 2px;
	perspective: 400px;
	line-height: 1;
`;

export const IconWrapper = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	line-height: 1;

	svg {
		display: block;
	}
`;

export const RollNumber = styled(motion.div).attrs<{ $x: number; $y: number }>(
	({ $x, $y }) => ({
		style: {
			left: $x,
			top: $y - 12,
		},
	}),
)<{ $subType: string; $x: number; $y: number }>`
	position: absolute;
	font-family: 'Impact', 'Arial Black', sans-serif;
	font-size: 7px;
	font-weight: 900;
	line-height: 1;
	pointer-events: none;
	user-select: none;

	${({ $subType }) => {
		switch ($subType) {
			case 'RollAttack':
				return css`
					color: #ff9933;
					filter: drop-shadow(0 0 3px #ff9933)
						drop-shadow(0 0 8px #ff3300);
				`;
			case 'RollDefense':
			default:
				return css`
					color: #3399ff;
					filter: drop-shadow(0 0 3px #3399ff)
						drop-shadow(0 0 8px #0033cc);
				`;
		}
	}}
`;

export const RollValueNumber = styled(motion.span)`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	line-height: 1;
	perspective: 400px;
	backface-visibility: hidden;
`;

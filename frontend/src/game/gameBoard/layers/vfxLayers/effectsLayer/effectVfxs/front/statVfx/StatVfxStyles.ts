import styled, { css } from 'styled-components';
import { motion } from 'framer-motion';

export const StatNumber = styled(motion.div)<{
	$subType: string;
}>`
	position: absolute;
	font-family: 'Impact', 'Arial Black', sans-serif;
	font-size: 9px;
	font-weight: 900;
	line-height: 1;
	pointer-events: none;
	user-select: none;
	display: inline-flex;
	align-items: center;
	justify-content: center;

	${({ $subType }) => {
		switch ($subType) {
			case 'Damage':
				return css`
					color: #ff3333;
					text-shadow:
						0 0 4px #000,
						2px 2px 0 #000;
				`;
			case 'Heal':
				return css`
					color: #33ff77;
					text-shadow:
						0 0 4px #000,
						2px 2px 0 #000;
				`;
			case 'Exp':
			default:
				return css`
					color: #ffd700;
					text-shadow:
						0 0 4px #000,
						2px 2px 0 #000;
				`;
		}
	}}
`;

import React from 'react';
import { ExpBarContainer, ExpBarFill } from './ExpBarStyles';

interface ExpBarProps {
	currentExp: number;
	maxExp: number;
}

export const ExpBar: React.FC<ExpBarProps> = ({ currentExp, maxExp }) => {
	const percentage = maxExp > 0 ? (currentExp / maxExp) * 100 : 0;

	return (
		<ExpBarContainer>
			<ExpBarFill $percentage={percentage} />
		</ExpBarContainer>
	);
};

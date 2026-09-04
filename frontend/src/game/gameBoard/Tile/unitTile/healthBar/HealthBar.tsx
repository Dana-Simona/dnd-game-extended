import React from 'react';
import { BarContainer, BarFill, HealthText } from './HealthBarStyles';

interface HealthBarProps {
	currentHp: number;
	maxHp: number;
	isEnemy: boolean;
}

const HealthBar: React.FC<HealthBarProps> = ({
	currentHp,
	maxHp,
	isEnemy,
}) => {
	if (!isEnemy) {
		return null;
	}

	const validMaxHp = Math.max(1, maxHp);
	const clampedHp = Math.max(0, Math.min(currentHp, validMaxHp));
	const percentage = (clampedHp / validMaxHp) * 100;

	return (
		<BarContainer>
			<BarFill
				$percentage={percentage}
			/>
			<HealthText>
				{clampedHp}/{validMaxHp}
			</HealthText>
		</BarContainer>
	);
};

export default HealthBar;
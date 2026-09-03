import React from 'react';
import { StatBox, StatBoxLabel, StatValue } from './StatItemStyles';

interface Props {
	label: string;
	value: number | string;
	color?: string;
}

export const StatItem: React.FC<Props> = ({ label, value, color }) => {
	return (
		<StatBox>
			<StatBoxLabel>{label}</StatBoxLabel>
			<StatValue $color={color}>{value}</StatValue>
		</StatBox>
	);
};

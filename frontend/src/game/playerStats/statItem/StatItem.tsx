import React, { useId } from 'react';
import {
	StatBox,
	StatBoxLabel,
	StatValue,
	StatTooltip,
	type TooltipAlign,
} from './StatItemStyles';

interface Props {
	label: string;
	value: number | string;
	color?: string;
	description?: string;
	tooltipAlign?: TooltipAlign;
}

export const StatItem: React.FC<Props> = ({
	label,
	value,
	color,
	description,
	tooltipAlign = 'center',
}) => {
	const tooltipId = useId();

	return (
		<StatBox
			$hasTooltip={!!description}
			tabIndex={description ? 0 : undefined}
			aria-describedby={description ? tooltipId : undefined}
		>
			<StatBoxLabel>{label}</StatBoxLabel>
			<StatValue $color={color}>{value}</StatValue>

			{description && (
				<StatTooltip
					id={tooltipId}
					role='tooltip'
					$color={color}
					$align={tooltipAlign}
				>
					{description}
				</StatTooltip>
			)}
		</StatBox>
	);
};

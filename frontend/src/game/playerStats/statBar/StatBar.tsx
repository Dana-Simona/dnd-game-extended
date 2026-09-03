import React from 'react';
import {
	StatSection,
	StatLabelRow,
	LabelGroup,
	CostText,
	BarBackground,
	BarFill,
	HighlightValue,
} from './StatBarStyles';

interface Props {
	label: string;
	current: number;
	max: number;
	color: string;
	cost?: number;
	costLabel?: string;
}

export const StatBar: React.FC<Props> = ({
	label,
	current,
	max,
	color,
	cost,
	costLabel = 'Cost',
}) => {
	const percent = Math.min(100, Math.max(0, (current / (max || 1)) * 100));

	return (
		<StatSection>
			<StatLabelRow>
				<LabelGroup>
					<span>{label}</span>
					{cost !== undefined && (
						<CostText>
							({costLabel}: {cost})
						</CostText>
					)}
				</LabelGroup>
				<span>
					<HighlightValue $color={color}>{current}</HighlightValue> /{' '}
					{max}
				</span>
			</StatLabelRow>
			<BarBackground>
				<BarFill
					$percent={percent}
					$color={color}
				/>
			</BarBackground>
		</StatSection>
	);
};

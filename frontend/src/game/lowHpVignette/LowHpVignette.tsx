import React from 'react';
import { VignettePulse, VignetteWrapper } from './LowHpVignetteStyles';

export const LOW_HP_THRESHOLD = 30;

interface Props {
	currentHp?: number;
	threshold?: number;
	hidden?: boolean;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const LowHpVignette: React.FC<Props> = ({
	currentHp,
	threshold = LOW_HP_THRESHOLD,
	hidden = false,
}) => {
	const isLow = currentHp !== undefined && currentHp < threshold;
	const severity = isLow ? clamp01(1 - currentHp / threshold) : 0;

	const peak = 0.55 + severity * 0.45;
	const trough = 0.25 + severity * 0.3;
	const periodSec = 2.4 - severity * 1.1;

	return (
		<VignetteWrapper
			$active={isLow && !hidden}
			aria-hidden='true'
			data-testid='low-hp-vignette'
		>
			<VignettePulse
				$peak={peak}
				$trough={trough}
				$periodSec={periodSec}
			/>
		</VignetteWrapper>
	);
};

export default LowHpVignette;

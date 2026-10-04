import React from 'react';
import type { HpState } from '../../../../../constants/animationStates/hpStates';
import {
	BarContainer,
	BarFill,
	PreviewBarFill,
	HealthText,
} from './HealthBarStyles';

interface HealthBarProps {
	currentHp?: number;
	previewHp?: number;
	maxHp?: number;
	color?: string;
	isEnemy: boolean;
	hpState?: HpState;
}

const barTransition = {
	type: 'spring' as const,
	stiffness: 250,
	damping: 25,
};

const HealthBar: React.FC<HealthBarProps> = ({
	currentHp: propCurrentHp,
	previewHp: propPreviewHp,
	maxHp: propMaxHp,
	color: propColor,
	isEnemy,
	hpState,
}) => {
	if (!isEnemy) {
		return null;
	}

	const currentHp = hpState?.currentHp ?? propCurrentHp ?? 0;
	const previewHp = hpState?.previewHp ?? propPreviewHp;
	const maxHp = hpState?.maxHp ?? propMaxHp ?? 1;
	const previewColor = hpState?.color ?? propColor;

	const validMaxHp = Math.max(1, maxHp);
	const safeCurrentHp = Math.max(0, Math.min(currentHp, validMaxHp));
	const targetPreviewHp = previewHp !== undefined ? previewHp : safeCurrentHp;
	const safePreviewHp = Math.max(0, Math.min(targetPreviewHp, safeCurrentHp));

	const mainPercentage = (safePreviewHp / validMaxHp) * 100;
	const previewPercentage = Math.max(
		0,
		((safeCurrentHp - safePreviewHp) / validMaxHp) * 100,
	);

	const hasPreview = previewPercentage > 0;

	return (
		<BarContainer>
			<BarFill
				$hasPreview={hasPreview}
				initial={false}
				animate={{ width: `${mainPercentage}%` }}
				transition={barTransition}
			/>

			<PreviewBarFill
				$color={previewColor}
				initial={false}
				animate={{
					left: `${mainPercentage}%`,
					width: `${previewPercentage}%`,
					opacity: hasPreview ? 1 : 0,
				}}
				transition={barTransition}
			/>

			<HealthText>
				{safeCurrentHp}/{validMaxHp}
			</HealthText>
		</BarContainer>
	);
};

export default HealthBar;

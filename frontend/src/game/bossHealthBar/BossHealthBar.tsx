import React from 'react';
import { AnimatePresence } from 'framer-motion';

import type { HpState } from '../../constants/animationStates/hpStates';
import {
	BossBarWrapper,
	BossName,
	BossBarContainer,
	BossBarFill,
	BossPreviewFill,
	BossHealthText,
	CastTimer,
	CastPip,
} from './BossHealthBarStyles';

interface Props {
	visible: boolean;
	name?: string;
	hpState?: HpState;
	fallbackCurrentHp?: number;
	fallbackMaxHp?: number;
	abilityFrequency?: number;
	combatTicks?: number;
}

const barTransition = {
	type: 'spring' as const,
	stiffness: 250,
	damping: 25,
};

export const BossHealthBar: React.FC<Props> = ({
	visible,
	name,
	hpState,
	fallbackCurrentHp = 0,
	fallbackMaxHp = 1,
	abilityFrequency,
	combatTicks = 0,
}) => {
	const maxHp = Math.max(1, hpState?.maxHp ?? fallbackMaxHp);
	const currentHp = Math.max(
		0,
		Math.min(hpState?.currentHp ?? fallbackCurrentHp, maxHp),
	);
	const previewHp = Math.max(
		0,
		Math.min(hpState?.previewHp ?? currentHp, currentHp),
	);

	const mainPercentage = (previewHp / maxHp) * 100;
	const previewPercentage = ((currentHp - previewHp) / maxHp) * 100;
	const hasPreview = previewPercentage > 0;

	// The boss chases for `abilityFrequency` moves, then casts on the next one,
	// so there are (frequency - ticks + 1) moves left, the last being the cast.
	const totalPips = abilityFrequency ? abilityFrequency + 1 : 0;
	const remainingPips = Math.max(
		0,
		Math.min(totalPips, totalPips - combatTicks),
	);

	return (
		<AnimatePresence>
			{visible && (
				<BossBarWrapper
					key='boss-health-bar'
					initial={{ opacity: 0, y: -30, x: '-50%', scaleX: 0.4 }}
					animate={{ opacity: 1, y: 0, x: '-50%', scaleX: 1 }}
					exit={{ opacity: 0, y: -30, x: '-50%' }}
					transition={{ type: 'spring', stiffness: 160, damping: 18 }}
				>
					<BossName>{name}</BossName>
					<BossBarContainer>
						<BossBarFill
							$hasPreview={hasPreview}
							initial={{ width: '0%' }}
							animate={{ width: `${mainPercentage}%` }}
							transition={barTransition}
						/>
						<BossPreviewFill
							$color={hpState?.color}
							initial={false}
							animate={{
								left: `${mainPercentage}%`,
								width: `${previewPercentage}%`,
								opacity: hasPreview ? 1 : 0,
							}}
							transition={barTransition}
						/>
						<BossHealthText>
							{currentHp}/{maxHp}
						</BossHealthText>
					</BossBarContainer>
					{totalPips > 0 && (
						<CastTimer>
							{Array.from({ length: totalPips }, (_, i) => (
								<CastPip
									key={i}
									$active={i < remainingPips}
									$imminent={
										remainingPips === 1 && i === 0
									}
								/>
							))}
						</CastTimer>
					)}
				</BossBarWrapper>
			)}
		</AnimatePresence>
	);
};

export default BossHealthBar;

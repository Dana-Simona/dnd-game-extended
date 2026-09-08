import React from 'react';
import type { VfxItem } from '../../../../../../utils/animation/useGameAnimation/useVfxControl';
import { AlertBanner } from './AlertVfxStyles';

interface AlertVfxProps {
	item: VfxItem;
}

export const AlertVfx: React.FC<AlertVfxProps> = ({ item }) => {
	return (
		<AlertBanner $subType={item.type}>
			{item.type === 'LevelUp' && 'LEVEL UP!'}
			{item.type === 'Win' && 'VICTORY!'}
			{item.type === 'Lose' && 'DEFEAT!'}
			{item.type === 'NextLevel' && 'NEXT LEVEL!'}
		</AlertBanner>
	);
};

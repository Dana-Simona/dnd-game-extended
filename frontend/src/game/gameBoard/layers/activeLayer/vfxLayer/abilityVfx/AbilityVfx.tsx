import React from 'react';
import type { VfxItem } from '../../../../../../utils/animation/useGameAnimation/useVfxControl';
import { AbilityCastPlaceholder } from './AbilityVfxStyles';

interface AbilityVfxProps {
	item: VfxItem;
}

export const AbilityVfx: React.FC<AbilityVfxProps> = ({ item }) => {
	return (
		<AbilityCastPlaceholder
			$x={item.x}
			$y={item.y}
		/>
	);
};

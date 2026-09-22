import React from 'react';
import { VfxTypes } from '../../../../../../constants/animationStates/vfxStates';
import type { VfxItem } from '../../../../../../constants/animationStates/vfxStates';
import { ExpVfx } from './expVfx/ExpVfx';

interface Props {
	item: VfxItem;
}

export const EffectVfx: React.FC<Props> = ({ item }) => {
	switch (item.type) {
		case VfxTypes.EFFECTS_EXP:
			return <ExpVfx item={item} />;

		case VfxTypes.EFFECTS_ABILITY_CAST:
		case VfxTypes.EFFECTS_HEAL:
		default:
			// return <AbilityVfx item={item} />;
	}
};

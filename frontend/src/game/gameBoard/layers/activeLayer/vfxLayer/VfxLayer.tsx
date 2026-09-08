import React from 'react';
import type { VfxItem } from '../../../../../utils/animation/useGameAnimation/useVfxControl';
import { VfxViewportLayer } from './vfxStyles';
import { AlertVfx } from './alertVfx/AlertVfx';
import { RollVfx } from './rollVfx/RollVfx';
import { AbilityVfx } from './abilityVfx/AbilityVfx';
import { StatVfx } from './statVfx/StatVfx';

interface VfxLayerProps {
	vfxList: VfxItem[];
}

export const VfxLayer: React.FC<VfxLayerProps> = ({ vfxList }) => {
	if (!vfxList.length) return null;

	return (
		<VfxViewportLayer>
			{vfxList.map((item) => {
				switch (item.category) {
					case 'ALERT':
						return (
							<AlertVfx
								key={item.id}
								item={item}
							/>
						);
					case 'STAT':
						return (
							<StatVfx
								key={item.id}
								item={item}
							/>
						);
					case 'ROLL':
						return (
							<RollVfx
								key={item.id}
								item={item}
							/>
						);
					case 'ABILITY':
						return (
							<AbilityVfx
								key={item.id}
								item={item}
							/>
						);
					default:
						return null;
				}
			})}
		</VfxViewportLayer>
	);
};

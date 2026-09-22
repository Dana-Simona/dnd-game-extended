import React from 'react';
import BannerVfx from './alertVfx/AlertVfx';
import { RollVfx } from './rollVfx/RollVfx';
import { StatVfx } from './statVfx/StatVfx';
import { VfxViewportLayer } from './vfxStyles';
import { EffectVfx } from './effectVfx/EffectVfx';
import ParticlesVfx from './particlesVfx/ParticlesVfx';
import {
	type VfxItem,
	VfxCategory,
} from '../../../../../constants/animationStates/vfxStates';

interface Props {
	vfxList: VfxItem[];
}

export const VfxLayer: React.FC<Props> = ({ vfxList }) => {
	if (!vfxList.length) return null;

	return (
		<VfxViewportLayer>
			{vfxList.map((item) => {
				switch (item.category) {
					case VfxCategory.BANNER:
						return (
							<BannerVfx
								key={item.id}
								item={item}
							/>
						);
					case VfxCategory.STAT:
						return (
							<StatVfx
								key={item.id}
								item={item}
							/>
						);
					case VfxCategory.ROLL:
						return (
							<RollVfx
								key={item.id}
								item={item}
							/>
						);
					case VfxCategory.EFFECTS:
						return (
							<EffectVfx
								key={item.id}
								item={item}
							/>
						);
					case VfxCategory.PARTICLES:
						return (
							<ParticlesVfx
								key={item.id}
								item={item}
							/>
						);
					case VfxCategory.PROJECTILES:
						return null;
					default:
						return null;
				}
			})}
		</VfxViewportLayer>
	);
};

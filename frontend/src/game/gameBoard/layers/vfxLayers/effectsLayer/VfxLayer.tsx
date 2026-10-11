import React from 'react';

import Ash from './effectVfxs/front/Ash';
import Bleed from './effectVfxs/back/Bleed';
import Slash from './effectVfxs/front/Slash';
import { VfxViewportLayer } from './vfxStyles';
import IceFeet from './effectVfxs/front/IceFeet';
import ExpOrbs from './effectVfxs/front/ExpOrbs';
import DustLeap from './effectVfxs/back/DustLeap';
import DustLand from './effectVfxs/back/DustLand';
import BossSpell from './effectVfxs/front/BossSpell';
import IceGather from './effectVfxs/front/IceGather';
import BloodDrip from './effectVfxs/front/BloodDrip';
import IceExplode from './effectVfxs/front/IceExplode';
import EffectHeal from './effectVfxs/front/EffectHeal';
import GroundBreak from './effectVfxs/back/GroundBreak';
import TargetSwirl from './effectVfxs/back/TargetSwirl';
import { StatVfx } from './effectVfxs/front/statVfx/StatVfx';
import { RollVfx } from './effectVfxs/front/rollVfx/RollVfx';
import ArrowProjectile from './effectVfxs/front/ArrowProjectile';
import LightningStrike from './effectVfxs/front/LightningStrike';
import KnivesProjectile from './effectVfxs/front/KnivesProjectile';
import {
	type VfxItem,
	VfxTypes,
} from '../../../../../constants/animationStates/vfxStates';

interface Props {
	vfxList: VfxItem[];
}

const VFX_COMPONENTS: Partial<
	Record<VfxTypes, React.ComponentType<{ item: VfxItem }>>
> = {
	[VfxTypes.GROUND_BREAK]: GroundBreak,
	[VfxTypes.DUST_LEAP]: DustLeap,
	[VfxTypes.DUST_LAND]: DustLand,
	[VfxTypes.TARGET_SWIRL]: TargetSwirl,
	[VfxTypes.ICE_GATHER]: IceGather,

	[VfxTypes.ICE_FEET]: IceFeet,
	[VfxTypes.STAT_DAMAGE]: StatVfx,
	[VfxTypes.STAT_HEAL]: StatVfx,
	[VfxTypes.STAT_EXP]: StatVfx,
	[VfxTypes.ROLL_ATTACK]: RollVfx,
	[VfxTypes.ROLL_DEFENSE]: RollVfx,
	[VfxTypes.BLEED]: Bleed,
	[VfxTypes.BLOOD_DRIP]: BloodDrip,
	[VfxTypes.ICE_EXPLODE]: IceExplode,
	[VfxTypes.EFFECTS_HEAL]: EffectHeal,
	[VfxTypes.LIGHTNING_STRIKE]: LightningStrike,
	[VfxTypes.SLASH]: Slash,
	[VfxTypes.KNIVES_PROJECTILE]: KnivesProjectile,
	[VfxTypes.ARROW_PROJECTILE]: ArrowProjectile,
	[VfxTypes.EXP_ORBS]: ExpOrbs,
	[VfxTypes.BOSS_SPELL]: BossSpell,
	[VfxTypes.ASH_SMOKE_AMBIENT]: Ash,
};

export const VfxLayer: React.FC<Props> = ({ vfxList }) => {
	if (!vfxList.length) return null;

	return (
		<VfxViewportLayer>
			{vfxList.map((item) => {
				const VfxComponent = VFX_COMPONENTS[item.type];

				if (!VfxComponent) {
					console.warn(
						`Missing component for VFX type: ${item.type}`,
					);
					return null;
				}

				return (
					<VfxComponent
						key={item.id}
						item={item}
					/>
				);
			})}
		</VfxViewportLayer>
	);
};

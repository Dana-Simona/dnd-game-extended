import React from 'react';

import Bleed from './effectVfxs/front/Bleed';
import { VfxViewportLayer } from './vfxStyles';
import IceHit from './effectVfxs/front/IceHit';
import IceFeet from './effectVfxs/front/IceFeet';
import StatExp from './effectVfxs/front/StatExp';
import ExpOrbs from './effectVfxs/front/ExpOrbs';
import DustLeap from './effectVfxs/back/DustLeap';
import DustLand from './effectVfxs/back/DustLand';
import StatHeal from './effectVfxs/front/StatHeal';
import IceGather from './effectVfxs/front/IceGather';
import BloodDrip from './effectVfxs/front/BloodDrip';
import IceExplode from './effectVfxs/front/IceExplode';
import StatDamage from './effectVfxs/front/StatDamage';
import EffectHeal from './effectVfxs/front/EffectHeal';
import GroundBreak from './effectVfxs/back/GroundBreak';
import TargetSwirl from './effectVfxs/back/TargetSwirl';
import ArrowProjectile from './effectVfxs/front/ArrowProjectile';
import LightningStrike from './effectVfxs/front/LightningStrike';
import KnivesProjectile from './effectVfxs/front/KnivesProjectile';
import {
	type VfxItem,
	VfxTypes,
} from '../../../../../constants/animationStates/vfxStates';
import Slash from './effectVfxs/front/Slash';
import { RollVfx } from './effectVfxs/front/rollVfx/RollVfx';

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
	[VfxTypes.STAT_DAMAGE]: StatDamage,
	[VfxTypes.STAT_HEAL]: StatHeal,
	[VfxTypes.STAT_EXP]: StatExp,
	[VfxTypes.ROLL_ATTACK]: RollVfx,
	[VfxTypes.ROLL_DEFENSE]: RollVfx,
	[VfxTypes.BLEED]: Bleed,
	[VfxTypes.BLOOD_DRIP]: BloodDrip,
	[VfxTypes.ICE_EXPLODE]: IceExplode,
	[VfxTypes.EFFECTS_HEAL]: EffectHeal,
	[VfxTypes.LIGHTNING_STRIKE]: LightningStrike,
	[VfxTypes.ICE_HIT]: IceHit,
	[VfxTypes.SLASH]: Slash,
	[VfxTypes.KNIVES_PROJECTILE]: KnivesProjectile,
	[VfxTypes.ARROW_PROJECTILE]: ArrowProjectile,
	[VfxTypes.EXP_ORBS]: ExpOrbs,
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

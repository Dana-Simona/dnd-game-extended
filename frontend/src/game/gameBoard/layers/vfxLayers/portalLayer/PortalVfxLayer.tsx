import React from 'react';
import ReactDOM from 'react-dom';

import Ravens from './portalVfxs/Ravens';
import LevelGoal from './portalVfxs/LevelGoal';
import NextLevel from './portalVfxs/NextLevel';
import LetterBox from './portalVfxs/LetterBox';
import { PortalOverlay } from './PortalVfxStyles';
import LevelUp from './portalVfxs/levelup/LevelUp';
import BlizzardClouds from './portalVfxs/BlizzardClouds';
import LevelTransition from './portalVfxs/LevelTransition';
import {
	VfxTypes,
	type VfxItem,
} from '../../../../../constants/animationStates/vfxStates';

interface Props {
	vfxList: VfxItem[];
}

const PORTAL_COMPONENTS: Partial<
	Record<VfxTypes, React.ComponentType<{ item: VfxItem }>>
> = {
	[VfxTypes.BANNER_LEVEL_UP]: LevelUp,
	[VfxTypes.BANNER_NEXT_LEVEL]: NextLevel,
	[VfxTypes.BANNER_GOAL]: LevelGoal,
	[VfxTypes.LEVEL_TRANSITION]: LevelTransition,
	[VfxTypes.BLIZZARD_CLOUDS]: BlizzardClouds,
	[VfxTypes.RAVENS_FLYING]: Ravens,
	[VfxTypes.LETTERBOX]: LetterBox,
};

export const PortalVfxLayer: React.FC<Props> = ({ vfxList }) => {
	if (!vfxList || vfxList.length === 0) return null;

	return ReactDOM.createPortal(
		<>
			{vfxList.map((item) => {
				const PortalComponent = PORTAL_COMPONENTS[item.type];

				if (!PortalComponent) {
					console.warn(
						`Missing portal component for VFX type: ${item.type}`,
					);
					return null;
				}

				return (
					<PortalOverlay key={item.id}>
						<PortalComponent item={item} />
					</PortalOverlay>
				);
			})}
		</>,
		document.body,
	);
};

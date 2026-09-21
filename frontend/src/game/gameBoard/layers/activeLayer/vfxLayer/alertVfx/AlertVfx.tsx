import React from 'react';
import ReactDOM from 'react-dom';

import WinVfx from './banners/WinVfx';
import LoseVfx from './banners/LoseVfx';
import LevelUpVfx from './banners/LevelUpVfx';
import NextLevelVfx from './banners/NextLevel';
import { AlertOverlay } from './AlertVfxStyles';
import type { VfxItem } from '../../../../../../constants/animationStates/vfxStates';

interface Props {
	item: VfxItem;
}

const ALERT_COMPONENTS: Record<string, React.ComponentType> = {
	LevelUp: LevelUpVfx,
	Win: WinVfx,
	Lose: LoseVfx,
	NextLevel: NextLevelVfx,
};

const BannerVfx: React.FC<Props> = ({ item }) => {
	const AlertComponent = ALERT_COMPONENTS[item.type];

	if (!AlertComponent) return null;

	return ReactDOM.createPortal(
		<AlertOverlay>
			<AlertComponent />
		</AlertOverlay>,
		document.body,
	);
};

export default BannerVfx;

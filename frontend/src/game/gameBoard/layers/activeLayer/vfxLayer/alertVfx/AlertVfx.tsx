import React from 'react';
import ReactDOM from 'react-dom';

import WinVfx from './alerts/WinVfx';
import LoseVfx from './alerts/LoseVfx';
import LevelUpVfx from './alerts/LevelUpVfx';
import NextLevelVfx from './alerts/NextLevel';
import { AlertOverlay } from './AlertVfxStyles';
import type { VfxItem } from '../../../../../../utils/animation/useGameAnimation/useVfxControl';

interface AlertVfxProps {
	item: VfxItem;
}

const ALERT_COMPONENTS: Record<string, React.ComponentType> = {
	LevelUp: LevelUpVfx,
	Win: WinVfx,
	Lose: LoseVfx,
	NextLevel: NextLevelVfx,
};

export const AlertVfx: React.FC<AlertVfxProps> = ({ item }) => {
	const AlertComponent = ALERT_COMPONENTS[item.type];

	if (!AlertComponent) return null;

	return ReactDOM.createPortal(
		<AlertOverlay>
			<AlertComponent />
		</AlertOverlay>,
		document.body,
	);
};

import { useState, useCallback, useMemo } from 'react';
import type { TriggerBossAPI } from '../../../../constants/animationStates/bossStates';

const BAR_ENTER_MS = 600;
const BAR_EXIT_MS = 400;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export interface UseBossControlReturn {
	activeBossId: string | null;
	triggerBoss: TriggerBossAPI;
	resetBoss: () => void;
}

export const useBossControl = (): UseBossControlReturn => {
	const [activeBossId, setActiveBossId] = useState<string | null>(null);

	const showHealthBar = useCallback(async (bossId: string) => {
		setActiveBossId(bossId);
		await delay(BAR_ENTER_MS);
	}, []);

	const hideHealthBar = useCallback(async () => {
		setActiveBossId(null);
		await delay(BAR_EXIT_MS);
	}, []);

	const resetBoss = useCallback(() => setActiveBossId(null), []);

	const triggerBoss = useMemo<TriggerBossAPI>(
		() => ({ showHealthBar, hideHealthBar }),
		[showHealthBar, hideHealthBar],
	);

	return { activeBossId, triggerBoss, resetBoss };
};

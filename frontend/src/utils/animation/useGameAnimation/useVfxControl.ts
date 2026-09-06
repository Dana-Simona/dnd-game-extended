import { useCallback } from 'react';

export const useVfxControl = () => {
	const spawnVFX = useCallback(
		async (type: string, targetIds: string[], amount?: number) => {
			// Implementation for VFX will go here later
			console.log(`Spawning VFX: ${type} on targets:`, targetIds);
		},
		[],
	);

	return { spawnVFX };
};

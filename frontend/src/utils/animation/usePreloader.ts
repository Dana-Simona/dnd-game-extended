import { useEffect } from 'react';
import type { Unit, AllPlayerData } from '../../constants/interfaces/player';
import { getUnitSpriteConfig } from './unitAnimations';
import { ActionType } from '../../constants/gameEvent';

export const usePreloader = (units: Unit[], player: AllPlayerData | null) => {
	useEffect(() => {
		const allUnits = player ? [player, ...units] : [...units];

		const actionsToPreload = [
			'idle',
			ActionType.MOVE,
			ActionType.MELEE,
			ActionType.DIE,
		];

		allUnits.forEach((unit) => {
			actionsToPreload.forEach((action) => {
				const config = getUnitSpriteConfig(unit, action);

				const img = new Image();
				img.src = config.imagePath;
			});
		});
	}, [units, player]);
};

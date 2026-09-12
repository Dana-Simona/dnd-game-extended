import { useEffect } from 'react';
import type { Unit, AllPlayerData } from '../../constants/interfaces/player';
import { getUnitSpriteConfig } from './spriteAnimations';
import { ActionType } from '../../constants/gameEvent';

export const usePreloader = (units: Unit[], player: AllPlayerData | null) => {
	useEffect(() => {
		const allUnits = player ? [player, ...units] : [...units];

		const actionsToPreload = [
			ActionType.IDLE,
			ActionType.MOVE,
			ActionType.MELEE,
			ActionType.DIE,
			ActionType.ABILITY_CAST,
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

import { useEffect } from 'react';
import { ActionType } from '../../constants/gameEvent';
import { getUnitSpriteConfig } from './spriteAnimations';
import type { Unit } from '../../constants/interfaces/unit';
import type { AllPlayerData } from '../../constants/interfaces/player';

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

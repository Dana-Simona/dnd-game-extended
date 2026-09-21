import { useEffect } from 'react';
import { getUnitSpriteConfig } from './spriteAnimations';
import type { Unit } from '../../constants/interfaces/unit';
import type { AllPlayerData } from '../../constants/interfaces/player';
import { SpritePresets } from '../../constants/animationStates/spriteStates';

export const usePreloader = (units: Unit[], player: AllPlayerData | null) => {
	useEffect(() => {
		const allUnits = player ? [player, ...units] : [...units];

		const actionsToPreload = [
			SpritePresets.IDLE,
			SpritePresets.MOVE,
			SpritePresets.MELEE,
			SpritePresets.DIE,
			SpritePresets.ABILITY_CAST,
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

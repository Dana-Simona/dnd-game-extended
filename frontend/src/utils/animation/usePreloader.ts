import { useEffect } from 'react';
import { getUnitSpriteConfig, hasAnimation } from './spriteAnimations';
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
			SpritePresets.SPAWN,
		];

		allUnits.forEach((unit) => {
			actionsToPreload.forEach((action) => {
				if (action === SpritePresets.SPAWN && !hasAnimation(unit, action))
					return;

				const config = getUnitSpriteConfig(unit, action);

				const img = new Image();
				img.src = config.imagePath;
			});
		});
	}, [units, player]);
};

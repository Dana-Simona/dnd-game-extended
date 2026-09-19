import React from 'react';
import { useCharacter } from '../../../../../../utils/characterContext/CharacterContext';
import { AbilityVfxContainer } from './AbilityVfxStyles';
import type { SpriteProps } from '../../../../../../utils/sprite/Sprite';
import { ClassTypes } from '../../../../../../constants/classTypes';
import Sprite from '../../../../../../utils/sprite/Sprite';
import type { VfxItem } from '../../../../../../utils/animation/useGameAnimation/vfxControl/vfxTypes';

interface Props {
	item: VfxItem;
}

type AbilitySpriteConfig = Omit<SpriteProps, 'offsetY'>;

const CLASS_ABILITY_SPRITES: Partial<Record<ClassTypes, AbilitySpriteConfig>> =
	{
		[ClassTypes.WARRIOR]: {
			imagePath: '/vfx/Holy_smite.png',
			width: 64,
			height: 80,
			frameCount: 23,
			fps: 8,
		},
		[ClassTypes.MAGE]: {
			imagePath: '/vfx/Holy_magic.png',
			width: 32,
			height: 32,
			frameCount: 6,
			fps: 8,
		},
		[ClassTypes.ROGUE]: {
			imagePath: '/vfx/Holy_shot.png',
			width: 32,
			height: 32,
			frameCount: 2,
			fps: 8,
		},
		[ClassTypes.HUNTER]: {
			imagePath: '/vfx/Holy_fire.png',
			width: 32,
			height: 32,
			frameCount: 8,
			fps: 8,
		},
	};

const DEFAULT_ABILITY_SPRITE: AbilitySpriteConfig = {
	imagePath: '/vfx/Holy_smite.png',
	width: 64,
	height: 80,
	frameCount: 23,
	fps: 8,
};

export const AbilityVfx: React.FC<Props> = ({ item }) => {
	const { character } = useCharacter();
	const classType = character?.class as ClassTypes | undefined;

	const spriteConfig =
		(classType && CLASS_ABILITY_SPRITES[classType]) ??
		DEFAULT_ABILITY_SPRITE;

	return (
		<AbilityVfxContainer
			$x={item.x}
			$y={item.y}
		>
			<Sprite {...spriteConfig} />
		</AbilityVfxContainer>
	);
};

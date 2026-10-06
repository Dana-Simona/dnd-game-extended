import React from 'react';
import type { Transition } from 'framer-motion';

import Tile from '../../Tile/Tile';
import { UnitType, type Unit } from '../../../../constants/interfaces/unit';
import { ActiveLayerContainer, AnimatedUnitWrapper } from './ActiveLayerStyles';
import type { HpStateMap } from '../../../../constants/animationStates/hpStates';
import {
	UnitFacing,
	type UnitTransform,
	type TrapVisualStateMap,
} from '../../../../constants/animationStates/unitStates';
import type {
	SpritePresets,
	AnimationPhase,
} from '../../../../constants/animationStates/spriteStates';

interface Props {
	units: Unit[];
	characterId: string;
	tileSize: number;
	activeSpriteStates?: Record<string, SpritePresets>;
	activeSpritePhases?: Record<string, AnimationPhase>;
	visualPositions?: Record<string, { x: number; y: number }>;
	unitTransforms?: Record<string, UnitTransform>;
	trapStates?: TrapVisualStateMap;
	hpStates?: HpStateMap;
}

const PLAYER_MOVEMENT_DELAY = 0.3;

const UNIT_SCALE_ORIGIN = { originX: 0.5, originY: 1 } as const;

const ActiveLayer: React.FC<Props> = React.memo(
	({
		units,
		characterId,
		tileSize,
		activeSpriteStates = {},
		activeSpritePhases = {},
		visualPositions = {},
		unitTransforms = {},
		trapStates = {},
		hpStates = {},
	}) => {
		return (
			<ActiveLayerContainer>
				{units.map((unit, index) => {
					const isPlayer = unit.unitType === UnitType.PLAYER;
					const unitId =
						unit.id || (isPlayer ? characterId : `unit-${index}`);

					const currentX = visualPositions[unitId]?.x ?? unit.x;
					const currentY = visualPositions[unitId]?.y ?? unit.y;
					const transform = unitTransforms[unitId] ?? {};

					const baseX = currentX * tileSize;
					const baseY = currentY * tileSize;

					let targetX: number | number[];
					if (Array.isArray(transform.x)) {
						targetX = transform.x.map((xOffset) => {
							const val =
								typeof xOffset === 'number'
									? xOffset
									: parseFloat(String(xOffset));
							return baseX + (isNaN(val) ? 0 : val);
						});
					} else {
						const rawOffsetX =
							typeof transform.x === 'number'
								? transform.x
								: (transform.offset?.x ?? 0);
						const offsetX =
							typeof rawOffsetX === 'number'
								? rawOffsetX
								: parseFloat(String(rawOffsetX));
						targetX = baseX + (isNaN(offsetX) ? 0 : offsetX);
					}

					let targetY: number | number[];
					if (Array.isArray(transform.y)) {
						targetY = transform.y.map((yOffset) => {
							const val =
								typeof yOffset === 'number'
									? yOffset
									: parseFloat(String(yOffset));
							return baseY + (isNaN(val) ? 0 : val);
						});
					} else {
						const rawOffsetY =
							typeof transform.y === 'number'
								? transform.y
								: (transform.offset?.y ?? 0);
						const offsetY =
							typeof rawOffsetY === 'number'
								? rawOffsetY
								: parseFloat(String(rawOffsetY));
						targetY = baseY + (isNaN(offsetY) ? 0 : offsetY);
					}

					const targetOpacity = transform.opacity ?? 1;
					const targetScale =
						typeof transform.scale === 'number' ? transform.scale : 1;

					const moveDelay = isPlayer ? PLAYER_MOVEMENT_DELAY : 0;

					const defaultGridTransition: Transition = {
						type: 'spring',
						stiffness: 300,
						damping: 28,
						delay: moveDelay,
					};

					const transitionConfig: Transition =
						(transform.transition as Transition) ?? {
							x: defaultGridTransition,
							y: defaultGridTransition,
							opacity: { duration: 0.2, ease: 'easeInOut' },
							scale: { duration: 0.3, ease: 'easeOut' },
						};

					const defaultFacing = isPlayer
						? UnitFacing.RIGHT
						: UnitFacing.LEFT;
					const facing =
						transform.facing ??
						(transform.scaleX !== undefined
							? transform.scaleX === -1
								? UnitFacing.LEFT
								: UnitFacing.RIGHT
							: defaultFacing);

					return (
						<AnimatedUnitWrapper
							key={unitId}
							$tileSize={tileSize}
							$zIndex={isPlayer ? 10 : 1}
							style={UNIT_SCALE_ORIGIN}
							initial={{
								x: Array.isArray(targetX)
									? targetX[0]
									: targetX,
								y: Array.isArray(targetY)
									? targetY[0]
									: targetY,
								opacity: targetOpacity,
								scale: targetScale,
							}}
							animate={{
								x: targetX,
								y: targetY,
								opacity: targetOpacity,
								scale: targetScale,
							}}
							transition={transitionConfig}
						>
							<Tile
								x={currentX}
								y={currentY}
								unit={unit}
								activeActionState={activeSpriteStates[unitId]}
								facing={facing}
								phase={activeSpritePhases[unitId]}
								hpState={hpStates[unitId]}
								trapState={trapStates[unitId]}
							/>
						</AnimatedUnitWrapper>
					);
				})}
			</ActiveLayerContainer>
		);
	},
);

ActiveLayer.displayName = 'ActiveLayer';

export default ActiveLayer;

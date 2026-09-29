import React from 'react';
import type { Transition } from 'framer-motion';
import Tile from '../../Tile/Tile';
import { UnitType, type Unit } from '../../../../constants/interfaces/unit';
import { ActiveLayerContainer, AnimatedUnitWrapper } from './ActiveLayerStyles';
import {
	UnitFacing,
	type UnitTransform,
} from '../../../../constants/animationStates/unitStates';
import type {
	SpritePresets,
	AnimationPhase,
} from '../../../../constants/animationStates/spriteStates';
import type { HpStateMap } from '../../../../constants/animationStates/hpStates';

interface Props {
	units: Unit[];
	characterId: string;
	tileSize: number;
	board: string[];
	activeSpriteStates?: Record<string, SpritePresets>;
	activeSpritePhases?: Record<string, AnimationPhase>;
	visualPositions?: Record<string, { x: number; y: number }>;
	unitTransforms?: Record<string, UnitTransform>;
	hpStates?: HpStateMap;
}

const PLAYER_MOVEMENT_DELAY = 0.3;

const ActiveLayer: React.FC<Props> = React.memo(
	({
		units,
		characterId,
		tileSize,
		board,
		activeSpriteStates = {},
		activeSpritePhases = {},
		visualPositions = {},
		unitTransforms = {},
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
						};

					const facing =
						transform.facing ??
						(transform.scaleX === -1
							? UnitFacing.LEFT
							: UnitFacing.RIGHT);

					return (
						<AnimatedUnitWrapper
							key={unitId}
							$tileSize={tileSize}
							$zIndex={isPlayer ? 10 : 1}
							initial={{
								x: Array.isArray(targetX)
									? targetX[0]
									: targetX,
								y: Array.isArray(targetY)
									? targetY[0]
									: targetY,
								opacity: targetOpacity,
							}}
							animate={{
								x: targetX,
								y: targetY,
								opacity: targetOpacity,
							}}
							transition={transitionConfig}
						>
							<Tile
								char={unit.character}
								x={currentX}
								y={currentY}
								grid={board}
								unit={unit}
								activeActionState={activeSpriteStates[unitId]}
								facing={facing}
								phase={activeSpritePhases[unitId]}
								hpState={hpStates[unitId]}
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

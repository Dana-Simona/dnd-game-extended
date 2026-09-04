import React, { useEffect, useState, useRef } from 'react';
import type { Unit } from '../../constants/interfaces/player';
import { useCharacter } from '../../utils/characterContext/CharacterContext';
import { ViewportContainer, Board, BoardCanvas } from './GameBoardStyles';
import StaticLayer from './staticLayer/StaticLayer';
import ActiveLayer from './activeLayer/ActiveLayer';

interface GameBoardProps {
	board: string[];
	enemies: Unit[];
}

const TILE_SIZE = 32;
const ZOOM = 2;

export const GameBoard: React.FC<GameBoardProps> = ({ board, enemies }) => {
	const { character } = useCharacter();

	const viewportRef = useRef<HTMLDivElement>(null);
	const [viewportDimensions, setViewportDimensions] = useState({
		width: 0,
		height: 0,
	});

	useEffect(() => {
		const updateDimensions = () => {
			if (viewportRef.current) {
				setViewportDimensions({
					width: viewportRef.current.clientWidth,
					height: viewportRef.current.clientHeight,
				});
			}
		};

		updateDimensions();
		window.addEventListener('resize', updateDimensions);
		return () => window.removeEventListener('resize', updateDimensions);
	}, []);

	if (!character) {
		return (
			<ViewportContainer ref={viewportRef}>
				<p>Loading character...</p>
			</ViewportContainer>
		);
	}

	const playerPixelX = (character.x * TILE_SIZE + TILE_SIZE / 2) * ZOOM;
	const playerPixelY = (character.y * TILE_SIZE + TILE_SIZE / 2) * ZOOM;

	const cameraOffsetX = viewportDimensions.width / 2 - playerPixelX;
	const cameraOffsetY = viewportDimensions.height / 2 - playerPixelY;

	const validEnemies = (enemies || []).filter((e): e is Unit => Boolean(e));
	const allUnits: Unit[] = [character, ...validEnemies];

	return (
		<ViewportContainer ref={viewportRef}>
			<Board
				$offsetX={cameraOffsetX}
				$offsetY={cameraOffsetY}
				$zoom={ZOOM}
				$transitionDuration='0.25s'
			>
				<BoardCanvas>
					<StaticLayer board={board} />
					<ActiveLayer
						units={allUnits}
						characterId={character.id}
						tileSize={TILE_SIZE}
						board={board}
					/>
				</BoardCanvas>
			</Board>
		</ViewportContainer>
	);
};

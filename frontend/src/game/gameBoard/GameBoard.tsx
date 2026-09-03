import React, { useEffect, useState, useRef } from 'react';
import Tile from './Tile/Tile';
import { ViewportContainer, Board, BoardRow } from './GameBoardStyles';
import type { Unit } from '../../constants/interfaces/player';

interface GameBoardProps {
	board: string[];
	enemies: Unit[];
}

const TILE_SIZE = 32;
const ZOOM = 2;
const CAMERA_SPEED_SECONDS = '1s';

const getPlayerPosition = (board: string[]) => {
	for (let y = 0; y < board.length; y++) {
		const x = board[y].indexOf('@');
		if (x !== -1) return { x, y };
	}
	return { x: 0, y: 0 };
};

export const GameBoard: React.FC<GameBoardProps> = ({ board, enemies }) => {
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

	const playerPos = getPlayerPosition(board);
	const playerPixelX = (playerPos.x * TILE_SIZE + TILE_SIZE / 2) * ZOOM;
	const playerPixelY = (playerPos.y * TILE_SIZE + TILE_SIZE / 2) * ZOOM;

	const cameraOffsetX = viewportDimensions.width / 2 - playerPixelX;
	const cameraOffsetY = viewportDimensions.height / 2 - playerPixelY;

	return (
		<ViewportContainer ref={viewportRef}>
			<Board
				$offsetX={cameraOffsetX}
				$offsetY={cameraOffsetY}
				$zoom={ZOOM}
				$transitionDuration={CAMERA_SPEED_SECONDS}
			>
				{board.length > 0 ? (
					board.map((row, rowIndex) => (
						<BoardRow key={rowIndex}>
							{row.split('').map((char, colIndex) => {
								const enemyUnit = enemies.find(
									(enemy) =>
										enemy.x === colIndex &&
										enemy.y === rowIndex,
								);

								return (
									<Tile
										key={`${rowIndex}-${colIndex}`}
										char={char}
										x={colIndex}
										y={rowIndex}
										grid={board}
										unit={enemyUnit}
									/>
								);
							})}
						</BoardRow>
					))
				) : (
					<p>Loading board...</p>
				)}
			</Board>
		</ViewportContainer>
	);
};

import React from 'react';
import { useGame } from './useGame';
import { GameLog } from './gameLog/GameLog';
import { useParams } from 'react-router-dom';
import { Container, Stats } from './GameStyles';
import { GameBoard } from './gameBoard/GameBoard';
import { PlayerStats } from './playerStats/PlayerStats';

export const Game: React.FC = () => {
	const { level } = useParams<{ level: string }>();
	const game = useGame(level);

	return (
		<Container>
			<GameBoard
				board={game.board}
				enemies={game.enemies}
				activeUnitStates={game.activeUnitStates}
				visualPositions={game.visualPositions}
				cameraStyle={game.cameraStyle}
				activeVfxList={game.activeVfxList}
			/>
			<Stats>
				<GameLog actionTrigger={game.actionCount} />
				<PlayerStats />
			</Stats>
		</Container>
	);
};

export default Game;

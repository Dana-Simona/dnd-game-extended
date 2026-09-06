import React from 'react';
import { useParams } from 'react-router-dom';
import { GameLog } from './gameLog/GameLog';
import { Container, Stats } from './GameStyles';
import { GameBoard } from './gameBoard/GameBoard';
import { PlayerStats } from './playerStats/PlayerStats';
import { useGame } from './useGame';

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
			/>
			<Stats>
				<GameLog actionTrigger={game.actionCount} />
				<PlayerStats />
			</Stats>
		</Container>
	);
};

export default Game;

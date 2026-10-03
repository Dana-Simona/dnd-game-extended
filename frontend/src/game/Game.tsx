import React from 'react';
import { useGame } from './useGame';
import { GameLog } from './gameLog/GameLog';
import { Container, Stats } from './GameStyles';
import { GameBoard } from './gameBoard/GameBoard';
import { PlayerStats } from './playerStats/PlayerStats';

export const Game: React.FC = () => {
	const game = useGame();

	return (
		<Container>
			<GameBoard
				board={game.board}
				enemies={game.enemies}
				activeSpriteStates={game.activeSpriteStates}
				visualPositions={game.visualPositions}
				unitTransforms={game.unitTransforms}
				panZoomMotion={game.panZoomMotion}
				effectMotion={game.effectMotion}
				activeVfxList={game.activeVfxList}
				activeUnitPhases={game.activeUnitPhases}
				hpStates={game.hpStates}
			/>
			<Stats>
				<GameLog actionTrigger={game.actionCount} />
				<PlayerStats />
			</Stats>
		</Container>
	);
};

export default Game;

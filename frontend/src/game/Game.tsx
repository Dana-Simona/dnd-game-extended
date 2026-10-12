import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useGame } from './useGame';
import { ROUTES } from '../constants/routes';
import { EndScreen } from './endScreen/EndScreen';
import { LowHpVignette } from './lowHpVignette/LowHpVignette';
import { useCharacter } from '../utils/characterContext/CharacterContext';
import { GameLog } from './gameLog/GameLog';
import { Container, GameColumn, Stats } from './GameStyles';
import { GameBoard } from './gameBoard/GameBoard';
import { PlayerStats } from './playerStats/PlayerStats';

export const Game: React.FC = () => {
	const game = useGame();
	const navigate = useNavigate();
	const { character } = useCharacter();

	const playerHp = character
		? (game.hpStates[character.id]?.currentHp ?? character.currentHealth)
		: undefined;

	return (
		<Container>
			<LowHpVignette
				currentHp={playerHp}
				hidden={game.outcome === 'win'}
			/>

			<GameColumn>
				<GameBoard
					board={game.board}
					level={game.level}
					enemies={game.enemies}
					activeSpriteStates={game.activeSpriteStates}
					visualPositions={game.visualPositions}
					unitTransforms={game.unitTransforms}
					trapStates={game.trapStates}
					panZoomMotion={game.panZoomMotion}
					effectMotion={game.effectMotion}
					activeVfxList={game.activeVfxList}
					activeUnitPhases={game.activeUnitPhases}
					hpStates={game.hpStates}
					activeBossId={game.activeBossId}
				/>
				<Stats>
					<GameLog actionTrigger={game.actionCount} />
					<PlayerStats />
				</Stats>
			</GameColumn>

			<EndScreen
				outcome={game.outcome}
				heroName={character?.name}
				heroClass={character?.class}
				heroLevel={character?.level}
				dungeonLevel={game.level}
				onReturn={() => navigate(ROUTES.CHARACTER_SELECTION)}
			/>
		</Container>
	);
};

export default Game;

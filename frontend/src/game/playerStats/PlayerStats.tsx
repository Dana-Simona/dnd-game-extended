import React from 'react';
import {
	HeaderInfo,
	PlayerLevel,
	PlayerName,
	PrimaryStatsGrid,
	StatsContainer,
} from './PlayerStatsStyles';

import { StatBar } from './statBar/StatBar';
import { StatItem } from './statItem/StatItem';
import { Cooldown } from './cooldown/Cooldown';
import { Arrows } from './arrows/Arrows';

import { useCharacter } from '../../utils/characterContext/CharacterContext';
import type { AllPlayerData } from '../../constants/interfaces/player';

export interface RogueData {
	energyCost?: number;
	energy?: number;
	currentEnergy?: number;
}

export const PlayerStats: React.FC = () => {
	const { character } = useCharacter();

	if (!character) return null;

	const player = character as Partial<AllPlayerData & RogueData>;

	const currentHealth = player.currentHealth ?? player.health ?? 0;
	const maxHealth = player.health ?? 100;

	const hasMana =
		player.manaPool !== undefined && player.currentMana !== undefined;

	const hasEnergy =
		player.energy !== undefined && player.currentEnergy !== undefined;

	const hasCooldown =
		player.cooldown !== undefined && player.currentCooldown !== undefined;

	const hasArrows = player.arrowCount !== undefined;

	return (
		<StatsContainer>
			<HeaderInfo>
				<PlayerName>{player.name}</PlayerName>
				<PlayerLevel>Lvl {player.level}</PlayerLevel>
			</HeaderInfo>

			<StatBar
				label='Health'
				current={currentHealth}
				max={maxHealth}
				color='#2ecc71'
			/>

			<PrimaryStatsGrid>
				{player.attack !== undefined && (
					<StatItem
						label='Attack'
						value={player.attack}
						color='#ff4d4d'
					/>
				)}
				{player.defense !== undefined && (
					<StatItem
						label='Defense'
						value={player.defense}
						color='#00bfff'
					/>
				)}
				{player.hitCount !== undefined && (
					<StatItem
						label='Hit Count'
						value={player.hitCount}
						color='#a855f7'
					/>
				)}
			</PrimaryStatsGrid>

			{hasMana && (
				<StatBar
					label='Mana'
					current={player.currentMana!}
					max={player.manaPool!}
					color='#00bfff'
					cost={player.manaCost}
					costLabel='Cost'
				/>
			)}

			{hasEnergy && (
				<StatBar
					label='Energy'
					current={player.currentEnergy!}
					max={player.energy!}
					color='#f1c40f'
					cost={player.energyCost}
					costLabel='Cost'
				/>
			)}

			{hasCooldown && (
				<Cooldown
					currentCooldown={player.currentCooldown!}
					maxCooldown={player.cooldown!}
				/>
			)}

			{hasArrows && <Arrows arrowCount={player.arrowCount!} />}
		</StatsContainer>
	);
};

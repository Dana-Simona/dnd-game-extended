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
import type { TooltipAlign } from './statItem/StatItemStyles';
import { Cooldown } from './cooldown/Cooldown';
import { Arrows } from './arrows/Arrows';
import { ExpBar } from './expBar/ExpBar';

import { useCharacter } from '../../utils/characterContext/CharacterContext';
import type { AllPlayerData } from '../../constants/interfaces/player';

interface PrimaryStat {
	label: string;
	value: number;
	color: string;
	description: string;
}

const STAT_DESCRIPTIONS = {
	attack: 'Each melee attack rolls a random number from 0 up to this value. That roll is your damage before the target defends.',
	defense:
		'Each incoming hit rolls a random number from 0 up to this value, and the roll is subtracted from the damage you take.',
	hitCount:
		'How many times Blizzard strikes per cast. Every strike lands on a random enemy in range, so one enemy can be hit more than once.',
	spellPower:
		'The base damage of each Blizzard strike. The target rolls defense against every strike, and the roll is subtracted from this value.',
} as const;

const MAX_STAT_COLUMNS = 3;

const getTooltipAlign = (index: number, columns: number): TooltipAlign => {
	const column = index % columns;
	if (column === 0) return 'left';
	if (column === columns - 1) return 'right';
	return 'center';
};

export const PlayerStats: React.FC = () => {
	const { character } = useCharacter();

	if (!character) return null;

	const player = character as Partial<AllPlayerData>;

	const currentHealth = player.currentHealth ?? player.health ?? 0;
	const maxHealth = player.health ?? 100;

	const hasMana =
		player.manaPool !== undefined && player.currentMana !== undefined;

	const hasEnergy =
		player.energy !== undefined && player.currentEnergy !== undefined;

	const hasCooldown =
		player.cooldown !== undefined && player.currentCooldown !== undefined;

	const hasArrows = player.arrowCount !== undefined;

	const primaryStats: PrimaryStat[] = [];
	if (player.attack !== undefined) {
		primaryStats.push({
			label: 'Attack',
			value: player.attack,
			color: '#ff4d4d',
			description: STAT_DESCRIPTIONS.attack,
		});
	}
	if (player.defense !== undefined) {
		primaryStats.push({
			label: 'Defense',
			value: player.defense,
			color: '#00bfff',
			description: STAT_DESCRIPTIONS.defense,
		});
	}
	if (player.hitCount !== undefined) {
		primaryStats.push({
			label: 'Hit Count',
			value: player.hitCount,
			color: '#f59e0b',
			description: STAT_DESCRIPTIONS.hitCount,
		});
	}
	if (player.spellPower !== undefined) {
		primaryStats.push({
			label: 'Spell Power',
			value: player.spellPower,
			color: '#a855f7',
			description: STAT_DESCRIPTIONS.spellPower,
		});
	}

	const statColumns = Math.max(
		1,
		primaryStats.length > MAX_STAT_COLUMNS ? 2 : primaryStats.length,
	);

	return (
		<StatsContainer>
			<HeaderInfo>
				<PlayerName>{player.name}</PlayerName>
				<PlayerLevel>Lvl {player.level}</PlayerLevel>
			</HeaderInfo>

			<ExpBar
				currentExp={player.currentExp ?? 0}
				maxExp={player.expRequiredForNextLevel ?? 100}
			/>

			<StatBar
				label='Health'
				current={currentHealth}
				max={maxHealth}
				color='#2ecc71'
			/>

			<PrimaryStatsGrid $columns={statColumns}>
				{primaryStats.map((stat, index) => (
					<StatItem
						key={stat.label}
						label={stat.label}
						value={stat.value}
						color={stat.color}
						description={stat.description}
						tooltipAlign={getTooltipAlign(index, statColumns)}
					/>
				))}
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

import type { Unit } from './unit';

export interface Player extends Unit {
	class: string;
	level: number;
	range: number;
}

export interface Warrior extends Player {
	cooldown: number;
	currentCooldown: number;
}

export interface Mage extends Player {
	manaPool: number;
	currentMana: number;
	manaCost: number;
	spellPower: number;
	hitCount: number;
}

export interface Rogue extends Player {
	energyCost: number;
	energy: number;
	currentEnergy: number;
}

export interface Hunter extends Player {
	arrowCount: number;
}

export type PlayerData = Warrior | Mage | Rogue | Hunter;
export type AllPlayerData = Warrior & Mage & Rogue & Hunter;

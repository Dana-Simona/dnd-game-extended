export interface Player {
	class: string;
	name: string;
	attack: number;
	defense: number;
	level: number;
	currentHealth: number;
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
	range: number;
}

export interface Rogue extends Player {
	cost: number;
}

export interface Hunter extends Player {
	range: number;
}

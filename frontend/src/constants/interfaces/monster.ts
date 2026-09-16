import type { Unit } from './unit';

export interface Enemy extends Unit {
	experienceValue: number;
}

export interface Trap extends Enemy {
	experienceValue: number;
	visibilityTime: number;
	invisibilityTime: number;
}

export interface Monster extends Enemy {
	visionRange: number;
}

export interface Boss extends Monster {
	abilityFrequency: number;
}

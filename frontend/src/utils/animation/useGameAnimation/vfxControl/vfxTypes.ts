export const VfxTypes = {
	BANNER_WIN: 'Win',
	BANNER_LEVEL_UP: 'LevelUp',
	BANNER_NEXT_LEVEL: 'NextLevel',
	BANNER_LOSE: 'Lose',
	ROLL_ATTACK: 'RollAttack',
	ROLL_DEFENSE: 'RollDefense',
	STAT_DAMAGE: 'Damage',
	STAT_HEAL: 'Heal',
	STAT_EXP: 'Exp',
	PARTICLES_DAMAGE: 'ParticlesDamage',
	EFFECTS_ABILITY_CAST: 'AbilityCast',
	EFFECTS_HEAL: 'ParticlesHeal',
	PROJECTILE_ABILITY: 'ProjectileAbility',
} as const;
export type VfxTypes = (typeof VfxTypes)[keyof typeof VfxTypes];

export const VfxCategory = {
	BANNER: 'Banner',
	STAT: 'Stat',
	ROLL: 'Roll',
	PARTICLES: 'Particles',
	EFFECTS: 'Effects',
	PROJECTILES: 'Projectiles',
} as const;
export type VfxCategory = (typeof VfxCategory)[keyof typeof VfxCategory];

export const VfxTypeToCategoryMap: Record<VfxTypes, VfxCategory> = {
	[VfxTypes.BANNER_WIN]: VfxCategory.BANNER,
	[VfxTypes.BANNER_LEVEL_UP]: VfxCategory.BANNER,
	[VfxTypes.BANNER_NEXT_LEVEL]: VfxCategory.BANNER,
	[VfxTypes.BANNER_LOSE]: VfxCategory.BANNER,
	[VfxTypes.ROLL_ATTACK]: VfxCategory.ROLL,
	[VfxTypes.ROLL_DEFENSE]: VfxCategory.ROLL,
	[VfxTypes.STAT_DAMAGE]: VfxCategory.STAT,
	[VfxTypes.STAT_HEAL]: VfxCategory.STAT,
	[VfxTypes.STAT_EXP]: VfxCategory.STAT,
	[VfxTypes.PARTICLES_DAMAGE]: VfxCategory.PARTICLES,
	[VfxTypes.EFFECTS_ABILITY_CAST]: VfxCategory.EFFECTS,
	[VfxTypes.EFFECTS_HEAL]: VfxCategory.EFFECTS,
	[VfxTypes.PROJECTILE_ABILITY]: VfxCategory.PROJECTILES,
} as const;

export interface VfxItem {
	id: string;
	type: VfxTypes;
	category: VfxCategory;
	targetId?: string;
	sourceId?: string;
	amount?: number;
	x: number;
	y: number;
	sourceX?: number;
	sourceY?: number;
}

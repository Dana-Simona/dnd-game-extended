export type BloodColor = 'Red' | 'White';
export type ProjectileType = 'KNIVES' | 'ARROW';

export const VfxTypes = {
	// 1. Floating UI & Stat Popups
	STAT_DAMAGE: 'Damage',
	STAT_HEAL: 'Heal',
	STAT_EXP: 'Exp',
	ROLL_ATTACK: 'RollAttack',
	ROLL_DEFENSE: 'RollDefense',

	// 2. Particle Systems
	BLEED: 'bleed',
	EFFECTS_EXP: 'EffectsExp',
	ICE_GATHER: 'IceGather',
	ICE_EXPLODE: 'IceExplode',
	BLOOD_DRIP_SPLASH: 'BloodDripSplash',
	EFFECTS_ABILITY_CAST: 'AbilityCast',
	EFFECTS_HEAL: 'ParticlesHeal',

	// 3. Spritesheet & World-Anchored Effects
	ICE_FEET: 'IceFeet',
	LIGHTNING_STRIKE: 'LightningStrike',
	ICE_HIT: 'IceHit',
	GROUND_BREAK: 'GroundBreak',
	DUST_LEAP: 'DustLeap',
	LANDING_SMOKE: 'LandingSmoke',
	SLASH: 'Slash',
	TARGET_SWIRL: 'TargetSwirl',
	PROJECTILE: 'Projectile',
	PROJECTILE_ABILITY: 'ProjectileAbility',

	// 4. Screen Shaders & Post-Processing
	SCREEN_DARKEN: 'ScreenDarken',
	SCREEN_RED_HUE: 'ScreenRedHue',
	SCREEN_DESATURATE: 'ScreenDesaturate',
	SCREEN_RESTORE_COLOR: 'ScreenRestoreColor',

	// 5. Banners & Portal Overlays
	BANNER_WIN: 'Win',
	BANNER_LEVEL_UP: 'LevelUp',
	BANNER_NEXT_LEVEL: 'NextLevel',
	BANNER_LOSE: 'Lose',
	BLACK_CLOUDS: 'BlackClouds',
	RAVENS_FLYING: 'RavensFlying',
	LETTERBOX: 'Letterbox',
	ASH_SMOKE_AMBIENT: 'AshSmokeAmbient',
} as const;

export type VfxTypes = (typeof VfxTypes)[keyof typeof VfxTypes];

export const VfxCategory = {
	BANNER: 'Banner',
	STAT: 'Stat',
	ROLL: 'Roll',
	PARTICLES: 'Particles',
	EFFECTS: 'Effects',
	PROJECTILES: 'Projectiles',
	WORLD: 'World',
	SCREEN: 'Screen',
	OVERLAY: 'Overlay',
} as const;

export type VfxCategory = (typeof VfxCategory)[keyof typeof VfxCategory];

export const VfxTypeToCategoryMap: Record<VfxTypes, VfxCategory> = {
	// Stat & Roll
	[VfxTypes.STAT_DAMAGE]: VfxCategory.STAT,
	[VfxTypes.STAT_HEAL]: VfxCategory.STAT,
	[VfxTypes.STAT_EXP]: VfxCategory.STAT,
	[VfxTypes.ROLL_ATTACK]: VfxCategory.ROLL,
	[VfxTypes.ROLL_DEFENSE]: VfxCategory.ROLL,

	// Particles & Effects
	[VfxTypes.BLEED]: VfxCategory.PARTICLES,
	[VfxTypes.EFFECTS_EXP]: VfxCategory.EFFECTS,
	[VfxTypes.ICE_GATHER]: VfxCategory.PARTICLES,
	[VfxTypes.ICE_EXPLODE]: VfxCategory.PARTICLES,
	[VfxTypes.BLOOD_DRIP_SPLASH]: VfxCategory.PARTICLES,
	[VfxTypes.EFFECTS_ABILITY_CAST]: VfxCategory.EFFECTS,
	[VfxTypes.EFFECTS_HEAL]: VfxCategory.EFFECTS,

	// World-Anchored & Projectiles
	[VfxTypes.ICE_FEET]: VfxCategory.WORLD,
	[VfxTypes.LIGHTNING_STRIKE]: VfxCategory.WORLD,
	[VfxTypes.ICE_HIT]: VfxCategory.WORLD,
	[VfxTypes.GROUND_BREAK]: VfxCategory.WORLD,
	[VfxTypes.DUST_LEAP]: VfxCategory.WORLD,
	[VfxTypes.LANDING_SMOKE]: VfxCategory.WORLD,
	[VfxTypes.SLASH]: VfxCategory.WORLD,
	[VfxTypes.TARGET_SWIRL]: VfxCategory.WORLD,
	[VfxTypes.PROJECTILE]: VfxCategory.PROJECTILES,
	[VfxTypes.PROJECTILE_ABILITY]: VfxCategory.PROJECTILES,

	// Screen Shaders
	[VfxTypes.SCREEN_DARKEN]: VfxCategory.SCREEN,
	[VfxTypes.SCREEN_RED_HUE]: VfxCategory.SCREEN,
	[VfxTypes.SCREEN_DESATURATE]: VfxCategory.SCREEN,
	[VfxTypes.SCREEN_RESTORE_COLOR]: VfxCategory.SCREEN,

	// Banners & Overlays
	[VfxTypes.BANNER_WIN]: VfxCategory.BANNER,
	[VfxTypes.BANNER_LEVEL_UP]: VfxCategory.BANNER,
	[VfxTypes.BANNER_NEXT_LEVEL]: VfxCategory.BANNER,
	[VfxTypes.BANNER_LOSE]: VfxCategory.BANNER,
	[VfxTypes.BLACK_CLOUDS]: VfxCategory.OVERLAY,
	[VfxTypes.RAVENS_FLYING]: VfxCategory.OVERLAY,
	[VfxTypes.LETTERBOX]: VfxCategory.OVERLAY,
	[VfxTypes.ASH_SMOKE_AMBIENT]: VfxCategory.OVERLAY,
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

	// Additional configuration properties
	color?: BloodColor;
	staggerDelayMs?: number;
	durationMs?: number;
	projectileType?: ProjectileType;
	visible?: boolean;
	enabled?: boolean;
	excludeActiveLayer?: boolean;
}

export interface TriggerVfxAPI {
	// 1. Floating UI & Stat Popups
	statDamage: (targetId: string, amount: number) => Promise<void>;
	statHeal: (targetId: string, amount: number) => Promise<void>;
	statExp: (targetId: string, amount: number) => Promise<void>;
	rollAttack: (targetId: string, amount: number) => Promise<void>;
	rollDefense: (targetId: string, amount: number) => Promise<void>;

	// 2. Particle Systems
	bleed: (
		sourceId: string,
		targetId: string,
		color?: string,
	) => Promise<void>;
	effectsExp: (sourceId: string, amount: number) => Promise<void>;
	iceGather: (sourceId: string) => Promise<void>;
	iceExplode: (sourceId: string) => Promise<void>;
	bloodDrip: (targetId: string, color: BloodColor) => Promise<void>;

	// 3. Spritesheet & World-Anchored Effects
	iceFeet: (targetId: string) => Promise<void>;
	lightningStrike: (targetId: string) => Promise<void>;
	iceHit: (targetId: string) => Promise<void>;
	groundBreak: (targetId: string) => Promise<void>;
	dustLeap: (unitId: string) => Promise<void>;
	landingSmoke: (unitId: string) => Promise<void>;
	slash: (targetId: string) => Promise<void>;
	targetSwirl: (targetId: string) => Promise<void>;
	projectile: (
		projectileType: ProjectileType,
		sourceId: string,
		targetId: string,
	) => Promise<void>;

	// 4. Screen Shaders & Post-Processing
	screenDarken: (durationMs?: number) => Promise<void>;
	screenRedHue: (durationMs?: number) => Promise<void>;
	screenDesaturate: (excludeActiveLayer?: boolean) => Promise<void>;
	screenRestoreColor: (durationMs?: number) => Promise<void>;

	// 5. Banners & Portal Overlays
	bannerLevelUp: (amount: number) => Promise<void>;
	bannerLose: (amount: number) => Promise<void>;
	blackClouds: (visible: boolean) => Promise<void>;
	ravensFlying: (durationMs?: number) => Promise<void>;
	letterbox: (visible: boolean) => Promise<void>;
	ashSmokeAmbient: (enabled: boolean) => Promise<void>;
}

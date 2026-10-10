export const NEXT_LEVEL_BANNER_MS = 6000;
export const LEVEL_TRANSITION_MS = 900;
export const LEVEL_TRANSITION_HOLD_MS = 450;

export const VfxTypes = {
	STAT_DAMAGE: 'Damage',
	STAT_HEAL: 'Heal',
	STAT_EXP: 'Exp',
	ROLL_ATTACK: 'RollAttack',
	ROLL_DEFENSE: 'RollDefense',

	BLEED: 'bleed',
	EXP_ORBS: 'EffectsExp',
	ICE_GATHER: 'IceGather',
	ICE_EXPLODE: 'IceExplode',
	BLOOD_DRIP: 'BloodDrip',
	EFFECTS_HEAL: 'ParticlesHeal',

	ICE_FEET: 'IceFeet',
	LIGHTNING_STRIKE: 'LightningStrike',
	GROUND_BREAK: 'GroundBreak',
	DUST_LEAP: 'DustLeap',
	DUST_LAND: 'LandingSmoke',
	SLASH: 'Slash',
	TARGET_SWIRL: 'TargetSwirl',
	KNIVES_PROJECTILE: 'KnifeProjectile',
	ARROW_PROJECTILE: 'arrowProjectile',
	BOSS_SPELL: 'BossSpell',

	SCREEN_DARKEN: 'ScreenDarken',
	SCREEN_RED_HUE: 'ScreenRedHue',
	SCREEN_DESATURATE: 'ScreenDesaturate',
	SCREEN_RESTORE_COLOR: 'ScreenRestoreColor',

	BANNER_WIN: 'Win',
	BANNER_LEVEL_UP: 'LevelUp',
	BANNER_NEXT_LEVEL: 'NextLevel',
	BANNER_LOSE: 'Lose',
	LEVEL_TRANSITION: 'LevelTransition',
	BLIZZARD_CLOUDS: 'BlizzardClouds',
	RAVENS_FLYING: 'RavensFlying',
	LETTERBOX: 'Letterbox',
	ASH_SMOKE_AMBIENT: 'AshSmokeAmbient',
} as const;

export type VfxTypes = (typeof VfxTypes)[keyof typeof VfxTypes];

export const VfxCategory = {
	SCREEN_COLOR: 'ScreenColor',
	BACK: 'Back',
	FRONT: 'Front',
	PORTAL: 'Portal',
} as const;

export type VfxCategory = (typeof VfxCategory)[keyof typeof VfxCategory];

export const VfxTypeToCategoryMap: Record<VfxTypes, VfxCategory> = {
	[VfxTypes.SCREEN_DARKEN]: VfxCategory.SCREEN_COLOR,
	[VfxTypes.SCREEN_RED_HUE]: VfxCategory.SCREEN_COLOR,
	[VfxTypes.SCREEN_DESATURATE]: VfxCategory.SCREEN_COLOR,
	[VfxTypes.SCREEN_RESTORE_COLOR]: VfxCategory.SCREEN_COLOR,

	[VfxTypes.GROUND_BREAK]: VfxCategory.BACK,
	[VfxTypes.DUST_LEAP]: VfxCategory.BACK,
	[VfxTypes.DUST_LAND]: VfxCategory.BACK,
	[VfxTypes.TARGET_SWIRL]: VfxCategory.BACK,
	[VfxTypes.BLEED]: VfxCategory.BACK,

	[VfxTypes.ICE_GATHER]: VfxCategory.FRONT,
	[VfxTypes.ICE_FEET]: VfxCategory.FRONT,
	[VfxTypes.STAT_DAMAGE]: VfxCategory.FRONT,
	[VfxTypes.STAT_HEAL]: VfxCategory.FRONT,
	[VfxTypes.STAT_EXP]: VfxCategory.FRONT,
	[VfxTypes.ROLL_ATTACK]: VfxCategory.FRONT,
	[VfxTypes.ROLL_DEFENSE]: VfxCategory.FRONT,
	[VfxTypes.BLOOD_DRIP]: VfxCategory.FRONT,
	[VfxTypes.ICE_EXPLODE]: VfxCategory.FRONT,
	[VfxTypes.EFFECTS_HEAL]: VfxCategory.FRONT,
	[VfxTypes.LIGHTNING_STRIKE]: VfxCategory.FRONT,
	[VfxTypes.SLASH]: VfxCategory.FRONT,
	[VfxTypes.KNIVES_PROJECTILE]: VfxCategory.FRONT,
	[VfxTypes.ARROW_PROJECTILE]: VfxCategory.FRONT,
	[VfxTypes.EXP_ORBS]: VfxCategory.FRONT,
	[VfxTypes.BOSS_SPELL]: VfxCategory.FRONT,

	[VfxTypes.BANNER_WIN]: VfxCategory.PORTAL,
	[VfxTypes.BANNER_LEVEL_UP]: VfxCategory.PORTAL,
	[VfxTypes.BANNER_NEXT_LEVEL]: VfxCategory.PORTAL,
	[VfxTypes.BANNER_LOSE]: VfxCategory.PORTAL,
	[VfxTypes.LEVEL_TRANSITION]: VfxCategory.PORTAL,
	[VfxTypes.BLIZZARD_CLOUDS]: VfxCategory.PORTAL,
	[VfxTypes.RAVENS_FLYING]: VfxCategory.PORTAL,
	[VfxTypes.LETTERBOX]: VfxCategory.PORTAL,
	[VfxTypes.ASH_SMOKE_AMBIENT]: VfxCategory.PORTAL,
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
	durationMs?: number;
	visible?: boolean;
	enabled?: boolean;
	sourceOffsetX?: number;
	sourceOffsetY?: number;
	holdMs?: number;
	flightMs?: number;
}

export interface ArrowProjectileOptions {
	sourceOffset?: { x: number; y: number };
	holdMs?: number;
	flightMs?: number;
}

export const ARROW_HOLD_MS = 2000;
export const ARROW_FLIGHT_MS = 350;
export const ARROW_FADE_MS = 200;

export interface TriggerVfxAPI {
	statDamage: (targetId: string, amount: number) => Promise<void>;
	statHeal: (targetId: string, amount: number) => Promise<void>;
	statExp: (targetId: string, amount: number) => Promise<void>;
	rollAttack: (targetId: string, amount: number) => Promise<void>;
	rollDefense: (targetId: string, amount: number) => Promise<void>;

	bleed: (
		sourceId: string,
		targetId: string,
		color?: string,
	) => Promise<void>;
	expOrbs: (sourceId: string, amount: number) => Promise<void>;
	iceGather: (sourceId: string) => Promise<void>;
	iceExplode: (sourceId: string) => Promise<void>;
	bloodDrip: (targetId: string) => Promise<void>;

	toggleIceFeet: (targetId: string, visible: boolean) => Promise<void>;
	lightningStrike: (targetId: string) => Promise<void>;
	groundBreak: (targetId: string) => Promise<void>;
	dustLeap: (unitId: string) => Promise<void>;
	landingDust: (unitId: string) => Promise<void>;
	slash: (targetId: string) => Promise<void>;
	toggleTargetSwirl: (targetId: string, visible: boolean) => Promise<void>;
	knivesProjectile: (sourceId: string, targetId: string) => Promise<void>;
	/** Resolves once the arrow has been shot, landed and faded out */
	arrowProjectile: (
		sourceId: string,
		targetId: string,
		options?: ArrowProjectileOptions,
	) => Promise<void>;
	bossSpell: (targetId: string) => Promise<void>;

	screenDarken: (durationMs?: number) => Promise<void>;
	screenRedHue: (durationMs?: number) => Promise<void>;
	screenDesaturate: (durationMs?: number) => Promise<void>;
	screenRestoreColor: (durationMs?: number) => Promise<void>;

	bannerLevelUp: (amount: number) => Promise<void>;
	bannerNextLevel: (amount: number) => Promise<void>;
	bannerLose: (amount: number) => Promise<void>;
	levelTransition: (covered: boolean, amount?: number) => Promise<void>;
	blackClouds: (visible: boolean) => Promise<void>;
	ravensFlying: (durationMs?: number) => Promise<void>;
	letterbox: (visible: boolean) => Promise<void>;
	ashSmokeAmbient: (enabled: boolean) => Promise<void>;
}

export const UnitPreset = {
	FACE: 'FACE',
	DASH: 'DASH',
	KNOCKBACK: 'KNOCKBACK',
	RESET: 'RESET',
} as const;

export type UnitPreset = (typeof UnitPreset)[keyof typeof UnitPreset];

export type UnitCommand =
	| { type: typeof UnitPreset.FACE; sourceId: string; targetId: string }
	| {
			type: typeof UnitPreset.DASH;
			sourceId: string;
			targetId: string;
			distancePx?: number;
			durationMs?: number;
			delayMs?: number;
	  }
	| {
			type: typeof UnitPreset.KNOCKBACK;
			targetId: string;
			sourceId: string;
			distancePx?: number;
			durationMs?: number;
			delayMs?: number;
	  }
	| { type: typeof UnitPreset.RESET; unitId: string };

export type TriggerUnit = (command: UnitCommand) => Promise<void>;

export interface UnitTransform {
	facing: 'left' | 'right';
	offset: { x: number; y: number };
}

import { animationRegistry } from './animationRegistry';
import { ActionType, type GameEvent } from '../../constants/gameEvent';
import {
	VfxTypes,
	type TriggerVfx,
} from '../../constants/animationStates/vfxStates';
import {
	UnitPreset,
	type TriggerUnit,
} from '../../constants/animationStates/unitStates';
import {
	HpBarPreset,
	type TriggerHpBar,
} from './useGameAnimation/hpBarControl/useHpBarControl';
import {
	AnimationPhase,
	SpritePresets,
	type TriggerSpriteAnimation,
} from '../../constants/animationStates/spriteStates';
import {
	CameraPreset,
	type TriggerCamera,
} from '../../constants/animationStates/cameraStates';
import { UnitType, type Unit } from '../../constants/interfaces/unit';
import type { Player } from '../../constants/interfaces/player';
import { ClassTypes } from '../../constants/classTypes';

interface Controllers {
	triggerSpriteAnimation: TriggerSpriteAnimation;
	triggerVfx: TriggerVfx;
	triggerCamera: TriggerCamera;
	triggerUnit: TriggerUnit;
	triggerHpBar: TriggerHpBar;
	getUnitById: (id: string) => Unit | undefined;
}

export const setupAnimations = (controllers: Controllers) => {
	animationRegistry.register(ActionType.MOVE, async (event: GameEvent) => {
		if (!event.sourceId) return;

		await controllers.triggerSpriteAnimation({
			type: SpritePresets.MOVE,
			unitId: event.sourceId,
		});
	});

	animationRegistry.register(ActionType.DIE, async (event: GameEvent) => {
		if (!event.sourceId) return;

		controllers.triggerSpriteAnimation({
			type: SpritePresets.DIE,
			unitId: event.sourceId,
		});

		(await new Promise((resolve) => setTimeout(resolve, 300)),
			await controllers.triggerUnit({
				type: UnitPreset.FADE_OUT,
				unitId: event.sourceId,
				delayMs: 400,
				durationMs: 200,
			}));
	});

	animationRegistry.register(ActionType.MELEE, async (event: GameEvent) => {
		const defender = event.targetIds?.[0];
		const attacker = event.sourceId;
		if (!event.sourceId || !defender) return;

		await Promise.all([
			controllers.triggerUnit({
				type: UnitPreset.FACE,
				sourceId: attacker,
				targetId: defender,
			}),
			controllers.triggerUnit({
				type: UnitPreset.FACE,
				sourceId: defender,
				targetId: attacker,
			}),
		]);

		await Promise.all([
			controllers.triggerSpriteAnimation({
				type: SpritePresets.MELEE,
				unitId: attacker,
				phase: AnimationPhase.WINDUP,
			}),
			controllers.triggerSpriteAnimation({
				type: SpritePresets.TAKE_DAMAGE,
				unitId: defender,
				phase: AnimationPhase.WINDUP,
			}),
		]);

		await Promise.all([
			controllers.triggerSpriteAnimation({
				type: SpritePresets.TAKE_DAMAGE,
				unitId: defender,
				phase: AnimationPhase.FOLLOW_THROUGH,
			}),
			controllers.triggerCamera({ type: CameraPreset.SHAKE }),
			controllers.triggerVfx({
				type: VfxTypes.PARTICLES_DAMAGE,
				targetIds: [defender],
				amount: event.amount,
				sourceId: attacker,
			}),
			controllers.triggerUnit({
				type: UnitPreset.DASH,
				sourceId: defender,
				targetId: attacker,
				distancePx: -25,
				durationMs: 1000,
			}),
			controllers.triggerHpBar({
				type: HpBarPreset.SHOW_DAMAGE_PREVIEW,
				unitId: defender,
				damage: event.amount || 0,
			}),
		]);

		const unit = controllers.getUnitById(defender);
		let finalHealth;
		if (!!unit && !!event.amount)
			finalHealth = unit.currentHealth - event.amount;
		const isDead = !!finalHealth && finalHealth <= 0;

		await Promise.all([
			controllers.triggerSpriteAnimation({
				type: SpritePresets.MELEE,
				unitId: attacker,
				phase: AnimationPhase.FOLLOW_THROUGH,
			}),
			!isDead &&
				controllers.triggerUnit({
					type: UnitPreset.RESET,
					unitId: defender,
				}),
			controllers.triggerHpBar({
				type: HpBarPreset.DEPLETE_HP,
				unitId: defender,
			}),
		]);
	});

	animationRegistry.register(ActionType.COMBAT, async (event: GameEvent) => {
		const targetId = event.targetIds?.[0];
		if (!event.sourceId || !targetId) return;
		await controllers.triggerCamera({
			type: CameraPreset.ZOOM_TWO_TARGETS,
			targetIds: [event.sourceId, ...event.targetIds],
		});
		await Promise.all([
			controllers.triggerUnit({
				type: UnitPreset.FACE,
				sourceId: event.sourceId,
				targetId,
			}),
			controllers.triggerUnit({
				type: UnitPreset.FACE,
				sourceId: targetId,
				targetId: event.sourceId,
			}),
		]);
	});

	animationRegistry.register(
		ActionType.ABILITY_CAST,
		async (event: GameEvent) => {
			if (
				!event.sourceId ||
				!event.targetIds ||
				event.targetIds.length === 0
			)
				return;

			const casterId = event.sourceId;
			const victimsIds = event.targetIds;
			const caster = controllers.getUnitById(casterId);

			if (caster?.unitType === UnitType.PLAYER) {
				switch ((caster as Player)?.class) {
					case ClassTypes.MAGE:
						mageCast(casterId, victimsIds);
						break;
					case ClassTypes.WARRIOR:
						warriorCast(casterId, victimsIds[0]);
						break;
					case ClassTypes.ROGUE:
						rogueCast(casterId, victimsIds);
						break;
					case ClassTypes.HUNTER:
						hunterCast(casterId, victimsIds[0]);
						break;
					default:
						break;
				}
			}
		},
	);

	animationRegistry.register(ActionType.GAIN_XP, async (event: GameEvent) => {
		if (!event.sourceId && !event.targetIds) return;
		const deadUnit = controllers.getUnitById(event.targetIds[0]);
		const isEnemy = deadUnit?.unitType !== UnitType.PLAYER;
		if (isEnemy) {
			await controllers.triggerVfx({
				type: VfxTypes.EFFECTS_EXP,
				targetIds: event.targetIds,
				amount: event.amount,
			});
		}
		await controllers.triggerVfx({
			type: VfxTypes.STAT_EXP,
			targetIds: [event.sourceId],
			amount: event.amount,
		});
	});

	animationRegistry.register(ActionType.HEAL, async (event: GameEvent) => {
		if (!event.sourceId) return;
		controllers.triggerHpBar({
			type: HpBarPreset.DEPLETE_HP,
			unitId: event.sourceId,
		});
		await controllers.triggerVfx({
			type: VfxTypes.STAT_HEAL,
			targetIds: [event.sourceId],
			amount: event.amount,
		});
	});

	animationRegistry.register(
		ActionType.LEVEL_UP,
		async (event: GameEvent) => {
			if (!event.sourceId) return;
			await controllers.triggerVfx({
				type: VfxTypes.BANNER_LEVEL_UP,
				targetIds: [event.sourceId],
				amount: event.amount,
			});
		},
	);

	animationRegistry.register(ActionType.LOSE, async (event: GameEvent) => {
		if (!event.sourceId) return;
		await controllers.triggerCamera({ type: CameraPreset.ZOOM_IN });
		await controllers.triggerCamera({ type: CameraPreset.THUMP });
		await controllers.triggerVfx({
			type: VfxTypes.BANNER_LOSE,
			targetIds: [event.sourceId],
			amount: event.amount,
		});
	});

	animationRegistry.register(
		ActionType.NEXT_LEVEL,
		async (event: GameEvent) => {
			if (!event.sourceId) return;
		},
	);

	animationRegistry.register(
		ActionType.ROLL_ATTACK,
		async (event: GameEvent) => {
			if (!event.sourceId) return;
			await controllers.triggerVfx({
				type: VfxTypes.ROLL_ATTACK,
				targetIds: [event.sourceId],
				amount: event.amount,
			});
		},
	);

	animationRegistry.register(
		ActionType.ROLL_DEFENSE,
		async (event: GameEvent) => {
			if (!event.sourceId) return;
			await controllers.triggerVfx({
				type: VfxTypes.ROLL_DEFENSE,
				targetIds: [event.sourceId],
				amount: event.amount,
			});
		},
	);

	animationRegistry.register(
		ActionType.TAKE_DAMAGE,
		async (event: GameEvent) => {
			if (!event.sourceId) return;
			await controllers.triggerVfx({
				type: VfxTypes.STAT_DAMAGE,
				targetIds: [event.sourceId],
				amount: event.amount,
			});
		},
	);

	animationRegistry.register(
		ActionType.TAKE_DAMAGE_FROM_ABILITY,
		async (event: GameEvent) => {
			if (!event.sourceId) return;
			await Promise.all([
				controllers.triggerSpriteAnimation({
					type: SpritePresets.TAKE_DAMAGE,
					unitId: event.sourceId,
				}),
				controllers.triggerVfx({
					type: VfxTypes.STAT_DAMAGE,
					targetIds: [event.sourceId],
					amount: event.amount,
				}),
				controllers.triggerHpBar({
					type: HpBarPreset.SHOW_DAMAGE_PREVIEW,
					unitId: event.sourceId,
					damage: event.amount || 0,
				}),
			]);
			controllers.triggerHpBar({
				type: HpBarPreset.DEPLETE_HP,
				unitId: event.sourceId,
			});
		},
	);

	animationRegistry.register(ActionType.WIN, async (event: GameEvent) => {
		if (!event.sourceId) return;
	});

	const mageCast = (mage: string, targets: string[]) => {
		//ability cast
		//zoom in on mage
		//
		//play ability cast animation (loop)
		//play ice particle animations gather towards the wand
		//spawn black clouds at the top of the screen
		//make screen darker gradually
		//
		//zoom out to the mage's range sharply (mage still in center)
		//ice particles explode from the wand
		//all targets have growing ice at their feet
		//
		//blue lightning strikes them all one after the other (staggered)
		//(we don't wait for them to finish):
		//targets plays hit animation (windup)
		//ice hit vfx
		//---
		//target plays hit animation (follow through)
		//target shakes
		//target hp preview damage (in purple)
		//---
		//target hp drains
		//
		//clouds scatter
		//screen color return to normal
		//
		//----take damage from ability
		//display damage taken stat
	};

	const warriorCast = (warrior: string, target: string) => {
		//zoom in on the warrior
		//change screen to red hue
		//add ash and smoke particles flying
		//
		//play cast animation (windup)
		//dust fvx from the leap
		//warrior leaps in an arc to his target
		//(wait foe a few ms) then pan camera to enemy
		//
		//camera shakes
		//target rotates right (so they lay on their back)
		//target dash down a little bit
		//cast play animation (follow through)
		//ground breaking beneath them vfx
		//target plays hit animation (follow through)
		//target hp preview damage (in gold)
		//target play hit animation (follow through)
		//
		//warrior dashes back to his place
		//blood particles drip for the target
		//target hp drains
		//
		//heal vfx over the warrior
		//heal stat vfx
		//
		//target recovers and rotates back
	};

	const rogueCast = (rogue: string, targets: string[]) => {
		//de-saturates the map (except for the active layer) (make black and white)
		// play screen effects of ravens flying around
		//
		//zoom in on rogue
		//rogue - play animation (windup) (the rogue vanishes)
		//
		//dash the rogue to the air
		//
		//rogue - play animation (follow through) (the rogue reappears and he has a halo behind his as part of the animation then sharply throws his arms out as if throwing knives)
		//zoom out to the rogue's range
		//
		//projectile 4 round of knives on each enemy in range at the same time
		//
		//all the enemies:
		//hit animation (windup)
		//have white slash animation on top of them
		//gray hp preview
		//
		//recoil
		//hit animation (follow through)
		//splash blood particles
		//hp drain
		//
		//enemies recover
		//rogue dashes back to the original tile
		//camera restores to default, focusing on him
		//
		//return to idle
		//landing smoke vfx
	};

	const hunterCast = (hunter: string, target: string) => {
		//black letterbox bars at the top and bottom of the screen appear
		//play attack animation (windup) - the hunter jumps and charges their bow
		//ground smoke from the impact of jumping
		//white glowing arrow forming over the normal arrow
		//white swirl effect of the target enemy
		//camera pans up to match the jump
		//
		//the white arrow shoots as a projectile to the enemy
		//the camera pans + zooms to the enemy
		//
		//enemy recoils
		//plays follow through animation
		//splatters (white) blood
		//white hp preview
		//
		//enemy recovers
		//hunter returns to idle
		//landing smoke vfx
	};
};

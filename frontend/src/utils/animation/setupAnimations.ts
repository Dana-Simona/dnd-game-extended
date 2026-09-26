import { animationRegistry } from './animationRegistry';
import { ActionType, type GameEvent } from '../../constants/gameEvent';
import { type TriggerVfxAPI } from '../../constants/animationStates/vfxStates';
import {
	AnimationPhase,
	SpritePresets,
	type TriggerSpriteAnimationAPI,
} from '../../constants/animationStates/spriteStates';
import { UnitType, type Unit } from '../../constants/interfaces/unit';
import type {
	Hunter,
	Mage,
	Player,
	Rogue,
	Warrior,
} from '../../constants/interfaces/player';
import { ClassTypes } from '../../constants/classTypes';
import type { TriggerCameraAPI } from '../../constants/animationStates/cameraStates';
import type { TriggerHpBarAPI } from '../../constants/animationStates/hpStates';
import type { TriggerUnitAPI } from './useGameAnimation/unitControl/useUnitControl';
import {} from '../../constants/animationStates/vfxStates';

interface Controllers {
	triggerSpriteAnimation: TriggerSpriteAnimationAPI;
	triggerCamera: TriggerCameraAPI;
	triggerUnit: TriggerUnitAPI;
	triggerHpBar: TriggerHpBarAPI;
	triggerVfx: TriggerVfxAPI;
	getUnitById: (id: string) => Unit | undefined;
}

export const setupAnimations = (controllers: Controllers) => {
	animationRegistry.register(ActionType.MOVE, async (event: GameEvent) => {
		if (!event.sourceId) return;

		await controllers.triggerSpriteAnimation.move(event.sourceId);
	});

	animationRegistry.register(ActionType.DIE, async (event: GameEvent) => {
		if (!event.sourceId) return;

		controllers.triggerSpriteAnimation.die(event.sourceId);
		controllers.triggerSpriteAnimation.loop(
			event.sourceId,
			SpritePresets.DIE,
		);

		await new Promise((resolve) => setTimeout(resolve, 1000));
		await controllers.triggerUnit.fadeOut(event.sourceId, 400, 200);
	});

	animationRegistry.register(
		ActionType.MELEE,
		async (event: GameEvent, next: () => void) => {
			const defender = event.targetIds?.[0];
			const attacker = event.sourceId;
			if (!attacker || !defender) return;

			await Promise.all([
				controllers.triggerUnit.face(attacker, defender),
				controllers.triggerUnit.face(defender, attacker),
			]);

			await Promise.all([
				controllers.triggerSpriteAnimation.melee(
					attacker,
					AnimationPhase.WINDUP,
				),
				controllers.triggerSpriteAnimation.takeDamage(
					defender,
					AnimationPhase.WINDUP,
				),
			]);

			next();

			await controllers.triggerSpriteAnimation.melee(
				attacker,
				AnimationPhase.FOLLOW_THROUGH,
			);
		},
	);

	const handleKnockBackFromDamage = async (event: GameEvent) => {
		const defender = event.sourceId;
		const attacker = event.targetIds?.[0];
		const finalDamage = event.amount;

		if (!defender || !attacker || !finalDamage) return;

		await Promise.all([
			controllers.triggerSpriteAnimation.takeDamage(
				defender,
				AnimationPhase.FOLLOW_THROUGH,
			),
			controllers.triggerCamera.shake(),
			controllers.triggerVfx.bleed(attacker, defender),
			controllers.triggerUnit.dash(defender, attacker, -25, 1000),
			controllers.triggerHpBar.showDamagePreview(defender, finalDamage),
			controllers.triggerVfx.statDamage(defender, finalDamage),
		]);

		const unit = controllers.getUnitById(defender);
		const finalHealth = unit ? unit.currentHealth - finalDamage : null;
		const isDead = finalHealth !== null && finalHealth <= 0;

		await Promise.all([
			!isDead && controllers.triggerUnit.reset(defender),
			controllers.triggerHpBar.drainHp(defender),
		]);
	};

	animationRegistry.register(
		ActionType.TAKE_DAMAGE,
		handleKnockBackFromDamage,
	);

	animationRegistry.register(ActionType.COMBAT, async (event: GameEvent) => {
		const targetId = event.targetIds?.[0];
		if (!event.sourceId || !targetId) return;
		await controllers.triggerCamera.zoomTwoTargets(
			event.sourceId,
			targetId,
		);
		await Promise.all([
			controllers.triggerUnit.face(event.sourceId, targetId),
			controllers.triggerUnit.face(targetId, event.sourceId),
		]);
	});

	animationRegistry.register(
		ActionType.ABILITY_CAST,
		async (event: GameEvent) => {
			const casterId = event.sourceId;
			const victimsIds = event.targetIds;

			if (!casterId || !victimsIds || event.targetIds.length === 0)
				return;

			const caster = controllers.getUnitById(casterId);

			if (caster?.unitType === UnitType.PLAYER) {
				switch ((caster as Player)?.class) {
					case ClassTypes.MAGE:
						mageCast(caster as Mage, victimsIds);
						break;
					case ClassTypes.WARRIOR:
						warriorCast(caster as Warrior, victimsIds[0]);
						break;
					case ClassTypes.ROGUE:
						rogueCast(caster as Rogue, victimsIds);
						break;
					case ClassTypes.HUNTER:
						hunterCast(caster as Hunter, victimsIds[0]);
						break;
					default:
						break;
				}
			}
		},
	);

	animationRegistry.register(
		ActionType.TAKE_DAMAGE_FROM_ABILITY,
		async (event: GameEvent, next: () => void) => {
			const casterId = event.sourceId;
			const victimId = event.targetIds[0];
			const damageTaken = event.amount;

			if (!casterId || !victimId || !damageTaken) {
				next();
				return;
			}

			const caster = controllers.getUnitById(casterId);

			if (caster?.unitType === UnitType.PLAYER) {
				switch ((caster as Player)?.class) {
					case ClassTypes.MAGE:
						takeDamageFromMageCast(
							caster as Mage,
							victimId,
							damageTaken,
						);
						break;
					case ClassTypes.WARRIOR:
						takeDamageFromWarriorCast(
							caster as Warrior,
							victimId,
							damageTaken,
						);
						break;
					case ClassTypes.ROGUE:
						takeDamageFromRogueCast(
							caster as Rogue,
							victimId,
							damageTaken,
						);
						break;
					case ClassTypes.HUNTER:
						takeDamageFromHunterCast(
							caster as Hunter,
							victimId,
							damageTaken,
						);
						break;
					default:
						next();
						break;
				}
			} else {
				next();
			}
		},
	);

	animationRegistry.register(ActionType.GAIN_XP, async (event: GameEvent) => {
		if (!event.sourceId || !event.targetIds || !event.amount) return;
		const targetId = event.targetIds[0];
		const deadUnit = controllers.getUnitById(targetId);
		const isEnemy = deadUnit?.unitType !== UnitType.PLAYER;
		if (isEnemy) {
			await controllers.triggerVfx.expOrbs(targetId, event.amount);
		}
		await controllers.triggerVfx.statExp(event.sourceId, event.amount);
	});

	animationRegistry.register(ActionType.HEAL, async (event: GameEvent) => {
		if (!event.sourceId || !event.amount) return;
		controllers.triggerHpBar.drainHp(event.sourceId);
		await controllers.triggerVfx.statHeal(event.sourceId, event.amount);
	});

	animationRegistry.register(
		ActionType.LEVEL_UP,
		async (event: GameEvent) => {
			if (!event.sourceId || !event.amount) return;
			await controllers.triggerVfx.bannerLevelUp(event.amount);
		},
	);

	animationRegistry.register(ActionType.LOSE, async (event: GameEvent) => {
		if (!event.sourceId || !event.amount) return;
		await controllers.triggerCamera.zoomIn();
		await controllers.triggerCamera.thump();
		await controllers.triggerVfx.bannerLose(event.amount);
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
			if (!event.sourceId || !event.amount) return;
			await controllers.triggerVfx.rollAttack(
				event.sourceId,
				event.amount,
			);
		},
	);

	animationRegistry.register(
		ActionType.ROLL_DEFENSE,
		async (event: GameEvent) => {
			if (!event.sourceId || !event.amount) return;
			await controllers.triggerVfx.rollDefense(
				event.sourceId,
				event.amount,
			);
		},
	);

	animationRegistry.register(ActionType.WIN, async (event: GameEvent) => {
		if (!event.sourceId) return;
	});

	const delay = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	const mageCast = async (mage: Mage, targets: string[]) => {
		const mageId = mage.id;

		await Promise.all([
			controllers.triggerSpriteAnimation.loop(
				mageId,
				SpritePresets.ABILITY_CAST,
			),
			controllers.triggerCamera.zoomIn(mageId),
		]);

		// play ice particle animations gather towards the wand
		// spawn black clouds at the top of the screen
		// make screen darker gradually
		await Promise.all([
			controllers.triggerVfx.iceGather(mageId),
			controllers.triggerVfx.blackClouds(true),
			controllers.triggerVfx.screenDarken(1000),
		]);

		await delay(500);

		// zoom out to the mage's range sharply (mage still in center)
		// ice particles explode from the wand
		// all targets have growing ice at their feet
		await Promise.all([
			controllers.triggerCamera.zoomToRange(mage.range),
			controllers.triggerVfx.iceExplode(mageId),
			...targets.map((target) => controllers.triggerVfx.iceFeet(target)),
		]);

		await delay(300);

		// blue lightning strikes them all one after the other (staggered)
		// (we don't wait for them to finish):
		targets.forEach((target, index) => {
			setTimeout(async () => {
				// target plays hit animation (windup) & ice hit vfx
				await Promise.all([
					controllers.triggerVfx.lightningStrike(target),
					controllers.triggerVfx.iceHit(target),
					controllers.triggerSpriteAnimation.takeDamage(
						target,
						AnimationPhase.WINDUP,
					),
				]);

				// ---
				// target plays hit animation (follow through)
				// target shakes (via camera shake slightly on impact)
				// target hp preview damage (in purple)
				await Promise.all([
					controllers.triggerSpriteAnimation.takeDamage(
						target,
						AnimationPhase.FOLLOW_THROUGH,
					),
					controllers.triggerCamera.shake(2, 100),
					controllers.triggerHpBar.showDamagePreview(
						target,
						0, //todo: damage amount
						'purple',
					),
				]);

				await delay(200);

				// ---
				// target hp drains
				// display damage taken stat
				controllers.triggerHpBar.drainHp(target);
				await controllers.triggerVfx.statDamage(
					target,
					0, //todo: damage amount
				);

				await controllers.triggerSpriteAnimation.idle(target);
			}, index * 150); // 150ms stagger between strikes
		});

		// Wait enough time for staggered animations to begin before clearing environment
		await delay(targets.length * 150 + 500);

		// clouds scatter, screen color return to normal, mage to idle
		await Promise.all([
			controllers.triggerVfx.blackClouds(false),
			controllers.triggerVfx.screenRestoreColor(1000),
			controllers.triggerSpriteAnimation.stopLoop(mageId),
		]);
	};

	const warriorCast = async (warrior: Warrior, target: string) => {
		const warriorId = warrior.id;

		// zoom in on the warrior
		// change screen to red hue
		// add ash and smoke particles flying
		await Promise.all([
			controllers.triggerCamera.zoomIn(warriorId),
			controllers.triggerVfx.screenRedHue(500),
			controllers.triggerVfx.ashSmokeAmbient(true),
		]);

		// play cast animation (windup)
		// dust fvx from the leap
		// warrior leaps in an arc to his target
		await Promise.all([
			controllers.triggerSpriteAnimation.abilityCast(
				warriorId,
				AnimationPhase.WINDUP,
			),
			controllers.triggerVfx.dustLeap(warriorId),
			controllers.triggerUnit.jump(warriorId, target, 100, 400),
		]);

		// (wait for a few ms) then pan camera to enemy
		await delay(300);
		await controllers.triggerCamera.focusTarget(target, 200);

		// camera shakes
		// target rotates right (so they lay on their back)
		// target dash down a little bit (simulating knock-down)
		// cast play animation (follow through)
		// ground breaking beneath them vfx
		await Promise.all([
			controllers.triggerCamera.shake(5, 300),
			controllers.triggerUnit.rotate(target, 90, 150),
			controllers.triggerUnit.dash(target, target, 10, 100),
			controllers.triggerSpriteAnimation.abilityCast(
				warriorId,
				AnimationPhase.FOLLOW_THROUGH,
			),
			controllers.triggerVfx.groundBreak(target),
		]);

		// target plays hit animation
		// target hp preview damage (in gold)
		await Promise.all([
			controllers.triggerSpriteAnimation.takeDamage(
				target,
				AnimationPhase.FOLLOW_THROUGH,
			),
			controllers.triggerHpBar.showDamagePreview(
				target,
				0, //todo: damage amount
				'gold',
			),
		]);

		await delay(400);

		// warrior dashes back to his place
		// blood particles drip for the target
		// target hp drains
		await Promise.all([
			controllers.triggerUnit.reset(warriorId),
			controllers.triggerVfx.bloodDrip(target),
			controllers.triggerHpBar.drainHp(target),
			controllers.triggerVfx.statDamage(
				target,
				0, //todo: damage amount
			),
		]);

		// heal vfx over the warrior
		// heal stat vfx
		await Promise.all([
			controllers.triggerVfx.statHeal(
				warriorId,
				0, //todo: heal amount
			),
			// Additional generic heal VFX if applicable could go here
		]);

		// target recovers and rotates back
		// cleanup camera & environment
		await Promise.all([
			controllers.triggerUnit.rotate(target, 0, 300),
			controllers.triggerSpriteAnimation.idle(target),
			controllers.triggerSpriteAnimation.idle(warriorId),
			controllers.triggerCamera.reset(500),
			controllers.triggerVfx.screenRestoreColor(500),
			controllers.triggerVfx.ashSmokeAmbient(false),
		]);
	};

	const rogueCast = async (rogue: Rogue, targets: string[]) => {
		const rogueId = rogue.id;

		// de-saturates the map (except for the active layer) (make black and white)
		// play screen effects of ravens flying around
		// zoom in on rogue
		await Promise.all([
			controllers.triggerVfx.screenDesaturate(true),
			controllers.triggerVfx.ravensFlying(2000),
			controllers.triggerCamera.zoomIn(rogueId, 1.5, 300),
		]);

		// rogue - play animation (windup) (the rogue vanishes)
		await Promise.all([
			controllers.triggerSpriteAnimation.abilityCast(
				rogueId,
				AnimationPhase.WINDUP,
			),
			controllers.triggerUnit.fadeOut(rogueId, 0, 200),
		]);

		// dash the rogue to the air
		await controllers.triggerUnit.leap(rogueId, 150, 300);

		// rogue - play animation (follow through) (the rogue reappears and throws arms out)
		// zoom out to the rogue's range
		await Promise.all([
			controllers.triggerUnit.fadeIn(rogueId, 0, 100),
			controllers.triggerSpriteAnimation.abilityCast(
				rogueId,
				AnimationPhase.FOLLOW_THROUGH,
			),
			controllers.triggerCamera.zoomToRange(rogue.range),
		]);

		// projectile 4 round of knives on each enemy in range at the same time
		const knifePromises = [];
		for (let i = 0; i < 4; i++) {
			knifePromises.push(
				...targets.map((target) =>
					controllers.triggerVfx.knivesProjectile(rogueId, target),
				),
			);
		}
		await Promise.all(knifePromises);

		// all the enemies: hit windup, slash animation, gray hp preview
		await Promise.all(
			targets.map(async (target) => {
				await Promise.all([
					controllers.triggerSpriteAnimation.takeDamage(
						target,
						AnimationPhase.WINDUP,
					),
					controllers.triggerVfx.slash(target),
					controllers.triggerHpBar.showDamagePreview(
						target,
						0, //todo: damage amount
						'gray',
					),
				]);
			}),
		);

		// recoil (minor camera thump), hit animation follow through, splash blood
		await controllers.triggerCamera.thump(3, 150);
		await Promise.all(
			targets.map(async (target) => {
				await Promise.all([
					controllers.triggerSpriteAnimation.takeDamage(
						target,
						AnimationPhase.FOLLOW_THROUGH,
					),
					controllers.triggerVfx.bleed(rogueId, target),
					controllers.triggerHpBar.drainHp(target),
					controllers.triggerVfx.statDamage(
						target,
						0, //todo: damage amount
					),
				]);
			}),
		);

		await delay(300);

		// enemies recover
		// rogue dashes back to the original tile
		// camera restores to default, focusing on him
		await Promise.all([
			...targets.map((target) =>
				controllers.triggerSpriteAnimation.idle(target),
			),
			controllers.triggerUnit.reset(rogueId),
			controllers.triggerCamera.reset(400),
		]);

		// return to idle
		// landing smoke vfx
		// restore color
		await Promise.all([
			controllers.triggerSpriteAnimation.idle(rogueId),
			controllers.triggerVfx.landingDust(rogueId),
			controllers.triggerVfx.screenRestoreColor(400),
		]);
	};

	const hunterCast = async (hunter: Hunter, target: string) => {
		const hunterId = hunter.id;

		// black letterbox bars at the top and bottom of the screen appear
		await controllers.triggerVfx.letterbox(true);

		// play attack animation (windup) - the hunter jumps and charges their bow
		// ground smoke from the impact of jumping
		// white swirl effect of the target enemy
		// camera pans up to match the jump
		await Promise.all([
			controllers.triggerSpriteAnimation.abilityCast(
				hunterId,
				AnimationPhase.WINDUP,
			),
			controllers.triggerUnit.leap(hunterId, 80, 300),
			controllers.triggerVfx.dustLeap(hunterId),
			controllers.triggerVfx.targetSwirl(target),
			controllers.triggerCamera.focusTarget(hunterId, 300),
		]);

		await delay(200);

		// the white arrow shoots as a projectile to the enemy
		// the camera pans + zooms to the enemy
		await Promise.all([
			controllers.triggerVfx.arrowProjectile(hunterId, target),
			controllers.triggerCamera.zoomIn(target, 1.5, 200),
		]);

		// enemy recoils
		// plays follow through animation
		// splatters (white) blood
		// white hp preview
		await Promise.all([
			controllers.triggerSpriteAnimation.takeDamage(
				target,
				AnimationPhase.WINDUP,
			),
			controllers.triggerSpriteAnimation.takeDamage(
				target,
				AnimationPhase.FOLLOW_THROUGH,
			),
			controllers.triggerVfx.bloodDrip(target),
			controllers.triggerHpBar.showDamagePreview(
				target,
				0, //todo: damage amount
				'white',
			),
		]);

		await delay(200);

		// enemy recovers & HP drains
		// hunter returns to idle & returns to ground
		// landing smoke vfx
		// remove letterbox
		await Promise.all([
			controllers.triggerHpBar.drainHp(target),
			controllers.triggerVfx.statDamage(
				target,
				0, //todo: damage amount
			),
			controllers.triggerSpriteAnimation.idle(target),

			controllers.triggerUnit.reset(hunterId),
			controllers.triggerSpriteAnimation.idle(hunterId),
			controllers.triggerVfx.landingDust(hunterId),
			controllers.triggerCamera.reset(400),
			controllers.triggerVfx.letterbox(false),
		]);
	};
};

const takeDamageFromMageCast = async (
	mage: Mage,
	victimId: string,
	damageTaken: number,
) => {};

const takeDamageFromWarriorCast = async (
	warrior: Warrior,
	victimId: string,
	damageTaken: number,
) => {};

const takeDamageFromRogueCast = async (
	rogue: Rogue,
	victimId: string,
	damageTaken: number,
) => {};

const takeDamageFromHunterCast = async (
	hunter: Hunter,
	victimId: string,
	damageTaken: number,
) => {};

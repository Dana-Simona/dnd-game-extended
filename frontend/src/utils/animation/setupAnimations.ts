import { ClassTypes } from '../../constants/classTypes';
import { ActionType, type GameEvent } from '../../constants/gameEvent';
import {
	ARROW_FLIGHT_MS,
	ARROW_HOLD_MS,
	LEVEL_TRANSITION_MS,
	NEXT_LEVEL_BANNER_MS,
	type TriggerVfxAPI,
} from '../../constants/animationStates/vfxStates';
import type { TriggerHpBarAPI } from '../../constants/animationStates/hpStates';
import type { TriggerUnitAPI } from '../../constants/animationStates/unitStates';
import type { TriggerCameraAPI } from '../../constants/animationStates/cameraStates';
import type { TriggerBossAPI } from '../../constants/animationStates/bossStates';
import { animationRegistry } from './animationRegistry';
import { hasAnimation } from './spriteAnimations';
import {
	SoundPreset,
	type TriggerSoundAPI,
} from '../../constants/animationStates/soundStates';
import {
	AnimationPhase,
	SpritePresets,
	type TriggerSpriteAnimationAPI,
} from '../../constants/animationStates/spriteStates';
import { UnitType, type Unit } from '../../constants/interfaces/unit';
import type { Boss, Trap } from '../../constants/interfaces/monster';
import type {
	Hunter,
	Mage,
	Player,
	Rogue,
	Warrior,
} from '../../constants/interfaces/player';

interface Controllers {
	triggerSpriteAnimation: TriggerSpriteAnimationAPI;
	triggerCamera: TriggerCameraAPI;
	triggerUnit: TriggerUnitAPI;
	triggerHpBar: TriggerHpBarAPI;
	triggerVfx: TriggerVfxAPI;
	triggerSound: TriggerSoundAPI;
	triggerBoss: TriggerBossAPI;
	getUnitById: (id: string) => Unit | undefined;
}

const DEATH_LOOP_HOLD_MS = 250;
const DEATH_FADE_MS = 400;

const BOSS_SPAWN_FADE_MS = 600;
const BOSS_SPAWN_SHAKE_DELAY_MS = 450;

const HUNTER_LEAP_MS = 500;
const HUNTER_LEAP_HEIGHT_PX = 50;
const HUNTER_LEAP_HORIZONTAL_OFFSET = 20;
const HUNTER_CAMERA_PAN_TO_ENEMY_MS = 450;
const HUNTER_THUMP_DELAY_MS = 200;
const HUNTER_THUMP_MS = 450;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const setupAnimations = (controllers: Controllers) => {
	const isTrap = (id?: string) =>
		!!id && controllers.getUnitById(id)?.unitType === UnitType.TRAP;

	const revealIfHiddenTrap = async (...ids: (string | undefined)[]) => {
		await Promise.all(
			ids.map(async (id) => {
				if (!id || !isTrap(id)) return;
				const trap = controllers.getUnitById(id) as Trap;
				if (trap.isVisible) return;
				await controllers.triggerUnit.reveal(id);
			}),
		);
	};

	animationRegistry.register(ActionType.MOVE, async (event: GameEvent) => {
		if (!event.sourceId) return;
		const unit = controllers.getUnitById(event.sourceId);
		const player = unit?.unitType === UnitType.PLAYER && (unit as Player);

		await Promise.all([
			controllers.triggerSpriteAnimation.move(event.sourceId),
			(async () => {
				if (!!player) {
					await delay(350);
					if (player.class === ClassTypes.WARRIOR) await delay(500);
					controllers.triggerSound.play(SoundPreset.MOVE);
				}
			})(),
		]);
	});

	animationRegistry.register(
		ActionType.DIE,
		async (event: GameEvent, skip: (steps?: number) => void) => {
			const unitId = event.sourceId;
			if (!unitId) return;
			const isBoss =
				controllers.getUnitById(unitId)?.unitType === UnitType.BOSS;

			controllers.triggerSound.play(SoundPreset.ENEMY_DIE);
			await controllers.triggerSpriteAnimation.loop(
				unitId,
				SpritePresets.DIE,
			);

			await delay(DEATH_LOOP_HOLD_MS);
			await Promise.all([
				controllers.triggerUnit.fadeOut(unitId, 0, DEATH_FADE_MS),
				isBoss && controllers.triggerBoss.hideHealthBar(),
			]);
		},
	);

	animationRegistry.register(
		ActionType.BOSS_LEVEL,
		async (event: GameEvent) => {
			const bossId = event.sourceId;
			const playerId = event.targetIds?.[0];
			if (!bossId) return;

			if (playerId) {
				await controllers.triggerCamera.focusTarget(playerId, 300);
			}
			await delay(400);
			await controllers.triggerCamera.zoomIn(bossId, 3, 1200);

			const boss = controllers.getUnitById(bossId);
			const hasSpawnSprite =
				!!boss && hasAnimation(boss, SpritePresets.SPAWN);

			await Promise.all([
				(async () => {
					await delay(250);
					await Promise.all([
						hasSpawnSprite
							? (async () => {
									await controllers.triggerUnit.fadeIn(
										bossId,
										0,
										1,
									);
									await controllers.triggerSpriteAnimation.spawn(
										bossId,
									);
								})()
							: controllers.triggerUnit.fadeIn(
									bossId,
									0,
									BOSS_SPAWN_FADE_MS,
								),
						controllers.triggerCamera.shake(16, 6, 3000),

						(async () => {
							await delay(BOSS_SPAWN_SHAKE_DELAY_MS);
							await Promise.all([
								controllers.triggerUnit.shake(bossId, 4, 900),
							]);
						})(),
					]);
				})(),
			]);

			await controllers.triggerBoss.showHealthBar(bossId);
			await delay(300);

			await controllers.triggerCamera.reset(800);
		},
	);

	animationRegistry.register(
		ActionType.MELEE,
		async (event: GameEvent, skip: (steps?: number) => void) => {
			const defender = event.targetIds?.[0];
			const attacker = event.sourceId;
			if (!attacker || !defender) return;

			await revealIfHiddenTrap(attacker, defender);

			const unit = controllers.getUnitById(attacker);
			const player =
				unit?.unitType === UnitType.PLAYER ? (unit as Player) : null;

			await Promise.all([
				controllers.triggerUnit.face(attacker, defender),
				controllers.triggerUnit.face(defender, attacker),
			]);

			const attackerAnimationDuration =
				controllers.triggerSpriteAnimation.getDuration(
					attacker,
					SpritePresets.MELEE,
					AnimationPhase.WINDUP,
				);
			const defenderAnimationDuration =
				controllers.triggerSpriteAnimation.getDuration(
					defender,
					SpritePresets.TAKE_DAMAGE,
					AnimationPhase.WINDUP,
				);

			const delayDuration =
				attackerAnimationDuration - defenderAnimationDuration - 300;

			if (unit?.unitType === UnitType.TRAP) {
				const strike = controllers.triggerUnit.plantAttack(
					attacker,
					defender,
					1000,
				);
				await Promise.all([
					delay(300),
					controllers.triggerSound.play(SoundPreset.SWISH_SHORT),
					controllers.triggerSpriteAnimation.takeDamage(
						defender,
						AnimationPhase.WINDUP,
					),
				]);
				controllers.triggerSound.play(SoundPreset.ENEMY_MELEE);
				skip();
				await strike;
				return;
			}

			if (!!player && player.class === ClassTypes.WARRIOR) {
				controllers.triggerSound.play(SoundPreset.WARRIOR_MELEE_START);
			} else {
				controllers.triggerSound.play(SoundPreset.SWISH_SHORT);
			}

			await Promise.all([
				controllers.triggerSpriteAnimation.melee(
					attacker,
					AnimationPhase.WINDUP,
				),
				async () => {
					if (delayDuration > 0) {
						await delay(delayDuration);
					}
					controllers.triggerSpriteAnimation.takeDamage(
						defender,
						AnimationPhase.WINDUP,
					);
				},
			]);

			if (!player) {
				controllers.triggerSound.play(SoundPreset.ENEMY_MELEE);
			} else {
				switch (player.class) {
					case ClassTypes.MAGE:
						controllers.triggerSound.play(SoundPreset.MAGE_MELEE);
						break;
					case ClassTypes.HUNTER:
						controllers.triggerSound.play(SoundPreset.HUNTER_MELEE);
						break;
					case ClassTypes.WARRIOR:
						controllers.triggerSound.play(
							SoundPreset.WARRIOR_MELEE_END,
						);
						break;
					default:
						break;
				}
			}
		},
	);

	const handleKnockBackFromDamage = async (event: GameEvent) => {
		const defender = event.sourceId;
		const attacker = event.targetIds?.[0];
		const finalDamage = event.amount;

		if (!defender || !attacker || !finalDamage) return;
		await revealIfHiddenTrap(attacker, defender);
		const unit = controllers.getUnitById(defender);
		const defenderIsTrap = unit?.unitType === UnitType.TRAP;
		const finalHealth = unit ? unit.currentHealth - finalDamage : null;
		const isDead = finalHealth !== null && finalHealth <= 0;

		controllers.triggerSound.play(SoundPreset.KNOCKBACK);
		if (unit?.unitType === UnitType.PLAYER) {
			switch ((unit as Player).class) {
				case ClassTypes.MAGE:
					controllers.triggerSound.play(SoundPreset.MAGE_GRUNT);
					break;
				case ClassTypes.HUNTER:
					controllers.triggerSound.play(SoundPreset.HUNTER_GRUNT);
					break;
				case ClassTypes.WARRIOR:
					controllers.triggerSound.play(SoundPreset.WARRIOR_GRUNT);
					break;
			}
		}

		await Promise.all([
			controllers.triggerSpriteAnimation.takeDamage(
				defender,
				AnimationPhase.FOLLOW_THROUGH,
			),
			controllers.triggerCamera.shake(),
			controllers.triggerVfx.bleed(attacker, defender),
			defenderIsTrap
				? controllers.triggerUnit.plantRecoil(defender, attacker, 1000)
				: controllers.triggerUnit.dash(defender, attacker, -25, 1000),
			controllers.triggerHpBar.showDamagePreview(defender, finalDamage),
			controllers.triggerVfx.statDamage(defender, finalDamage),
			await controllers.triggerSpriteAnimation.melee(
				attacker,
				AnimationPhase.FOLLOW_THROUGH,
			),
		]);

		await Promise.all([
			!isDead && controllers.triggerUnit.reset(defender),
			controllers.triggerHpBar.drainHp(defender),
		]);

		controllers.triggerSound.stopAll();
	};

	animationRegistry.register(
		ActionType.TAKE_DAMAGE,
		handleKnockBackFromDamage,
	);

	animationRegistry.register(ActionType.COMBAT, async (event: GameEvent) => {
		const targetId = event.targetIds?.[0];
		if (!event.sourceId || !targetId) return;
		await Promise.all([
			controllers.triggerCamera.zoomTwoTargets(event.sourceId, targetId),
			revealIfHiddenTrap(event.sourceId, targetId),
		]);
		await Promise.all([
			controllers.triggerUnit.face(event.sourceId, targetId),
			controllers.triggerUnit.face(targetId, event.sourceId),
		]);
	});

	animationRegistry.register(
		ActionType.ABILITY_CAST,
		async (event: GameEvent, skip: (steps?: number) => void) => {
			const casterId = event.sourceId;
			const victimsIds = event.targetIds;

			if (!casterId || !victimsIds || victimsIds.length === 0) {
				skip();
				return;
			}

			const caster = controllers.getUnitById(casterId);

			if (caster?.unitType === UnitType.PLAYER) {
				switch ((caster as Player)?.class) {
					case ClassTypes.MAGE:
						await mageCast(caster as Mage, victimsIds, skip);
						break;
					case ClassTypes.WARRIOR:
						await warriorCast(
							caster as Warrior,
							victimsIds[0],
							skip,
						);
						break;
					case ClassTypes.ROGUE:
						await rogueCast(caster as Rogue, victimsIds, skip);
						break;
					case ClassTypes.HUNTER:
						await hunterCast(caster as Hunter, victimsIds[0], skip);
						break;
					default:
						skip();
						break;
				}
			} else if (caster?.unitType === UnitType.BOSS) {
				await bossCast(caster as Boss, victimsIds[0], skip);
			} else {
				skip();
			}
		},
	);

	animationRegistry.register(
		ActionType.TAKE_DAMAGE_FROM_ABILITY,
		async (event: GameEvent, skip: (steps?: number) => void) => {
			const victimId = event.sourceId;
			const casterId = event.targetIds[0];
			const damageTaken = event.amount;

			if (
				!casterId ||
				!victimId ||
				damageTaken === null ||
				damageTaken === undefined
			) {
				skip();
				return;
			}

			await revealIfHiddenTrap(victimId);

			const caster = controllers.getUnitById(casterId);

			if (caster?.unitType === UnitType.PLAYER) {
				switch ((caster as Player)?.class) {
					case ClassTypes.MAGE:
						await takeDamageFromMageCast(
							victimId,
							damageTaken,
							skip,
						);
						break;
					case ClassTypes.WARRIOR:
						await takeDamageFromWarriorCast(
							casterId,
							victimId,
							damageTaken,
							skip,
						);
						break;
					case ClassTypes.ROGUE:
						await takeDamageFromRogueCast(
							casterId,
							victimId,
							damageTaken,
						);
						break;
					case ClassTypes.HUNTER:
						await takeDamageFromHunterCast(
							casterId,
							victimId,
							damageTaken,
						);
						break;
					default:
						skip();
						break;
				}
			} else {
				skip();
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
		controllers.triggerSound.play(SoundPreset.EXP);
		await controllers.triggerVfx.statExp(event.sourceId, event.amount);
	});

	animationRegistry.register(ActionType.HEAL, async (event: GameEvent) => {
		if (
			!event.sourceId ||
			event.amount === null ||
			event.amount === undefined
		)
			return;

		await Promise.all([
			controllers.triggerVfx.effectHeal(event.sourceId),
			controllers.triggerVfx.statHeal(event.sourceId, event.amount),
			controllers.triggerSound.play(SoundPreset.HEAL),
		]);
	});

	animationRegistry.register(
		ActionType.LEVEL_UP,
		async (event: GameEvent) => {
			if (!event.sourceId || !event.amount) return;
			await controllers.triggerVfx.bannerLevelUp(event.amount);
		},
	);

	animationRegistry.register(ActionType.LOSE, async (event: GameEvent) => {
		await controllers.triggerCamera.zoomIn();
		await controllers.triggerCamera.thump();
		await controllers.triggerVfx.bannerLose(event.amount || 0);
	});

	animationRegistry.register(
		ActionType.NEXT_LEVEL,
		async (event: GameEvent) => {
			const nextLevel = event.amount || 1;

			await Promise.all([
				controllers.triggerVfx.bannerNextLevel(nextLevel),
				(async () => {
					await delay(NEXT_LEVEL_BANNER_MS - LEVEL_TRANSITION_MS);
					await controllers.triggerVfx.levelTransition(
						true,
						nextLevel,
					);
				})(),
			]);
		},
	);

	animationRegistry.register(
		ActionType.ROLL_ATTACK,
		async (event: GameEvent) => {
			if (!event.sourceId) return;
			await controllers.triggerVfx.rollAttack(
				event.sourceId,
				event.amount || 0,
			);
		},
	);

	animationRegistry.register(
		ActionType.ROLL_DEFENSE,
		async (event: GameEvent) => {
			if (!event.sourceId) return;
			controllers.triggerSound.play(SoundPreset.ROLL);
			await controllers.triggerVfx.rollDefense(
				event.sourceId,
				event.amount || 0,
			);
		},
	);

	animationRegistry.register(ActionType.WIN, async (event: GameEvent) => {
		if (!event.sourceId) return;
	});

	const mageCast = async (
		mage: Mage,
		targets: string[],
		skip: (steps?: number) => void,
	) => {
		const mageId = mage.id;

		await Promise.all([
			controllers.triggerSpriteAnimation.loop(
				mageId,
				SpritePresets.ABILITY_CAST,
			),
			controllers.triggerSound.play(SoundPreset.MAGE_RAISE_WAND),
			controllers.triggerSound.play(SoundPreset.MAGE_BLIZZARD_STORM),
			controllers.triggerCamera.zoomIn(mageId),
			(async () => {
				await delay(1000);
				controllers.triggerCamera.shake(30, 1);
			})(),
			(async () => {
				await delay(1000);
				controllers.triggerVfx.iceGather(mageId);
				controllers.triggerSound.play(SoundPreset.MAGE_WAND_CHARGE);
				controllers.triggerVfx.blackClouds(true);
				controllers.triggerVfx.screenDarken(1000);
			})(),
		]);

		await delay(500);

		await Promise.all([
			controllers.triggerCamera.zoomToRange(mage.range),
			controllers.triggerSound.play(SoundPreset.MAGE_RAISE_WAND_BURST),
			controllers.triggerSound.stop(SoundPreset.MAGE_RAISE_WAND),
			controllers.triggerVfx.iceExplode(mageId),
			...targets.map(
				(target) => controllers.triggerVfx.toggleIceFeet(target, true),
				controllers.triggerSound.play(SoundPreset.MAGE_ICE_FEET),
			),
		]);

		await delay(300);

		skip(1);
		controllers.triggerSound.play(SoundPreset.MAGE_ICE_FEET);

		await delay(targets.length * 1000 + 1000);
		await Promise.all([
			controllers.triggerVfx.blackClouds(false),
			controllers.triggerVfx.screenRestoreColor(1000),
			controllers.triggerSpriteAnimation.stopLoop(mageId),
		]);
		await controllers.triggerSound.stopAll();
		await Promise.all([
			...targets.map((target) =>
				controllers.triggerSpriteAnimation.takeDamage(
					target,
					AnimationPhase.FOLLOW_THROUGH,
				),
			),
		]);
	};

	const warriorCast = async (
		warrior: Warrior,
		target: string,
		skip: (steps?: number) => void,
	) => {
		const warriorId = warrior.id;

		await Promise.all([
			controllers.triggerCamera.zoomIn(warriorId, 5),
			controllers.triggerVfx.screenRedHue(500),
			controllers.triggerVfx.ashSmokeAmbient(true),
			controllers.triggerSound.play(SoundPreset.WARRIOR_FIRE_TRANSITION),
			controllers.triggerSound.play(SoundPreset.WARRIOR_FIRE_AMBIANCE),
		]);

		await delay(500);

		const castDuration = controllers.triggerSpriteAnimation.getDuration(warriorId, SpritePresets.ABILITY_CAST, AnimationPhase.WINDUP);

		await Promise.all([
			controllers.triggerCamera.zoomIn(warriorId, 3),
			controllers.triggerCamera.focusTarget(target, 200),
			controllers.triggerSpriteAnimation.abilityCast(
				warriorId,
				AnimationPhase.WINDUP,
			),
			controllers.triggerSound.play(SoundPreset.SWISH_BIG),
			controllers.triggerVfx.dustLeap(warriorId),
			
			controllers.triggerUnit.jump(warriorId, target, 50, castDuration - 700),
			(async () => {
				await delay(500);
				controllers.triggerCamera.zoomIn(warriorId, 5);
				controllers.triggerUnit.rotate(target, 90, 150, warriorId);
				controllers.triggerUnit.dashBy(target, -30, 0, 100);
			})(),
			(async () => {
				await delay(1000);
				controllers.triggerSound.play(SoundPreset.WARRIOR_STAB);
			})(),
		]);

		controllers.triggerSound.play(SoundPreset.WARRIOR_SLAM);
		await delay(100);
		controllers.triggerCamera.shake(5, 3);
		controllers.triggerVfx.groundBreak(target);
		controllers.triggerVfx.bloodDrip(target);

		await delay(1000);
		skip();

		await controllers.triggerSpriteAnimation.abilityCast(
			warriorId,
			AnimationPhase.FOLLOW_THROUGH, //loop only
		);
	};

	const rogueCast = async (
		rogue: Rogue,
		targets: string[],
		skip: (steps?: number) => void,
	) => {
		const rogueId = rogue.id;

		// de-saturates the map (except for the active layer) (make black and white)
		// play screen effects of ravens flying around
		// zoom in on rogue
		await Promise.all([
			controllers.triggerVfx.screenDesaturate(),
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
		// await controllers.triggerUnit.leap(rogueId, 150);

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

	const hunterCast = async (
		hunter: Hunter,
		target: string,
		skip: (steps?: number) => void,
	) => {
		const hunterId = hunter.id;

		await controllers.triggerCamera.zoomIn(hunterId);
		await controllers.triggerVfx.letterbox(true);
		controllers.triggerSound.play(SoundPreset.HUNTER_BOW);

		const airborne = controllers.triggerUnit.leapOffset(
			hunterId,
			target,
			HUNTER_LEAP_HEIGHT_PX,
			HUNTER_LEAP_HORIZONTAL_OFFSET,
		) ?? { x: 0, y: 0 };

		await Promise.all([
			controllers.triggerSpriteAnimation.abilityCast(
				hunterId,
				AnimationPhase.LOOP,
			),
			controllers.triggerSound.play(SoundPreset.SWISH_BIG),
			controllers.triggerUnit.leap(
				hunterId,
				target,
				HUNTER_LEAP_HEIGHT_PX,
				HUNTER_LEAP_HORIZONTAL_OFFSET,
				HUNTER_LEAP_MS,
			),
			controllers.triggerCamera.focusTarget(
				hunterId,
				HUNTER_LEAP_MS,
				airborne,
			),
			controllers.triggerVfx.dustLeap(hunterId),
			controllers.triggerVfx.toggleTargetSwirl(target, true),
		]);

		const arrowDone = controllers.triggerVfx.arrowProjectile(
			hunterId,
			target,
			{
				sourceOffset: airborne,
				holdMs: ARROW_HOLD_MS,
				flightMs: ARROW_FLIGHT_MS,
			},
		);
		controllers.triggerUnit.shake(hunterId, 5, 1, ARROW_HOLD_MS);
		await controllers.triggerCamera.shake(40, 1, ARROW_HOLD_MS + 200);

		skip();

		const panToEnemy = controllers.triggerCamera.focusTarget(
			target,
			HUNTER_CAMERA_PAN_TO_ENEMY_MS,
		);
		await delay(HUNTER_THUMP_DELAY_MS);
		await controllers.triggerCamera.thump(12, HUNTER_THUMP_MS);
		await Promise.all([panToEnemy, arrowDone]);
	};

	const bossCast = async (
		boss: Boss,
		target: string,
		skip: (steps?: number) => void,
	) => {
		controllers.triggerSpriteAnimation.abilityCast(boss.id);
		controllers.triggerVfx.bossSpell(target);
	};

	const takeDamageFromMageCast = async (
		victim: string,
		damageTaken: number,
		skip: (steps?: number) => void,
	) => {
		await Promise.all([
			controllers.triggerSpriteAnimation.takeDamage(
				victim,
				AnimationPhase.WINDUP,
			),
			controllers.triggerVfx.lightningStrike(victim),
			controllers.triggerSound.play(SoundPreset.MAGE_BLIZZARD_HIT),
			(async () => {
				await delay(200);
				controllers.triggerUnit.shake(victim, 10);
				controllers.triggerHpBar.showDamagePreview(
					victim,
					damageTaken,
					'#cc98ff',
				);
			})(),
		]);

		await Promise.all([
			controllers.triggerVfx.toggleIceFeet(victim, false),
		]);
		if (skip) skip();
		await delay(150);

		const unit = controllers.getUnitById(victim);
		if (!unit) return;

		controllers.triggerVfx.statDamage(victim, damageTaken);
		await controllers.triggerHpBar.drainHp(victim);
	};

	const takeDamageFromWarriorCast = async (
		warrior: string,
		victim: string,
		damageTaken: number,
		skip: (steps?: number) => void,
	) => {
		await Promise.all([
			controllers.triggerSpriteAnimation.takeDamage(
				victim,
				AnimationPhase.FOLLOW_THROUGH,
			),
			controllers.triggerHpBar.showDamagePreview(
				victim,
				damageTaken,
				'gold',
			),
		]);

		await delay(400);
		skip();
		await delay(1000);

		await Promise.all([
			controllers.triggerUnit.rotate(victim, 0, 300),
			controllers.triggerUnit.dashBy(victim, 30, -5, 300),
			controllers.triggerSpriteAnimation.idle(victim),
			controllers.triggerSpriteAnimation.idle(warrior),
			controllers.triggerCamera.reset(500),
			controllers.triggerVfx.screenRestoreColor(500),
			controllers.triggerVfx.ashSmokeAmbient(false),
			controllers.triggerUnit.reset(warrior),
			controllers.triggerHpBar.drainHp(victim),
			controllers.triggerVfx.statDamage(victim, damageTaken),
			controllers.triggerSound.stopAll(),
		]);
	};

	const takeDamageFromRogueCast = async (
		rogue: string,
		victim: string,
		damageTaken: number,
	) => {};

	const takeDamageFromHunterCast = async (
		hunter: string,
		victim: string,
		damageTaken: number,
	) => {
		await Promise.all([
			controllers.triggerSpriteAnimation.takeDamage(
				victim,
				AnimationPhase.WINDUP,
			),
			controllers.triggerVfx.bleed(hunter, victim),
			controllers.triggerUnit.dash(victim, hunter, -20),
			controllers.triggerHpBar.showDamagePreview(
				victim,
				damageTaken,
				'white',
			),
			controllers.triggerVfx.toggleTargetSwirl(victim, false),
		]);

		await Promise.all([
			controllers.triggerSpriteAnimation.takeDamage(
				victim,
				AnimationPhase.FOLLOW_THROUGH,
			),
			controllers.triggerHpBar.drainHp(victim),
			controllers.triggerVfx.statDamage(victim, damageTaken),
			controllers.triggerSpriteAnimation.idle(victim),

			controllers.triggerUnit.reset(hunter),
			controllers.triggerUnit.reset(victim),
			controllers.triggerSound.play(SoundPreset.SWISH_SHORT),
			controllers.triggerSpriteAnimation.idle(hunter),
			controllers.triggerSound.play(SoundPreset.HUNTER_LAND),
			controllers.triggerVfx.landingDust(hunter),
			controllers.triggerCamera.reset(400),
			controllers.triggerVfx.letterbox(false),
		]);
	};
};

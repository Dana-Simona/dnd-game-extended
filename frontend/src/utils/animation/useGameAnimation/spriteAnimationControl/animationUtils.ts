import { animationRegistry } from './animationRegistry';
import { getUnitSpriteConfig } from '../../spriteAnimations';
import type { Position } from '../unitControl/unitCalculations';
import type { GameEvent } from '../../../../constants/gameEvent';
import type { Unit } from '../../../../constants/interfaces/unit';
import type { AllPlayerData } from '../../../../constants/interfaces/player';
import {
	AnimationPhase,
	type SpritePresets,
} from '../../../../constants/animationStates/spriteStates';

export const combinePlayerAndUnits = (
	player: Unit | AllPlayerData | null,
	units: Unit[],
): Unit[] => (player ? [player as Unit, ...units] : [...units]);

export const updateMissingPositions = (
	prev: Record<string, Position>,
	units: Unit[],
): Record<string, Position> => {
	const missing = units.filter((u) => u?.id && !prev[u.id]);
	if (missing.length === 0) return prev;
	const next = { ...prev };
	missing.forEach((u) => {
		next[u.id] = { x: u.x, y: u.y };
	});
	return next;
};

export const getVisibleTileLimits = (
	tileSize: number,
	zoom: number,
): Position => ({
	x: window.innerWidth / (tileSize * zoom) / 2 + 2,
	y: window.innerHeight / (tileSize * zoom) / 2 + 2,
});

export const checkViewportBoundary = (
	pos?: Position,
	playerPos?: Position,
	limits?: Position,
): boolean => {
	if (!pos || !playerPos || !limits) return true;
	return (
		Math.abs(pos.x - playerPos.x) <= limits.x &&
		Math.abs(pos.y - playerPos.y) <= limits.y
	);
};

export const findUnitPosition = (
	unitId: string,
	visuals: Record<string, Position>,
	units: Unit[],
): Position | undefined =>
	visuals[unitId] || units.find((u) => u?.id === unitId);

export const calculateAnimDuration = (
	unit: Unit | undefined,
	action: SpritePresets,
	phase: AnimationPhase = AnimationPhase.FULL,
): number => {
	const config = getUnitSpriteConfig(unit, action);
	const fps = config?.fps || 8;
	const totalFrames = config?.frameCount || 4;
	const impactFrame = config?.impactFrame;

	let framesToPlay = totalFrames;
	if (phase === AnimationPhase.WINDUP && impactFrame !== undefined) {
		framesToPlay = impactFrame;
	} else if (
		phase === AnimationPhase.FOLLOW_THROUGH &&
		impactFrame !== undefined
	) {
		framesToPlay = totalFrames - impactFrame;
	}

	return (framesToPlay / fps) * 1000;
};

export const updateSinglePosition = (
	prev: Record<string, Position>,
	id: string,
	pos?: Position,
) => (pos ? { ...prev, [id]: pos } : prev);

export const removeActiveState = (
	prev: Record<string, string>,
	unitId: string,
) => {
	const next = { ...prev };
	delete next[unitId];
	return next;
};

export const removeActivePhase = (
	prev: Record<string, AnimationPhase>,
	unitId: string,
) => {
	const next = { ...prev };
	delete next[unitId];
	return next;
};

interface ActiveAnimation {
	timer: ReturnType<typeof setTimeout>;
	resolve: () => void;
}

const runningAnimations = new Map<string, ActiveAnimation>();

export const stopUnitAnim = (
	unitId: string,
	setStates: React.Dispatch<React.SetStateAction<Record<string, string>>>,
	setPhases: React.Dispatch<
		React.SetStateAction<Record<string, AnimationPhase>>
	>,
) => {
	const existing = runningAnimations.get(unitId);
	if (existing) {
		clearTimeout(existing.timer);
		existing.resolve();
		runningAnimations.delete(unitId);
	}
	setStates((prev) => removeActiveState(prev, unitId));
	setPhases((prev) => removeActivePhase(prev, unitId));
};

export const triggerUnitAnim = (
	unitId: string,
	action: string,
	phase: AnimationPhase,
	duration: number,
	targetPos: Position | undefined,
	setVisuals: React.Dispatch<React.SetStateAction<Record<string, Position>>>,
	setStates: React.Dispatch<React.SetStateAction<Record<string, string>>>,
	setPhases: React.Dispatch<
		React.SetStateAction<Record<string, AnimationPhase>>
	>,
	isOffScreen: boolean = false,
): Promise<void> => {
	if (targetPos) {
		setVisuals((prev) => updateSinglePosition(prev, unitId, targetPos));
	}

	if (isOffScreen) {
		return Promise.resolve();
	}

	const existing = runningAnimations.get(unitId);
	if (existing) {
		clearTimeout(existing.timer);
		existing.resolve();
		runningAnimations.delete(unitId);
	}

	const startAnimation = (resolve: () => void) => {
		setStates((prev) => ({ ...prev, [unitId]: action }));
		setPhases((prev) => ({ ...prev, [unitId]: phase }));

		const timer = setTimeout(() => {
			if (
				phase === AnimationPhase.FULL ||
				phase === AnimationPhase.FOLLOW_THROUGH
			) {
				setStates((prev) => removeActiveState(prev, unitId));
				setPhases((prev) => removeActivePhase(prev, unitId));
			}
			runningAnimations.delete(unitId);
			resolve();
		}, duration);

		runningAnimations.set(unitId, { timer, resolve });
	};

	if (existing) {
		setStates((prev) => removeActiveState(prev, unitId));
		setPhases((prev) => removeActivePhase(prev, unitId));
		return new Promise((resolve) => {
			requestAnimationFrame(() => {
				startAnimation(resolve);
			});
		});
	}

	return new Promise((resolve) => {
		startAnimation(resolve);
	});
};

export const buildTargetPositions = (
	player: AllPlayerData | null,
	enemies: Unit[] = [],
): Record<string, Position> => {
	const targets: Record<string, Position> = {};
	if (player) {
		const playerId = player.id || 'player';
		targets[playerId] = { x: player.x, y: player.y };
	}
	enemies.forEach((e, index) => {
		if (e) {
			const enemyId = e.id || `unit-${index + 1}`;
			targets[enemyId] = { x: e.x, y: e.y };
		}
	});
	return targets;
};

export const groupEventsByStep = (
	events: GameEvent[],
): Map<number, GameEvent[]> => {
	const map = new Map<number, GameEvent[]>();
	events.forEach((evt) => {
		const list = map.get(evt.step) || [];
		map.set(evt.step, [...list, evt]);
	});
	return map;
};

export const executeEventSteps = async (events: GameEvent[]): Promise<void> => {
	const stepsMap = groupEventsByStep(events);
	const sortedSteps = Array.from(stepsMap.keys()).sort((a, b) => a - b);
	for (const stepNum of sortedSteps) {
		const stepEvents = stepsMap.get(stepNum) || [];
		await Promise.all(
			stepEvents.map((evt) => animationRegistry.execute(evt)),
		);
	}
};

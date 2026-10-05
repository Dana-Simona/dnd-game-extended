import { animationRegistry } from './animationRegistry';
import type { GameEvent } from '../../constants/gameEvent';

export const playTurnSequence = async (events: GameEvent[]) => {
	if (!events || events.length === 0) return;

	const stepsMap = new Map<number, GameEvent[]>();
	events.forEach((evt) => {
		if (!stepsMap.has(evt.step)) stepsMap.set(evt.step, []);
		stepsMap.get(evt.step)!.push(evt);
	});

	const sortedSteps = Array.from(stepsMap.keys()).sort((a, b) => a - b);

	let i = 0;
	while (i < sortedSteps.length) {
		const stepNum = sortedSteps[i];
		const stepEvents = stepsMap.get(stepNum) || [];

		const skipValues = await Promise.all(
			stepEvents.map((evt) => animationRegistry.execute(evt)),
		);

		const stepsToSkip = Math.max(1, ...skipValues);
		i += stepsToSkip;
	}

	await animationRegistry.waitForAll();
};

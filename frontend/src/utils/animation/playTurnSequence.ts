import type { GameEvent } from '../../constants/gameEvent';
import { animationRegistry } from './animationRegistry';

export const playTurnSequence = async (events: GameEvent[]) => {
	if (!events || events.length === 0) return;

	const stepsMap = new Map<number, GameEvent[]>();
	events.forEach((evt) => {
		if (!stepsMap.has(evt.step)) stepsMap.set(evt.step, []);
		stepsMap.get(evt.step)!.push(evt);
	});

	const sortedSteps = Array.from(stepsMap.keys()).sort((a, b) => a - b);

	for (const stepNum of sortedSteps) {
		const stepEvents = stepsMap.get(stepNum) || [];

		await Promise.all(
			stepEvents.map((evt) => animationRegistry.execute(evt)),
		);

		await new Promise((resolve) => setTimeout(resolve, 100));
	}
};

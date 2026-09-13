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
	}
	//for long actions debug use this instead of the for loop above:

	// console.time(`Step ${stepNum} execution`);
	// 	await Promise.all(
	// 		stepEvents.map(async (evt) => {
	// 			const t0 = performance.now();
	// 			await animationRegistry.execute(evt);
	// 			const elapsed = performance.now() - t0;
	// 			if (elapsed > 50) {
	// 				console.warn(
	// 					`Slow animation [${evt.type}]: ${elapsed.toFixed(1)}ms`,
	// 					evt,
	// 				);
	// 			}
	// 		}),
	// 	);
	// 	console.timeEnd(`Step ${stepNum} execution`);
};

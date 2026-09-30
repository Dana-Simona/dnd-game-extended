import type { GameEvent } from '../../../../constants/gameEvent';

type SkipFunction = (stepsToSkip?: number) => void;
export type AnimationHandler = (
	event: any,
	skip: SkipFunction,
) => Promise<void>;

class AnimationRegistry {
	private handlers = new Map<string, AnimationHandler>();

	register(type: string, handler: AnimationHandler) {
		this.handlers.set(type, handler);
	}

	async execute(event: GameEvent): Promise<number> {
		const handler = this.handlers.get(event.type);
		if (!handler) return 1;

		return new Promise<number>((resolve) => {
			let handled = false;

			const skip: SkipFunction = (stepsToSkip = 1) => {
				if (!handled) {
					handled = true;
					resolve(stepsToSkip);
				}
			};

			handler(event, skip)
				.then(() => skip(1))
				.catch((err) => {
					console.error(`Error in handler for ${event.type}:`, err);
					skip(1);
				});
		});
	}
}

export const animationRegistry = new AnimationRegistry();

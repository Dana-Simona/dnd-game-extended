import type { GameEvent } from '../../constants/gameEvent';

type EventRunner = (event: GameEvent) => Promise<void>;

class AnimationRegistry {
	private handlers: Map<string, EventRunner> = new Map();

	register(type: string, handler: EventRunner) {
		this.handlers.set(type, handler);
	}

	async execute(event: GameEvent): Promise<void> {
		const handler = this.handlers.get(event.type);
		if (handler) {
			await handler(event);
		} else {
			console.warn(
				`No handler registered for event type: $\{event.type}`,
			);
		}
	}
}

export const animationRegistry = new AnimationRegistry();

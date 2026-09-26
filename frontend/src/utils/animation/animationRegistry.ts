type AnimationHandler = (event: any, next: () => void) => Promise<void>;

class AnimationRegistry {
	private handlers = new Map<string, AnimationHandler>();

	register(type: string, handler: AnimationHandler) {
		this.handlers.set(type, handler);
	}

	async execute(event: any): Promise<void> {
		const handler = this.handlers.get(event.type || event.action);
		if (!handler) return;

		return new Promise<void>((resolve) => {
			let nextCalled = false;

			const next = () => {
				if (!nextCalled) {
					nextCalled = true;
					resolve();
				}
			};

			handler(event, next)
				.then(() => {
					next();
				})
				.catch((err) => {
					console.error(
						`Error in animation handler for ${event.type}:`,
						err,
					);
					next();
				});
		});
	}
}

export const animationRegistry = new AnimationRegistry();

class AnimationRegistry {
	private handlers = new Map<string, (event: any) => Promise<void>>();

	register(type: string, handler: (event: any) => Promise<void>) {
		this.handlers.set(type, handler);
	}

	async execute(event: any): Promise<void> {
		const handler = this.handlers.get(event.type || event.action);
		if (handler) {
			return await handler(event);
		}
	}
}

export const animationRegistry = new AnimationRegistry();

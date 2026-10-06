export const BOSS_SMOKE_SPRITE = {
	imagePath: '/vfx/effects/bossSmoke.png',
	width: 128,
	height: 128,
	frameCount: 16,
	fps: 12,
} as const;

export const BOSS_SMOKE_DURATION_MS = Math.round(
	(BOSS_SMOKE_SPRITE.frameCount / BOSS_SMOKE_SPRITE.fps) * 1000,
);

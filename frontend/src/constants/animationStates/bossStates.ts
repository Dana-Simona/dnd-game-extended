export interface TriggerBossAPI {
	showHealthBar: (bossId: string) => Promise<void>;
	hideHealthBar: () => Promise<void>;
}

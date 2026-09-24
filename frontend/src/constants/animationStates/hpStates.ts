export interface HpState {
    currentHp: number;
    maxHp: number;
    previewHp: number;
    color?: string;
}

export type HpStateMap = Record<string | number, HpState>;

export interface TriggerHpBarAPI {
    showDamagePreview: (
        unitId: string | number,
        damage: number,
        color?: string,
    ) => void;
    drainHp: (unitId: string | number, targetHp?: number) => void;
}
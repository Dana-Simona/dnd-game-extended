import { useState, useCallback, useEffect } from 'react';

import type { Unit } from '../../../../constants/interfaces/unit';
import type { AllPlayerData } from '../../../../constants/interfaces/player';

export interface HpState {
	currentHp: number;
	maxHp: number;
	previewHp: number;
}

export type HpStateMap = Record<string | number, HpState>;

export const HpBarPreset = {
	SHOW_DAMAGE_PREVIEW: 'SHOW_DAMAGE_PREVIEW',
	SET_PREVIEW_HP: 'SET_PREVIEW_HP',
	DEPLETE_HP: 'DEPLETE_HP',
	CLEAR_PREVIEW: 'CLEAR_PREVIEW',
} as const;

export type HpBarPreset = (typeof HpBarPreset)[keyof typeof HpBarPreset];

export type HpBarCommand =
	| {
			type: typeof HpBarPreset.SHOW_DAMAGE_PREVIEW;
			unitId: string | number;
			damage: number;
	  }
	| {
			type: typeof HpBarPreset.SET_PREVIEW_HP;
			unitId: string | number;
			targetHp: number;
	  }
	| {
			type: typeof HpBarPreset.DEPLETE_HP;
			unitId: string | number;
			targetHp?: number;
	  }
	| { type: typeof HpBarPreset.CLEAR_PREVIEW; unitId: string | number };

export type TriggerHpBar = (command: HpBarCommand) => void;

export const useHpBarControl = (
	units: Unit[] = [],
	player: Unit | AllPlayerData | null = null,
) => {
	const [hpStates, setHpStates] = useState<HpStateMap>({});

	const syncHpStates = useCallback(() => {
		const nextStates: HpStateMap = {};

		const processUnit = (unit: Unit | AllPlayerData | null) => {
			if (!unit || unit.id === undefined) return;
			const hp = unit.currentHealth ?? 0;
			const maxHp = unit.health ?? hp ?? 100;

			nextStates[unit.id] = {
				currentHp: hp,
				maxHp,
				previewHp: hp,
			};
		};

		processUnit(player as Unit | AllPlayerData | null);
		units.forEach(processUnit);

		setHpStates(nextStates);
	}, [units, player]);

	useEffect(() => {
		syncHpStates();
	}, [syncHpStates]);

	const showDamagePreview = useCallback(
		(unitId: string | number, damage: number) => {
			setHpStates((prev) => {
				const current = prev[unitId];
				if (!current) return prev;

				const nextPreview = Math.max(0, current.currentHp - damage);
				return {
					...prev,
					[unitId]: {
						...current,
						previewHp: nextPreview,
					},
				};
			});
		},
		[],
	);

	const setPreviewHp = useCallback(
		(unitId: string | number, targetHp: number) => {
			setHpStates((prev) => {
				const current = prev[unitId];
				if (!current) return prev;

				return {
					...prev,
					[unitId]: {
						...current,
						previewHp: Math.max(
							0,
							Math.min(current.maxHp, targetHp),
						),
					},
				};
			});
		},
		[],
	);

	const depleteHp = useCallback(
		(unitId: string | number, targetHp?: number) => {
			setHpStates((prev) => {
				const current = prev[unitId];
				if (!current) return prev;

				const finalHp =
					targetHp !== undefined ? targetHp : current.previewHp;
				return {
					...prev,
					[unitId]: {
						...current,
						currentHp: finalHp,
						previewHp: finalHp,
					},
				};
			});
		},
		[],
	);

	const clearPreview = useCallback((unitId: string | number) => {
		setHpStates((prev) => {
			const current = prev[unitId];
			if (!current) return prev;

			return {
				...prev,
				[unitId]: {
					...current,
					previewHp: current.currentHp,
				},
			};
		});
	}, []);

	const triggerHpBar: TriggerHpBar = useCallback(
		(command: HpBarCommand) => {
			switch (command.type) {
				case HpBarPreset.SHOW_DAMAGE_PREVIEW:
					showDamagePreview(command.unitId, command.damage);
					break;
				case HpBarPreset.SET_PREVIEW_HP:
					setPreviewHp(command.unitId, command.targetHp);
					break;
				case HpBarPreset.DEPLETE_HP:
					depleteHp(command.unitId, command.targetHp);
					break;
				case HpBarPreset.CLEAR_PREVIEW:
					clearPreview(command.unitId);
					break;
			}
		},
		[showDamagePreview, setPreviewHp, depleteHp, clearPreview],
	);

	const resetHpStates = useCallback(
		(nextPlayer?: Unit | AllPlayerData | null, nextUnits?: Unit[]) => {
			const targetUnits = nextUnits ?? units;
			const targetPlayer = nextPlayer !== undefined ? nextPlayer : player;

			const nextStates: HpStateMap = {};
			const processUnit = (unit: Unit | AllPlayerData | null) => {
				if (!unit || unit.id === undefined) return;
				const hp = unit.currentHealth ?? 0;
				const maxHp = unit.health ?? hp ?? 100;

				nextStates[unit.id] = {
					currentHp: hp,
					maxHp,
					previewHp: hp,
				};
			};

			processUnit(targetPlayer as Unit | AllPlayerData | null);
			targetUnits.forEach(processUnit);

			setHpStates(nextStates);
		},
		[units, player],
	);

	return {
		hpStates,
		triggerHpBar,
		showDamagePreview,
		setPreviewHp,
		depleteHp,
		clearPreview,
		resetHpStates,
	};
};

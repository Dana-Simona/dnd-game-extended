import { useState, useCallback, useEffect, useMemo } from 'react';

import type { Unit } from '../../../../constants/interfaces/unit';
import type { AllPlayerData } from '../../../../constants/interfaces/player';
import type {
	HpStateMap,
	TriggerHpBarAPI,
} from '../../../../constants/animationStates/hpStates';

export interface UseHpBarControlReturn {
	hpStates: HpStateMap;
	triggerHpBar: TriggerHpBarAPI;
	showDamagePreview: (
		unitId: string | number,
		damage: number,
		color?: string,
	) => void;
	drainHp: (unitId: string | number, targetHp?: number) => void;
	resetHpStates: (
		nextPlayer?: Unit | AllPlayerData | null,
		nextUnits?: Unit[],
	) => void;
}

export const useHpBarControl = (
	units: Unit[] = [],
	player: Unit | AllPlayerData | null = null,
): UseHpBarControlReturn => {
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
		(unitId: string | number, damage: number, color?: string) => {
			setHpStates((prev) => {
				const current = prev[unitId];
				if (!current) return prev;

				const nextPreview = Math.max(0, current.currentHp - damage);
				return {
					...prev,
					[unitId]: {
						...current,
						previewHp: nextPreview,
						color,
					},
				};
			});
		},
		[],
	);

	const drainHp = useCallback(
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
						color: undefined,
					},
				};
			});
		},
		[],
	);

	const triggerHpBar = useMemo<TriggerHpBarAPI>(
		() => ({
			showDamagePreview,
			drainHp,
		}),
		[showDamagePreview, drainHp],
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
		drainHp,
		resetHpStates,
	};
};

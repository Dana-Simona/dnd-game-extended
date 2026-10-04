import { useState, useEffect, useMemo } from 'react';
import { useCharacter } from '../../utils/characterContext/CharacterContext';
import {
	VfxCategory,
	type VfxItem,
} from '../../constants/animationStates/vfxStates';
import type { Unit } from '../../constants/interfaces/unit';
import { combineUnits, useViewport } from './useViewport';

const levelModules = import.meta.glob([
	'/public/levels/level*/*',
	'/levels/level*/*',
]);

type LayerMatrix = number[][];

export interface LevelFileRecord {
	ground?: LayerMatrix;
	walls?: LayerMatrix;
	props?: LayerMatrix;
	layer?: LayerMatrix;
	matrix?: LayerMatrix;
	[key: string]: LayerMatrix | unknown;
}

export type LevelExport = LayerMatrix | LayerMatrix[] | LevelFileRecord;

export interface ViteModule {
	default?: LevelExport;
	[key: string]: unknown;
}

export type ModuleResolver = () => Promise<ViteModule | LevelExport>;

const isMatrix = (val: unknown): val is LayerMatrix => {
	return (
		Array.isArray(val) &&
		val.length > 0 &&
		Array.isArray(val[0]) &&
		(val[0].length === 0 || typeof val[0][0] === 'number')
	);
};

const extractMatrices = (
	moduleOutput: ViteModule | LevelExport,
): LayerMatrix[] => {
	if (!moduleOutput || typeof moduleOutput !== 'object') return [];

	const data = (
		'default' in moduleOutput && moduleOutput.default !== undefined
			? moduleOutput.default
			: moduleOutput
	) as LevelExport;

	if (!data) return [];

	if (Array.isArray(data)) {
		if (data.length === 0) return [];
		if (isMatrix(data[0])) return data as LayerMatrix[];
		if (isMatrix(data)) return [data as LayerMatrix];
		return [];
	}

	const extracted: LayerMatrix[] = [];
	const targets = [data, moduleOutput];
	const seen = new Set<LayerMatrix>();

	for (const target of targets) {
		if (!target || typeof target !== 'object' || Array.isArray(target))
			continue;
		for (const key of Object.keys(target)) {
			if (key === 'default') continue;
			const value = (target as Record<string, unknown>)[key];
			if (isMatrix(value) && !seen.has(value)) {
				seen.add(value);
				extracted.push(value);
			}
		}
	}

	return extracted;
};

export const useGameBoardLogic = (
	level: number,
	enemies: Unit[],
	activeVfxList: VfxItem[] = [],
) => {
	const { character } = useCharacter();
	const { viewportRef } = useViewport();
	const [layers, setLayers] = useState<LayerMatrix[]>([]);

	useEffect(() => {
		let isMounted = true;
		const levelFolderRegex = new RegExp(`/level${level}/[^/]+$`);
		const seenFiles = new Set<string>();

		const matchingEntries = (
			Object.entries(levelModules) as [string, ModuleResolver][]
		)
			.filter(([path]) => levelFolderRegex.test(path))
			.filter(([path]) => {
				const fileName = path.split('/').pop();
				if (!fileName || seenFiles.has(fileName)) return false;
				seenFiles.add(fileName);
				return true;
			});

		if (matchingEntries.length === 0) {
			setLayers([]);
			return;
		}

		matchingEntries.sort(([pathA], [pathB]) =>
			pathA.localeCompare(pathB, undefined, {
				numeric: true,
				sensitivity: 'base',
			}),
		);

		Promise.all(
			matchingEntries.map(async ([path, resolver]) => {
				try {
					const rawModule = await resolver();
					const matrices = extractMatrices(rawModule);
					return { path, matrices };
				} catch (err) {
					console.error(
						`Failed to load level layer file "${path}":`,
						err,
					);
					return { path, matrices: [] };
				}
			}),
		)
			.then((results) => {
				if (!isMounted) return;
				const allLayers: LayerMatrix[] = results.flatMap(
					(r) => r.matrices,
				);
				setLayers(allLayers);
			})
			.catch((err) => {
				console.error(`Error aggregating level layers:`, err);
				if (isMounted) setLayers([]);
			});

		return () => {
			isMounted = false;
		};
	}, [level]);

	const { screenVfxs, backVfxs, frontVfxs, portalVfxs } = useMemo(() => {
		const screenVfxs: VfxItem[] = [];
		const backVfxs: VfxItem[] = [];
		const frontVfxs: VfxItem[] = [];
		const portalVfxs: VfxItem[] = [];

		for (const vfx of activeVfxList) {
			switch (vfx.category) {
				case VfxCategory.SCREEN_COLOR:
					screenVfxs.push(vfx);
					break;
				case VfxCategory.BACK:
					backVfxs.push(vfx);
					break;
				case VfxCategory.FRONT:
					frontVfxs.push(vfx);
					break;
				case VfxCategory.PORTAL:
					portalVfxs.push(vfx);
					break;
			}
		}

		return { screenVfxs, backVfxs, frontVfxs, portalVfxs };
	}, [activeVfxList]);

	const allUnits = character ? combineUnits(character, enemies) : [];
	const activeScreenVfxTypes = screenVfxs.map((v) => v.type);

	return {
		character,
		viewportRef,
		layers,
		backVfxs,
		frontVfxs,
		portalVfxs,
		allUnits,
		activeScreenVfxTypes,
	};
};

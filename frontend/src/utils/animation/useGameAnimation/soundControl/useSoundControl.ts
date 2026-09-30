import { useRef, useCallback, useEffect } from 'react';
import { soundRegistry } from './soundRegistry';
import type { SoundPreset, TriggerSoundAPI } from '../../../../constants/animationStates/soundStates';

export const useSoundControl = (
	globalVolume: number = 1,
	enabled: boolean = true,
) => {
	const activeAudios = useRef<Map<SoundPreset, Set<HTMLAudioElement>>>(
		new Map(),
	);

	const play = useCallback(
		async (
			preset: SoundPreset,
			volumeOverride?: number,
		): Promise<void> => {
			if (!enabled) return;

			const config = soundRegistry[preset];
			if (!config || config.files.length === 0) return;

			const fileIndex = Math.floor(Math.random() * config.files.length);
			const file = config.files[fileIndex];

			const audio = new Audio(file);
			audio.volume =
				(volumeOverride ?? config.volume ?? 1) * globalVolume;
			audio.loop = config.loop ?? false;

			if (!activeAudios.current.has(preset)) {
				activeAudios.current.set(preset, new Set());
			}
			activeAudios.current.get(preset)!.add(audio);

			audio.onended = () => {
				activeAudios.current.get(preset)?.delete(audio);
			};

			try {
				await audio.play();
			} catch (error) {
				console.warn(`Failed to play sound: ${file}`, error);
				activeAudios.current.get(preset)?.delete(audio);
			}
		},
		[enabled, globalVolume],
	);

	const stop = useCallback(async (preset: SoundPreset): Promise<void> => {
		const audios = activeAudios.current.get(preset);
		if (audios) {
			audios.forEach((audio) => {
				audio.pause();
				audio.currentTime = 0;
			});
			audios.clear();
		}
	}, []);

	const stopAll = useCallback(async (): Promise<void> => {
		activeAudios.current.forEach((audios) => {
			audios.forEach((audio) => {
				audio.pause();
				audio.currentTime = 0;
			});
			audios.clear();
		});
	}, []);

	useEffect(() => {
		return () => {
			stopAll();
		};
	}, [stopAll]);

	return {
		triggerSound: {
			play,
			stop,
			stopAll,
		} as TriggerSoundAPI,
	};
};

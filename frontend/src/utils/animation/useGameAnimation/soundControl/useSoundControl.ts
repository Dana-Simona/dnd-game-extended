import { useRef, useCallback, useEffect, useMemo } from 'react';
import { soundRegistry } from './soundRegistry';
import {
	SoundPreset,
	type TriggerSoundAPI,
} from '../../../../constants/animationStates/soundStates';

const FADE_OUT_DURATION = 600;
const FADE_INTERVAL = 50;

const MUSIC_PRESETS: SoundPreset[] = [
	SoundPreset.BG_MUSIC_REGULAR,
	SoundPreset.BG_MUSIC_BOSS,
];
const isMusic = (preset: SoundPreset) => MUSIC_PRESETS.includes(preset);

export const useSoundControl = (
	globalVolume: number = 1,
	enabled: boolean = true,
) => {
	const activeAudios = useRef<Map<SoundPreset, Set<HTMLAudioElement>>>(
		new Map(),
	);

	const fadeAndStopAudio = useCallback(
		(
			audio: HTMLAudioElement,
			duration: number = FADE_OUT_DURATION,
		): Promise<void> => {
			return new Promise((resolve) => {
				if (audio.paused || audio.volume <= 0) {
					audio.pause();
					audio.currentTime = 0;
					resolve();
					return;
				}

				const initialVolume = audio.volume;
				const steps = duration / FADE_INTERVAL;
				const volumeStep = initialVolume / steps;

				const fadeInterval = setInterval(() => {
					if (audio.volume > volumeStep) {
						audio.volume = Math.max(0, audio.volume - volumeStep);
					} else {
						audio.volume = 0;
						audio.pause();
						audio.currentTime = 0;
						clearInterval(fadeInterval);
						resolve();
					}
				}, FADE_INTERVAL);
			});
		},
		[],
	);

	const play = useCallback(
		async (preset: SoundPreset, volumeOverride?: number): Promise<void> => {
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

	const stop = useCallback(
		async (
			preset: SoundPreset,
			fadeDuration: number = FADE_OUT_DURATION,
		): Promise<void> => {
			const audios = activeAudios.current.get(preset);
			if (!audios || audios.size === 0) return;

			const audioList = Array.from(audios);
			audios.clear();

			await Promise.all(
				audioList.map((audio) => fadeAndStopAudio(audio, fadeDuration)),
			);
		},
		[fadeAndStopAudio],
	);

	const stopAll = useCallback(
		async (
			fadeDuration: number = FADE_OUT_DURATION,
			includeMusic: boolean = false,
		): Promise<void> => {
			const allAudios: HTMLAudioElement[] = [];

			activeAudios.current.forEach((audios, preset) => {
				// background music keeps playing through fights
				if (!includeMusic && isMusic(preset)) return;
				audios.forEach((audio) => allAudios.push(audio));
				audios.clear();
			});

			await Promise.all(
				allAudios.map((audio) => fadeAndStopAudio(audio, fadeDuration)),
			);
		},
		[fadeAndStopAudio],
	);

	const playMusic = useCallback(
		async (preset: SoundPreset): Promise<void> => {
			if (!enabled) return;

			// already playing this track -> keep it going
			if ((activeAudios.current.get(preset)?.size ?? 0) > 0) return;

			// fade out the other background track, then start this one
			MUSIC_PRESETS.filter((p) => p !== preset).forEach((other) => {
				void stop(other);
			});
			await play(preset);
		},
		[enabled, play, stop],
	);

	const stopMusic = useCallback(
		async (fadeDuration: number = FADE_OUT_DURATION): Promise<void> => {
			await Promise.all(MUSIC_PRESETS.map((p) => stop(p, fadeDuration)));
		},
		[stop],
	);

	const triggerSound = useMemo<TriggerSoundAPI>(
		() => ({ play, stop, stopAll, playMusic, stopMusic }),
		[play, stop, stopAll, playMusic, stopMusic],
	);

	useEffect(() => {
		return () => {
			activeAudios.current.forEach((audios) => {
				audios.forEach((audio) => {
					audio.pause();
					audio.currentTime = 0;
				});
				audios.clear();
			});
		};
	}, []);

	return { triggerSound };
};

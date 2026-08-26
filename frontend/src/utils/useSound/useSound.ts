import { useRef, useCallback } from 'react';

interface UseSoundOptions {
	volume?: number;
	enabled?: boolean;
}

const useSound = (soundFilePath: string, options: UseSoundOptions = {}) => {
	const { volume = 1, enabled = true } = options;

	const audioRef = useRef<HTMLAudioElement | null>(
		typeof Audio !== 'undefined' ? new Audio(soundFilePath) : null,
	);

	const playSound = useCallback(() => {
		if (!enabled || !audioRef.current) return;

		audioRef.current.currentTime = 0;
		audioRef.current.volume = volume;

		audioRef.current.play().catch(() => {});
	}, [enabled, volume]);

	return playSound;
};

export default useSound;

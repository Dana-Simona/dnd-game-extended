import { useEffect, useCallback, useRef } from 'react';

export interface SoundSequenceStep {
	play: () => void;
	delay: number;
}

const useSoundSequence = (
	sequence: SoundSequenceStep[],
	autoPlay: boolean = true,
) => {
	const sequenceRef = useRef(sequence);

	useEffect(() => {
		sequenceRef.current = sequence;
	}, [sequence]);

	const playSequence = useCallback(() => {
		const timers = sequenceRef.current.map(({ play, delay }) =>
			setTimeout(() => {
				play();
			}, delay),
		);

		return () => {
			timers.forEach((timer) => clearTimeout(timer));
		};
	}, []);

	useEffect(() => {
		if (!autoPlay) return;

		const cancelSequence = playSequence();
		return () => {
			cancelSequence();
		};
	}, [playSequence, autoPlay]);

	return playSequence;
};

export default useSoundSequence;

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from 'react';
import type { AllPlayerData } from '../../constants/interfaces/player';

interface CharacterContextType {
	character: AllPlayerData | null;
	selectCharacter: (char: AllPlayerData) => void;
	updateCharacter: (char: AllPlayerData) => void;
	resetCharacter: () => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(
	undefined,
);

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
	const [character, setCharacter] = useState<AllPlayerData | null>(null);

	const selectCharacter = useCallback(
		(char: AllPlayerData) => setCharacter(char),
		[],
	);
	const updateCharacter = useCallback(
		(char: AllPlayerData) => setCharacter(char),
		[],
	);
	const resetCharacter = useCallback(() => setCharacter(null), []);

	const value = useMemo(
		() => ({ character, selectCharacter, updateCharacter, resetCharacter }),
		[character, selectCharacter, updateCharacter, resetCharacter],
	);

	return (
		<CharacterContext.Provider value={value}>
			{children}
		</CharacterContext.Provider>
	);
};

export const useCharacter = () => {
	const context = useContext(CharacterContext);
	if (!context)
		throw new Error('useCharacter must be used within CharacterProvider');
	return context;
};

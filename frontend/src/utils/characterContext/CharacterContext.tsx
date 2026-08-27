import { createContext, useContext, useState, type ReactNode } from 'react';
import type { AllPlayerData } from '../../constants/interfaces/player';

interface CharacterContextType {
	character: AllPlayerData | null;
	selectCharacter: (char: AllPlayerData) => void;
	resetCharacter: () => void;
}

const CharacterContext = createContext<CharacterContextType | undefined>(
	undefined,
);

export const CharacterProvider = ({ children }: { children: ReactNode }) => {
	const [character, setCharacter] = useState<AllPlayerData | null>(null);

	const selectCharacter = (char: AllPlayerData) => setCharacter(char);
	const resetCharacter = () => setCharacter(null);

	console.log("🎮 CURRENT CONTEXT CHARACTER:", character);

	return (
		<CharacterContext.Provider
			value={{ character, selectCharacter, resetCharacter }}
		>
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

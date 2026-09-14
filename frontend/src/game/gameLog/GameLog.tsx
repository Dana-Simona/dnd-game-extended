import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGameLogs } from './useGameLogs';
import { useCharacter } from '../../utils/characterContext/CharacterContext';
import { LogBody, LogContainer, LogEntry, LogHeader } from './GameLogStyles';
import { colorizeLog } from './GameLogColors';

interface GameLogProps {
	actionTrigger?: number | string;
}

export const GameLog: React.FC<GameLogProps> = ({ actionTrigger }) => {
	const { character } = useCharacter();
	const { logs, logEndRef } = useGameLogs(actionTrigger);

	return (
		<LogContainer
			layout
			transition={{ type: 'spring', stiffness: 300, damping: 30 }}
		>
			<LogHeader>Game Log</LogHeader>
			<LogBody>
				<AnimatePresence initial={false}>
					{logs.map((log, index) => (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.2 }}
						>
							<LogEntry>
								{colorizeLog(log, character?.name)}
							</LogEntry>
						</motion.div>
					))}
				</AnimatePresence>
				<div ref={logEndRef} />
			</LogBody>
		</LogContainer>
	);
};

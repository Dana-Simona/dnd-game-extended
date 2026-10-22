import React from 'react';
import {
	Screen,
	Content,
	Emblem,
	Ring,
	Core,
	Heading,
	Hint,
	Bar,
	SubHint,
} from './LoadingScreenStyles';

export const LoadingScreen: React.FC = () => (
	<Screen
		role='status'
		aria-live='polite'
	>
		<Content>
			<Emblem aria-hidden>
				<Ring $inset={0} />
				<Ring
					$inset={18}
					$reverse
				/>
				<Core />
			</Emblem>
			<Heading>Loading characters</Heading>
			<Hint>this may take a few seconds</Hint>
			<Bar aria-hidden />
			<SubHint>waking up the dungeon server</SubHint>
		</Content>
	</Screen>
);

export default LoadingScreen;

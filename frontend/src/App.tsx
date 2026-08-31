import { Route, Routes } from 'react-router-dom';
import Game from './game/Game';
import MainMenu from './mainMenu/MainMenu';
import NotFound from './notFound/NotFound';
import { ROUTES } from './constants/routes';
import LevelSelection from './levelSelection/LevelSelection';
import ClassSelection from './classSelection/ClassSelection';
import CharacterSelection from './classSelection/characterSelection/CharacterSelection';
import { CharacterProvider } from './utils/characterContext/CharacterContext';
import DevTools from './devTools/DevTools';

const App: React.FC = () => {
	return (
		<CharacterProvider>
			<Routes>
				<Route
					path={ROUTES.MAIN_MENU}
					element={<MainMenu />}
				/>

				<Route
					path={ROUTES.CHARACTER_SELECTION}
					element={<ClassSelection />}
				/>

				<Route
					path={`${ROUTES.CHARACTER_SELECTION}/:classType?`}
					element={<CharacterSelection />}
				/>

				<Route
					path={ROUTES.LEVEL_SELECTION}
					element={<LevelSelection />}
				/>

				<Route
					path={`${ROUTES.GAME}/:level?`}
					element={<Game />}
				/>

				<Route
					path='*'
					element={<NotFound />}
				/>

				<Route
					path={ROUTES.DEV_TOOLS}
					element={<DevTools />}
				/>
			</Routes>
		</CharacterProvider>
	);
};

export default App;

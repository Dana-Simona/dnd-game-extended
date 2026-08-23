import { Route, Routes } from 'react-router-dom';
import Game from './game/Game';
import MainMenu from './mainMenu/MainMenu';
import NotFound from './notFound/NotFound';
import { ROUTES } from './constants/routes';
import LevelSelection from './levelSelection/LevelSelection';
import ClassSelection from './classSelection/ClassSelection';

const App: React.FC = () => {
	return (
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
				path={ROUTES.LEVEL_SELECTION}
				element={<LevelSelection />}
			/>

			<Route
				path={ROUTES.GAME}
				element={<Game />}
			/>

			<Route
				path='*'
				element={<NotFound />}
			/>
		</Routes>
	);
};

export default App;

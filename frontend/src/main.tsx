import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import './index.css';
import App from './App.tsx';

// Automatically fix absolute asset paths for GitHub Pages subfolder
const BASE_URL = import.meta.env.BASE_URL;
if (BASE_URL !== '/') {
	const originalImageDescriptor = Object.getOwnPropertyDescriptor(
		HTMLImageElement.prototype,
		'src',
	);
	Object.defineProperty(HTMLImageElement.prototype, 'src', {
		set(value: string) {
			if (value && value.startsWith('/') && !value.startsWith(BASE_URL)) {
				value = BASE_URL + value.slice(1);
			}
			originalImageDescriptor?.set?.call(this, value);
		},
	});

	const originalAudio = window.Audio;
	// @ts-ignore
	window.Audio = function (src?: string) {
		if (src && src.startsWith('/') && !src.startsWith(BASE_URL)) {
			src = BASE_URL + src.slice(1);
		}
		return new originalAudio(src);
	};
}

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter basename='/dnd-game-extended/'>
			<App />
		</BrowserRouter>
	</StrictMode>,
);

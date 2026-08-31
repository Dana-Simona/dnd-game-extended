import React, { useEffect, useRef, useState } from 'react';
import * as S from './DevToolsStyles';
import { tiles } from '../utils/tileMapping/AllTiles';

const TILE_SIZE = 32;

type LayerType = 'ascii' | 'data';
type ToolMode = 'pan' | 'paint';

interface LevelLayer {
	id: string;
	type: LayerType;
	name: string;
	data: any;
	zIndex: number;
}

// 1. Dynamic import that matches all files inside ANY level folder
const allLevelFiles = import.meta.glob('/src/constants/levels_dir/*/*.*', {
	eager: true,
});

const DevTools: React.FC = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const imageCache = useRef<Record<string, HTMLImageElement>>({});

	// Level Selection State
	const [availableLevels, setAvailableLevels] = useState<string[]>([]);
	const [selectedLevel, setSelectedLevel] = useState<string>('');

	const [imagesLoaded, setImagesLoaded] = useState(false);
	const [layers, setLayers] = useState<LevelLayer[]>([]);
	const [visibleLayers, setVisibleLayers] = useState<Set<string>>(new Set());

	// Editing State
	const [activeLayerId, setActiveLayerId] = useState<string | null>(null);
	const [selectedTileIndex, setSelectedTileIndex] = useState<number>(-1); // -1 is eraser
	const [toolMode, setToolMode] = useState<ToolMode>('pan');
	const [copied, setCopied] = useState(false);

	// Camera State
	const [zoom, setZoom] = useState(1);
	const [pan, setPan] = useState({ x: 50, y: 50 });
	const [isDragging, setIsDragging] = useState(false);
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

	// Hover State
	const [hoverData, setHoverData] = useState<{
		layerName: string;
		tileIndex: number | string;
		col: number;
		row: number;
	} | null>(null);

	// --- DISCOVER AVAILABLE LEVELS ---
	useEffect(() => {
		const filePaths = Object.keys(allLevelFiles);
		const levelNamesSet = new Set<string>();

		filePaths.forEach((path) => {
			// Path structure: /src/constants/levels_dir/[levelName]/[fileName]
			const parts = path.split('/');
			const dirIndex = parts.indexOf('levels_dir');
			if (dirIndex !== -1 && parts[dirIndex + 1]) {
				levelNamesSet.add(parts[dirIndex + 1]);
			}
		});

		const levelList = Array.from(levelNamesSet).sort();
		setAvailableLevels(levelList);
		if (levelList.length > 0) {
			setSelectedLevel(levelList[0]);
		}
	}, []);

	// --- PRELOAD SPRITE SHEETS ---
	useEffect(() => {
		if (!tiles || tiles.length === 0) {
			setImagesLoaded(true);
			return;
		}

		const uniqueSources = Array.from(new Set(tiles.map((t) => t.imageSrc)));
		let loadedCount = 0;

		uniqueSources.forEach((src) => {
			const img = new Image();
			img.src = src;
			img.onload = () => {
				imageCache.current[src] = img;
				loadedCount++;
				if (loadedCount === uniqueSources.length) {
					setImagesLoaded(true);
				}
			};
			img.onerror = () => {
				loadedCount++;
				if (loadedCount === uniqueSources.length) {
					setImagesLoaded(true);
				}
			};
		});
	}, []);

	// --- LOAD LAYERS FOR SELECTED LEVEL ---
	useEffect(() => {
		if (!selectedLevel) return;

		const loadedLayers: LevelLayer[] = [];
		const matchingPaths = Object.keys(allLevelFiles)
			.filter((path) => path.includes(`/levels_dir/${selectedLevel}/`))
			.sort();

		matchingPaths.forEach((path, index) => {
			const filenameWithExt = path.split('/').pop() || `layer_${index}`;
			const fileName =
				filenameWithExt.substring(
					0,
					filenameWithExt.lastIndexOf('.'),
				) || filenameWithExt;

			const module: any = allLevelFiles[path];
			const rawData =
				module.default !== undefined ? module.default : module;

			const isAscii =
				Array.isArray(rawData) && typeof rawData[0] === 'string';

			// Deep clone array so editing in memory doesn't mutate imported modules
			const clonedData = JSON.parse(JSON.stringify(rawData));

			loadedLayers.push({
				id: `layer-${index}`,
				name: fileName,
				type: isAscii ? 'ascii' : 'data',
				data: clonedData,
				zIndex: index,
			});
		});

		setLayers(loadedLayers);
		setVisibleLayers(new Set(loadedLayers.map((l) => l.id)));

		const topmostData = [...loadedLayers]
			.reverse()
			.find((l) => l.type === 'data');
		if (topmostData) setActiveLayerId(topmostData.id);
	}, [selectedLevel]);

	// --- CANVAS RENDERING ---
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas || !imagesLoaded) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		canvas.width = canvas.parentElement?.clientWidth || 800;
		canvas.height = canvas.parentElement?.clientHeight || 600;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.imageSmoothingEnabled = false;

		ctx.save();
		ctx.translate(pan.x, pan.y);
		ctx.scale(zoom, zoom);

		layers.forEach((layer) => {
			if (!visibleLayers.has(layer.id)) return;

			ctx.globalAlpha =
				activeLayerId && layer.id !== activeLayerId ? 0.7 : 1.0;

			if (layer.type === 'data') {
				const mapData = layer.data as number[][];
				mapData.forEach((rowArr, rowIdx) => {
					rowArr.forEach((tileIndex, colIdx) => {
						if (tileIndex === -1) return;

						const tileDef = tiles[tileIndex];
						if (tileDef) {
							const img = imageCache.current[tileDef.imageSrc];
							if (img) {
								const sourceX =
									tileDef.coordinates.x[0] * TILE_SIZE;
								const sourceY =
									tileDef.coordinates.y[0] * TILE_SIZE;

								ctx.drawImage(
									img,
									sourceX,
									sourceY,
									TILE_SIZE,
									TILE_SIZE,
									colIdx * TILE_SIZE,
									rowIdx * TILE_SIZE,
									TILE_SIZE,
									TILE_SIZE,
								);
							}
						}
					});
				});
			} else if (layer.type === 'ascii') {
				const asciiData = layer.data as string[];
				ctx.font = '24px monospace';
				ctx.textBaseline = 'top';

				asciiData.forEach((rowStr, rowIdx) => {
					for (let colIdx = 0; colIdx < rowStr.length; colIdx++) {
						const char = rowStr[colIdx];
						if (char !== ' ' && char !== '#') {
							ctx.fillStyle =
								char === '@' ? '#00ff00' : '#ff0000';
							ctx.shadowColor = 'black';
							ctx.shadowBlur = 4;
							ctx.fillText(
								char,
								colIdx * TILE_SIZE + 8,
								rowIdx * TILE_SIZE + 4,
							);
							ctx.shadowBlur = 0;
						}
					}
				});
			}
			ctx.globalAlpha = 1.0;
		});

		// Grid
		ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
		ctx.lineWidth = 1 / zoom;
		for (let i = 0; i < 50; i++) {
			ctx.beginPath();
			ctx.moveTo(i * TILE_SIZE, 0);
			ctx.lineTo(i * TILE_SIZE, 50 * TILE_SIZE);
			ctx.stroke();
			ctx.beginPath();
			ctx.moveTo(0, i * TILE_SIZE);
			ctx.lineTo(50 * TILE_SIZE, i * TILE_SIZE);
			ctx.stroke();
		}

		ctx.restore();
	}, [layers, visibleLayers, pan, zoom, imagesLoaded, activeLayerId]);

	// --- EDITING & INTERACTION HANDLERS ---
	const paintTile = (clientX: number, clientY: number) => {
		if (!activeLayerId) return;
		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();

		const gridX = (clientX - rect.left - pan.x) / zoom;
		const gridY = (clientY - rect.top - pan.y) / zoom;

		const col = Math.floor(gridX / TILE_SIZE);
		const row = Math.floor(gridY / TILE_SIZE);

		setLayers((prev) =>
			prev.map((layer) => {
				if (layer.id === activeLayerId && layer.type === 'data') {
					if (
						row >= 0 &&
						row < layer.data.length &&
						col >= 0 &&
						col < layer.data[row].length
					) {
						if (layer.data[row][col] !== selectedTileIndex) {
							const newData = [...layer.data];
							newData[row] = [...newData[row]];
							newData[row][col] = selectedTileIndex;
							return { ...layer, data: newData };
						}
					}
				}
				return layer;
			}),
		);
	};

	const handleWheel = (e: React.WheelEvent) => {
		const zoomDelta = -e.deltaY * 0.001;
		setZoom((prev) => Math.min(Math.max(0.5, prev + zoomDelta), 5));
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		setIsDragging(true);
		if (toolMode === 'pan') {
			setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
		} else if (toolMode === 'paint') {
			paintTile(e.clientX, e.clientY);
		}
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (isDragging) {
			if (toolMode === 'pan') {
				setPan({
					x: e.clientX - dragStart.x,
					y: e.clientY - dragStart.y,
				});
			} else if (toolMode === 'paint') {
				paintTile(e.clientX, e.clientY);
			}
			return;
		}

		const canvas = canvasRef.current;
		if (!canvas) return;
		const rect = canvas.getBoundingClientRect();

		const gridX = (e.clientX - rect.left - pan.x) / zoom;
		const gridY = (e.clientY - rect.top - pan.y) / zoom;
		const col = Math.floor(gridX / TILE_SIZE);
		const row = Math.floor(gridY / TILE_SIZE);

		if (col < 0 || row < 0) {
			setHoverData(null);
			return;
		}

		let foundHover = null;
		for (let i = layers.length - 1; i >= 0; i--) {
			const layer = layers[i];
			if (!visibleLayers.has(layer.id)) continue;

			if (layer.type === 'data') {
				const val = layer.data[row]?.[col];
				if (val !== undefined && val !== -1) {
					foundHover = {
						layerName: layer.name,
						tileIndex: val,
						col,
						row,
					};
					break;
				}
			} else if (layer.type === 'ascii') {
				const char = layer.data[row]?.[col];
				if (char && char !== ' ' && char !== '#') {
					foundHover = {
						layerName: layer.name,
						tileIndex: `'${char}'`,
						col,
						row,
					};
					break;
				}
			}
		}
		setHoverData(foundHover);
	};

	const handleMouseUp = () => setIsDragging(false);

	const toggleLayer = (id: string) => {
		const newVisible = new Set(visibleLayers);
		if (newVisible.has(id)) newVisible.delete(id);
		else newVisible.add(id);
		setVisibleLayers(newVisible);
	};

	// --- OUTPUT FORMATTER & COPY ---
	const generateOutputArray = () => {
		const activeLayer = layers.find((l) => l.id === activeLayerId);
		if (!activeLayer) return '// No active layer selected';

		if (activeLayer.type === 'data') {
			const rows = activeLayer.data.map((row: number[]) => {
				const formattedNumbers = row
					.map((n) => n.toString().padStart(2, ' '))
					.join(', ');
				return `    [${formattedNumbers}]`;
			});
			return `[\n${rows.join(',\n')}\n];`;
		}

		if (activeLayer.type === 'ascii') {
			const rows = activeLayer.data.map((row: string) => `    "${row}"`);
			return `[\n${rows.join(',\n')}\n];`;
		}
		return '';
	};

	const handleCopy = () => {
		const textToCopy = generateOutputArray();
		navigator.clipboard.writeText(textToCopy).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	return (
		<S.Container>
			<S.CanvasContainer onWheel={handleWheel}>
				<canvas
					ref={canvasRef}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseUp}
					style={{
						cursor:
							toolMode === 'paint'
								? 'crosshair'
								: isDragging
									? 'grabbing'
									: 'grab',
					}}
				/>
			</S.CanvasContainer>

			<S.Sidebar style={{ overflowY: 'auto' }}>
				{/* 1. LEVEL DROPDOWN */}
				<S.SectionTitle>Select Level</S.SectionTitle>
				<select
					value={selectedLevel}
					onChange={(e) => setSelectedLevel(e.target.value)}
					style={{
						width: '100%',
						padding: '8px',
						marginBottom: '16px',
						background: '#1a1a1a',
						color: '#fff',
						border: '1px solid #444',
						borderRadius: '4px',
						fontSize: '14px',
						fontWeight: 'bold',
						cursor: 'pointer',
					}}
				>
					{availableLevels.map((lvl) => (
						<option
							key={lvl}
							value={lvl}
						>
							📁 {lvl}
						</option>
					))}
				</select>

				<S.SectionTitle>Tools</S.SectionTitle>
				<div
					style={{
						display: 'flex',
						gap: '8px',
						marginBottom: '16px',
					}}
				>
					<button
						onClick={() => setToolMode('pan')}
						style={{
							flex: 1,
							padding: '8px',
							background: toolMode === 'pan' ? '#444' : '#222',
							color: 'white',
							border: '1px solid #555',
							cursor: 'pointer',
						}}
					>
						✋ Pan
					</button>
					<button
						onClick={() => setToolMode('paint')}
						style={{
							flex: 1,
							padding: '8px',
							background: toolMode === 'paint' ? '#444' : '#222',
							color: 'white',
							border: '1px solid #555',
							cursor: 'pointer',
						}}
					>
						🖌️ Paint
					</button>
				</div>

				<S.SectionTitle>Layers (Active / Visible)</S.SectionTitle>
				<S.LayerList>
					{[...layers].reverse().map((layer) => (
						<S.LayerItem
							key={layer.id}
							style={{
								display: 'flex',
								alignItems: 'center',
								gap: '8px',
							}}
						>
							<input
								type='radio'
								name='activeLayer'
								checked={activeLayerId === layer.id}
								onChange={() => setActiveLayerId(layer.id)}
								title='Set as Active Layer for Painting'
							/>
							<input
								type='checkbox'
								checked={visibleLayers.has(layer.id)}
								onChange={() => toggleLayer(layer.id)}
								title='Toggle Visibility'
							/>
							<span
								style={{
									fontWeight:
										activeLayerId === layer.id
											? 'bold'
											: 'normal',
								}}
							>
								{layer.name}{' '}
								{layer.type === 'ascii' && '(ASCII)'}
							</span>
						</S.LayerItem>
					))}
				</S.LayerList>

				<S.SectionTitle>Inspector</S.SectionTitle>
				<S.HoverInfoBox>
					{hoverData ? (
						<>
							<p>
								<strong>Layer:</strong> {hoverData.layerName}
							</p>
							<p>
								<strong>Tile Index:</strong>{' '}
								{hoverData.tileIndex}
							</p>
							<p>
								<strong>Grid [X,Y]:</strong> [{hoverData.col},{' '}
								{hoverData.row}]
							</p>
						</>
					) : (
						<p style={{ color: '#666' }}>Hover over a tile...</p>
					)}
				</S.HoverInfoBox>

				{/* 2. LAYER OUTPUT WITH COPY BUTTON */}
				<div
					style={{
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
				>
					<S.SectionTitle style={{ marginBottom: 0 }}>
						Layer Output
					</S.SectionTitle>
					<button
						onClick={handleCopy}
						style={{
							padding: '4px 8px',
							fontSize: '11px',
							background: copied ? '#28a745' : '#333',
							color: '#fff',
							border: '1px solid #555',
							borderRadius: '3px',
							cursor: 'pointer',
							transition: 'background 0.2s',
						}}
					>
						{copied ? '✓ Copied!' : '📋 Copy'}
					</button>
				</div>

				<textarea
					readOnly
					value={generateOutputArray()}
					style={{
						width: '100%',
						height: '150px',
						background: '#1a1a1a',
						color: '#00ff00',
						border: '1px solid #444',
						fontFamily: 'monospace',
						fontSize: '12px',
						padding: '8px',
						resize: 'vertical',
						marginTop: '8px',
						marginBottom: '16px',
						whiteSpace: 'pre',
					}}
				/>

				<S.SectionTitle>Tiles Palette</S.SectionTitle>
				<div
					style={{
						display: 'flex',
						flexWrap: 'wrap',
						gap: '4px',
						marginBottom: '20px',
					}}
				>
					<div
						onClick={() => {
							setSelectedTileIndex(-1);
							setToolMode('paint');
						}}
						style={{
							width: 32,
							height: 32,
							border:
								selectedTileIndex === -1
									? '2px solid red'
									: '1px solid #444',
							background: '#222',
							color: 'red',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							cursor: 'pointer',
							fontWeight: 'bold',
						}}
						title='Eraser (Index: -1)'
					>
						X
					</div>

					{tiles.map((tile, index) => (
						<div
							key={index}
							onClick={() => {
								setSelectedTileIndex(index);
								setToolMode('paint');
							}}
							style={{
								width: 32,
								height: 32,
								border:
									selectedTileIndex === index
										? '2px solid #00ff00'
										: '1px solid #444',
								backgroundImage: `url(${tile.imageSrc})`,
								backgroundPosition: `-${tile.coordinates.x[0] * TILE_SIZE}px -${tile.coordinates.y[0] * TILE_SIZE}px`,
								cursor: 'pointer',
								backgroundColor: '#000',
							}}
							title={`Index: ${index}`}
						/>
					))}
				</div>
			</S.Sidebar>
		</S.Container>
	);
};

export default DevTools;

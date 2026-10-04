import React, { useEffect, useRef, useState } from 'react';

import * as S from './DevToolsStyles';
import { tiles } from '../utils/tileMapping/AllTiles';

const TILE_SIZE = 32;

export interface ITile {
	imageSrc: string;
	size?: { horizontalTiles: number; verticalTiles: number };
	coordinates: { x: number[]; y: number[] };
	name?: string;
}

type LayerType = 'ascii' | 'data';
type ToolMode = 'pan' | 'paint';

interface LevelLayer {
	id: string;
	type: LayerType;
	name: string;
	data: any;
	zIndex: number;
}

const allLevelFiles = import.meta.glob('/public/levels/*/*.*', {
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
	const [selectedTileIndex, setSelectedTileIndex] = useState<number>(-1);
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
			const parts = path.split('/');
			// Updated to look for 'levels' folder instead of 'levels_dir'
			const dirIndex = parts.indexOf('levels');
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
			// Updated to use `/levels/` instead of `/levels_dir/`
			.filter((path) => path.includes(`/levels/${selectedLevel}/`))
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

	// --- CANVAS RENDERING WITH SIZE ACCOMMODATION ---
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

						const tileDef = tiles[tileIndex] as ITile;
						if (tileDef) {
							const img = imageCache.current[tileDef.imageSrc];
							if (img) {
								// Source Top-Left coordinates
								const sourceX =
									tileDef.coordinates.x[0] * TILE_SIZE;
								const sourceY =
									tileDef.coordinates.y[0] * TILE_SIZE;

								// Number of tiles to take from tileset
								const hTiles =
									tileDef.size?.horizontalTiles ?? 1;
								const vTiles = tileDef.size?.verticalTiles ?? 1;

								const sourceW = hTiles * TILE_SIZE;
								const sourceH = vTiles * TILE_SIZE;

								// Destination position anchor calculation:
								// Multi-tile sprites anchor at the top-left of their tile footprint
								const destX = colIdx * TILE_SIZE;
								const destY = rowIdx * TILE_SIZE;

								ctx.drawImage(
									img,
									sourceX,
									sourceY,
									sourceW,
									sourceH,
									destX,
									destY,
									sourceW,
									sourceH,
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
						if (char !== ' ') {
							ctx.fillStyle =
								char === '@' ? '#00ff00' : '#6acec6';
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
				<S.Canvas
					ref={canvasRef}
					onMouseDown={handleMouseDown}
					onMouseMove={handleMouseMove}
					onMouseUp={handleMouseUp}
					onMouseLeave={handleMouseUp}
					$cursor={
						toolMode === 'paint'
							? 'crosshair'
							: isDragging
								? 'grabbing'
								: 'grab'
					}
				/>
			</S.CanvasContainer>

			<S.Sidebar>
				<S.SectionTitle>Select Level</S.SectionTitle>
				<S.Select
					value={selectedLevel}
					onChange={(e) => setSelectedLevel(e.target.value)}
				>
					{availableLevels.map((lvl) => (
						<option
							key={lvl}
							value={lvl}
						>
							📁 {lvl}
						</option>
					))}
				</S.Select>

				<S.SectionTitle>Tools</S.SectionTitle>
				<S.ToolButtonGroup>
					<S.ToolButton
						$active={toolMode === 'pan'}
						onClick={() => setToolMode('pan')}
					>
						✋ Pan
					</S.ToolButton>
					<S.ToolButton
						$active={toolMode === 'paint'}
						onClick={() => setToolMode('paint')}
					>
						🖌️ Paint
					</S.ToolButton>
				</S.ToolButtonGroup>

				<S.SectionTitle>Layers (Active / Visible)</S.SectionTitle>
				<S.LayerList>
					{[...layers].reverse().map((layer) => (
						<S.LayerItem key={layer.id}>
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
							<S.LayerName $active={activeLayerId === layer.id}>
								{layer.name}{' '}
								{layer.type === 'ascii' && '(ASCII)'}
							</S.LayerName>
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
						<S.MutedText>Hover over a tile...</S.MutedText>
					)}
				</S.HoverInfoBox>

				<S.OutputHeader>
					<S.SectionTitle $noMarginBottom>
						Layer Output
					</S.SectionTitle>
					<S.CopyButton
						$copied={copied}
						onClick={handleCopy}
					>
						{copied ? '✓ Copied!' : '📋 Copy'}
					</S.CopyButton>
				</S.OutputHeader>

				<S.OutputTextArea
					readOnly
					value={generateOutputArray()}
				/>

				<S.SectionTitle>Tiles Palette</S.SectionTitle>
				<S.PaletteContainer>
					<S.EraserTile
						$selected={selectedTileIndex === -1}
						onClick={() => {
							setSelectedTileIndex(-1);
							setToolMode('paint');
						}}
						title='Eraser (Index: -1)'
					>
						X
					</S.EraserTile>

					{tiles.map((tile: ITile, index) => {
						const hTiles = tile.size?.horizontalTiles ?? 1;
						const vTiles = tile.size?.verticalTiles ?? 1;

						return (
							<S.PaletteTile
								key={index}
								$selected={selectedTileIndex === index}
								$imageSrc={tile.imageSrc}
								$posX={tile.coordinates.x[0] * TILE_SIZE}
								$posY={tile.coordinates.y[0] * TILE_SIZE}
								$hTiles={hTiles}
								$vTiles={vTiles}
								onClick={() => {
									setSelectedTileIndex(index);
									setToolMode('paint');
								}}
								title={`Index: ${index} | ${tile.name || 'Unnamed tile'} (${hTiles}x${vTiles})`}
							/>
						);
					})}
				</S.PaletteContainer>
			</S.Sidebar>
		</S.Container>
	);
};

export default DevTools;

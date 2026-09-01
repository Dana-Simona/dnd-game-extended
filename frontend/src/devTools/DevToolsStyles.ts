import styled from 'styled-components';

export const Container = styled.div`
	display: flex;
	width: 100vw;
	height: 100vh;
	background-color: #121212;
	color: #ffffff;
	font-family: sans-serif;
	overflow: hidden;
`;

export const CanvasContainer = styled.div`
	flex: 1;
	height: 100%;
	position: relative;
	background-color: #1e1e1e;
	overflow: hidden;
`;

export const Canvas = styled.canvas<{ $cursor: string }>`
	width: 100%;
	height: 100%;
	display: block;
	cursor: ${(props) => props.$cursor};
`;

export const Sidebar = styled.div`
	width: 320px;
	height: 100%;
	background-color: #252526;
	border-left: 1px solid #333333;
	padding: 16px;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	overflow-y: auto;
`;

export const SectionTitle = styled.h3<{ $noMarginBottom?: boolean }>`
	font-size: 14px;
	text-transform: uppercase;
	letter-spacing: 1px;
	color: #888888;
	margin-top: 16px;
	margin-bottom: ${(props) => (props.$noMarginBottom ? '0px' : '8px')};

	&:first-of-type {
		margin-top: 0;
	}
`;

export const Select = styled.select`
	width: 100%;
	padding: 8px;
	margin-bottom: 16px;
	background-color: #1a1a1a;
	color: #ffffff;
	border: 1px solid #444444;
	border-radius: 4px;
	font-size: 14px;
	font-weight: bold;
	cursor: pointer;
	outline: none;

	&:focus {
		border-color: #007acc;
	}
`;

export const ToolButtonGroup = styled.div`
	display: flex;
	gap: 8px;
	margin-bottom: 16px;
`;

export const ToolButton = styled.button<{ $active: boolean }>`
	flex: 1;
	padding: 8px;
	background-color: ${(props) => (props.$active ? '#444444' : '#222222')};
	color: #ffffff;
	border: 1px solid #555555;
	cursor: pointer;
	font-size: 13px;
	border-radius: 4px;
	transition: background-color 0.2s;

	&:hover {
		background-color: ${(props) => (props.$active ? '#555555' : '#333333')};
	}
`;

export const LayerList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
	margin-bottom: 16px;
	max-height: 150px;
	overflow-y: auto;
`;

export const LayerItem = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	padding: 4px;
	background-color: #1e1e1e;
	border-radius: 3px;
`;

export const LayerName = styled.span<{ $active: boolean }>`
	font-weight: ${(props) => (props.$active ? 'bold' : 'normal')};
	color: ${(props) => (props.$active ? '#00ffcc' : '#ffffff')};
	font-size: 13px;
`;

export const HoverInfoBox = styled.div`
	background-color: #1a1a1a;
	border: 1px solid #333333;
	padding: 10px;
	border-radius: 4px;
	font-size: 12px;
	margin-bottom: 16px;

	p {
		margin: 4px 0;
	}

	p:first-of-type {
		margin-top: 0;
	}

	p:last-of-type {
		margin-bottom: 0;
	}
`;

export const MutedText = styled.p`
	color: #666666;
	margin: 0;
`;

export const OutputHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

export const CopyButton = styled.button<{ $copied: boolean }>`
	padding: 4px 8px;
	font-size: 11px;
	background-color: ${(props) => (props.$copied ? '#28a745' : '#333333')};
	color: #ffffff;
	border: 1px solid #555555;
	border-radius: 3px;
	cursor: pointer;
	transition: background-color 0.2s;

	&:hover {
		background-color: ${(props) => (props.$copied ? '#218838' : '#444444')};
	}
`;

export const OutputTextArea = styled.textarea`
	width: 100%;
	height: 150px;
	background-color: #1a1a1a;
	color: #00ffcc;
	border: 1px solid #444444;
	font-family: monospace;
	font-size: 12px;
	padding: 8px;
	resize: vertical;
	margin-top: 8px;
	margin-bottom: 16px;
	white-space: pre;
	box-sizing: border-box;

	&:focus {
		outline: none;
		border-color: #007acc;
	}
`;

export const PaletteContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
	margin-bottom: 20px;
`;

export const EraserTile = styled.div<{ $selected: boolean }>`
	width: 32px;
	height: 32px;
	border: ${(props) =>
		props.$selected ? '2px solid #ff0000' : '1px solid #444444'};
	background-color: #222222;
	color: #ff0000;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	font-weight: bold;
	box-sizing: border-box;
`;

export const PaletteTile = styled.div<{
	$selected: boolean;
	$imageSrc: string;
	$posX: number;
	$posY: number;
	$hTiles: number;
	$vTiles: number;
}>`
	width: 32px;
	height: 32px;
	border: ${(props) =>
		props.$selected ? '2px solid #00ffcc' : '1px solid #444444'};
	background-image: url(${(props) => props.$imageSrc});
	background-position: -${(props) => props.$posX}px -${(props) =>
			props.$posY}px;
	background-color: #000000;
	cursor: pointer;
	box-sizing: border-box;
`;

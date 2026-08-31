import styled from 'styled-components';

export const Container = styled.div`
	display: flex;
	width: 100vw;
	height: 100vh;
	background-color: #1e1e1e;
	color: #e0e0e0;
	font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
	overflow: hidden;
`;

export const CanvasContainer = styled.div`
	flex: 1;
	position: relative;
	cursor: grab;

	&:active {
		cursor: grabbing;
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
	}
`;

export const Sidebar = styled.aside`
	width: 320px;
	background-color: #252526;
	border-left: 1px solid #333;
	display: flex;
	flex-direction: column;
	padding: 20px;
	box-sizing: border-box;
`;

export const SectionTitle = styled.h3`
	margin-top: 0;
	margin-bottom: 15px;
	font-size: 1.1rem;
	color: #fff;
	border-bottom: 1px solid #444;
	padding-bottom: 5px;
`;

export const LayerList = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	margin-bottom: 30px;
`;

export const LayerItem = styled.label`
	display: flex;
	align-items: center;
	gap: 10px;
	cursor: pointer;
	font-size: 0.95rem;

	input {
		cursor: pointer;
	}
`;

export const HoverInfoBox = styled.div`
	background-color: #1e1e1e;
	border: 1px solid #333;
	border-radius: 6px;
	padding: 15px;
	font-family: monospace;
	font-size: 0.9rem;
	color: #9cdcfe;

	p {
		margin: 5px 0;
	}

	strong {
		color: #d4d4d4;
	}
`;

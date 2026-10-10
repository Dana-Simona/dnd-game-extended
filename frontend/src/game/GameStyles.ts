import styled from 'styled-components';
import {
	GAME_COLUMN_WIDTH,
	GAME_PADDING_PX,
} from './gameBoard/GameBoardStyles';

export const Container = styled.div`
	background-color: #121212;
	color: #00ffcc;
	min-height: 100vh;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	font-family: monospace;
	box-sizing: border-box;
	padding: ${GAME_PADDING_PX}px;
`;

export const GameColumn = styled.div`
	width: ${GAME_COLUMN_WIDTH};
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

export const Stats = styled.div`
    display: flex;
    width: 100%;
    gap: 16px;
    align-items: flex-start;
    height: 200px;
    overflow: hidden;
`;

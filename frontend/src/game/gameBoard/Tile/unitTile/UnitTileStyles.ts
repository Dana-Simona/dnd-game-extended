import styled from 'styled-components';

interface PositionedSpriteProps {
	$frameHeight: number;
	$offsetY?: number;
}

export const EnemyNameContainer = styled.div`
	position: absolute;
	top: 5px;
	left: 50%;
	transform: translateX(-50%);
	width: max-content;
	height: auto;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	gap: 0px;
	z-index: 10;
	user-select: none;
	pointer-events: none;
`;

export const EnemyName = styled.span`
	font-family: monospace;
	font-size: 5px;
	font-weight: 500;
	text-align: center;
	color: #ffffff;
	line-height: 1;
	white-space: nowrap;
`;

export const PositionedSpriteContainer = styled.div<PositionedSpriteProps>`
	position: absolute;
	left: 50%;
	top: 0;
	pointer-events: none;
	transform: translate(
		-50%,
		calc(
			-${(props) => props.$frameHeight - 32}px +
				${(props) => props.$offsetY || 0}px
		)
	);
`;

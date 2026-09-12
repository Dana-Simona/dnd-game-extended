import styled from 'styled-components';

export const BarContainer = styled.div`
	position: absolute;
	top: 20px;
	left: 50%;
	transform: translateX(-50%);
	width: 32px;
	height: 6px;
	background-color: rgba(10, 10, 12, 0.75);
	border-radius: 2px;
	backdrop-filter: blur(4px);
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 10;
	user-select: none;
`;

export const BarFill = styled.div<{ $percentage: number }>`
	position: absolute;
	top: 0;
	left: 0;
	height: 100%;
	width: ${({ $percentage }) => $percentage}%;
	border-radius: 1px;
	background-color: #ef4444;

	transition:
		width 0.3s cubic-bezier(0.16, 1, 0.3, 1),
		background 0.3s ease;
`;

export const HealthText = styled.span`
	position: relative;
	z-index: 1;
	font-family:
		-apple-system, BlinkMacSystemFont, 'Inter', 'SF Pro Text', sans-serif;
	font-size: 5px;
	font-weight: 300;
	text-align: center;
	letter-spacing: 0.2px;
	color: #ffffff;
	line-height: 0.8;
	pointer-events: none;

	display: flex;
	align-items: center;
	justify-content: center;
	width: 100%;

	span {
		opacity: 0.7;
		font-size: 4px;
		font-weight: 300;
		margin-left: 0.5px;
	}
`;

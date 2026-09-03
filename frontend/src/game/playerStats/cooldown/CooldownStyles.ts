import styled from 'styled-components';

export const CooldownContainer = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	background: #222;
	padding: 10px 14px;
	border-radius: 6px;
	border: 1px solid #333;
	margin-bottom: 12px;
`;

export const CooldownTextGroup = styled.div`
	display: flex;
	flex-direction: column;
`;

export const CooldownTitle = styled.span`
	font-size: 0.85rem;
	color: #aaa;
`;

export const CooldownStatus = styled.span<{ $isReady: boolean }>`
	font-size: 0.9rem;
	font-weight: bold;
	color: ${(props) => (props.$isReady ? '#2ecc71' : '#ff4d4d')};
`;

export const RadialWrapper = styled.div<{ $isOnCooldown: boolean }>`
	position: relative;
	width: 44px;
	height: 44px;
	display: flex;
	align-items: center;
	justify-content: center;

	svg.icon {
		width: 22px;
		height: 22px;
		fill: currentColor;
		color: ${(props) => (props.$isOnCooldown ? '#666' : '#2ecc71')};
		filter: ${(props) =>
			props.$isOnCooldown ? 'grayscale(100%)' : 'none'};
		transition: all 0.3s ease;
	}
`;

export const SvgCircle = styled.svg`
	position: absolute;
	top: 0;
	left: 0;
	transform: rotate(-90deg);
`;

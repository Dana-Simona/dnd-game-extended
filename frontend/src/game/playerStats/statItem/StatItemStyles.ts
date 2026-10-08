import styled from 'styled-components';

export type TooltipAlign = 'left' | 'center' | 'right';

export const StatTooltip = styled.div<{
	$color?: string;
	$align: TooltipAlign;
}>`
	position: absolute;
	bottom: calc(100% + 8px);
	z-index: 20;
	width: 200px;
	padding: 8px 10px;
	box-sizing: border-box;
	background: #0d0d0d;
	border: 1px solid ${(props) => props.$color || '#555'};
	border-radius: 6px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6);
	color: #cfcfcf;
	font-size: 0.75rem;
	font-weight: normal;
	line-height: 1.4;
	text-align: left;
	pointer-events: none;
	opacity: 0;
	visibility: hidden;
	transform: translateY(4px);
	transition:
		opacity 0.15s ease,
		transform 0.15s ease,
		visibility 0.15s;

	${(props) =>
		props.$align === 'left'
			? 'left: 0;'
			: props.$align === 'right'
				? 'right: 0;'
				: 'left: 50%; margin-left: -100px;'}
`;

export const StatBox = styled.div<{ $hasTooltip?: boolean }>`
	position: relative;
	background: #222;
	padding: 8px 12px;
	border-radius: 6px;
	border: 1px solid #333;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-weight: bold;
	font-size: 0.9rem;
	cursor: ${(props) => (props.$hasTooltip ? 'help' : 'default')};
	outline: none;

	&:hover,
	&:focus-visible {
		${(props) => (props.$hasTooltip ? 'background: #292929;' : '')}
	}

	&:hover > ${StatTooltip}, &:focus-visible > ${StatTooltip} {
		opacity: 1;
		visibility: visible;
		transform: translateY(0);
	}
`;

export const StatBoxLabel = styled.span`
	color: #aaa;
	font-size: 0.8rem;
`;

export const StatValue = styled.span<{ $color?: string }>`
	color: ${(props) => props.$color || '#e0e0e0'};
`;

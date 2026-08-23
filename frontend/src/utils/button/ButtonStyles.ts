import styled, { css } from 'styled-components';

interface ActionButtonProps {
	$variant?: 'Primary' | 'Secondary';
}

export const ActionButton = styled.button<ActionButtonProps>`
	font-family: monospace;
	font-size: 1.1rem;
	padding: 12px 20px;
	border-radius: 4px;
	cursor: pointer;
	transition:
		background-color 0.2s ease-in-out,
		border-color 0.2s ease-in-out,
		color 0.2s ease-in-out,
		box-shadow 0.2s ease-in-out;
	background-color: #000;

	/* Primary Variant (Default) */
	${(props) =>
		props.$variant !== 'Secondary' &&
		css`
			color: #00ffcc;
			border: 2px solid #00ffcc;
			box-shadow: 0 0 8px rgba(0, 255, 204, 0.1);

			&:hover {
				background-color: #00ffcc;
				color: #121212;
				box-shadow: 0 0 15px rgba(0, 255, 204, 0.6);
				transform: translateY(-2px);
			}
		`}

	/* Secondary Variant */
    ${(props) =>
		props.$variant === 'Secondary' &&
		css`
			color: #00a887;
			border: 2px solid #005c4a;
			box-shadow: none;

			&:hover {
				background-color: rgba(0, 255, 204, 0.05);
				color: #00ffcc;
				border-color: #00a887;
				box-shadow: 0 0 6px rgba(0, 255, 204, 0.25);
			}
		`}

    &:active {
		transform: translateY(0);
	}

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}
`;

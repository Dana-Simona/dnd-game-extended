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
    transition: all 0.2s ease-in-out;
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
            color: #a0a0a0;
            border: 2px solid #555555;
            box-shadow: 0 0 8px rgba(255, 255, 255, 0.05);

            &:hover {
                background-color: #333333;
                color: #ffffff;
                border-color: #888888;
                box-shadow: 0 0 12px rgba(255, 255, 255, 0.2);
                transform: translateY(-2px);
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
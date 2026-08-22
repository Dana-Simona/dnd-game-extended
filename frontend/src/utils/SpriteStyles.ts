import styled, { keyframes, css } from 'styled-components';

interface StyledBoxProps {
    $imagePath: string;
    $width: number;
    $height: number;
    $totalWidth: number;
    $frameCount: number;
    $duration: number;
}

const moveSprite = (totalWidth: number) => keyframes`
    from { background-position-x: 0px; }
    to { background-position-x: -${totalWidth}px; }
`;

export const SpriteBox = styled.div<StyledBoxProps>`
    width: ${(p) => p.$width}px;
    height: ${(p) => p.$height}px;
    background-image: url(${(p) => p.$imagePath});
    background-repeat: no-repeat;
    background-position-y: 0px;
    image-rendering: pixelated;
    animation: ${(p) =>
        css`
            ${moveSprite(p.$totalWidth)} ${p.$duration}s steps(${p.$frameCount}) infinite
        `};
`;
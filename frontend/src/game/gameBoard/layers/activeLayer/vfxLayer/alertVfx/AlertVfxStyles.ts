import styled from 'styled-components';

export const AlertOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	pointer-events: none;
	z-index: 9999;
`;

import { motion } from 'framer-motion';
import styled from 'styled-components';

export const Wrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: start;
	width: 100%;
	min-height: 100vh;
	overflow: hidden;
`;

export const GrowingContainer = styled(motion.div)`
	position: relative;
	width: 500px;
	height: 500px;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const StaggeredLogo = styled(motion.div)`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const LayerWrapper = styled(motion.div)`
	position: absolute;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export const LayerImg = styled(motion.img)`
	position: absolute;
	max-width: 100%;
	max-height: 100%;
	object-fit: contain;
`;

export const BgFrameImg = styled(LayerImg)`
	width: 100%;
	opacity: 0.5;
`;

export const VHolderImg = styled(LayerImg)`
	bottom: 25%;
`;

export const WingImg = styled(LayerImg)`
	transform-origin: 20% 80%;
	right: -10%;
`;

export const MirroredWrapper = styled(motion.div)`
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	transform: scaleX(-1);
`;

export const ArmorRightImg = styled(LayerImg)`
	right: 20%;
	bottom: 20%;
`;

export const ArmorLeftImg = styled(LayerImg)`
	transform: scaleX(-1);
	left: 20%;
	bottom: 20%;
`;

export const LevelTextImg = styled(LayerImg)`
	top: 0%;
`;

export const LevelNumber = styled(motion.div)`
	position: absolute;
	bottom: 10%;
	font-size: 4.5rem;
	font-weight: 900;
	color: #ffffff;
	font-family: 'Arial Black', sans-serif;
	text-shadow:
		0px 4px 15px rgba(230, 40, 40, 0.8),
		0px 0px 5px rgba(255, 255, 255, 0.5);
	z-index: 10;
`;

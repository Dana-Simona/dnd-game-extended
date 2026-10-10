import React from 'react';
import styled from 'styled-components';
import { motion, type Transition, type Variants } from 'framer-motion';

const topBarVariants: Variants = {
	initial: { y: '-100%' },
	animate: { y: '0%' },
	exit: { y: '-100%' },
};

const bottomBarVariants: Variants = {
	initial: { y: '100%' },
	animate: { y: '0%' },
	exit: { y: '100%' },
};

const transition: Transition = {
	duration: 0.5,
	ease: [0.77, 0, 0.175, 1],
};

const Container = styled(motion.div)`
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	pointer-events: none;
	z-index: 9999;
	overflow: hidden;
`;

const Bar = styled(motion.div)`
	width: 100%;
	height: 12%;
	background-color: #000000;
	pointer-events: auto;
	will-change: transform;
`;

const LetterBox: React.FC = () => {
	return (
		<Container>
			<Bar
				variants={topBarVariants}
				initial='initial'
				animate='animate'
				exit='exit'
				transition={transition}
			/>
			<Bar
				variants={bottomBarVariants}
				initial='initial'
				animate='animate'
				exit='exit'
				transition={transition}
			/>
		</Container>
	);
};

export default LetterBox;

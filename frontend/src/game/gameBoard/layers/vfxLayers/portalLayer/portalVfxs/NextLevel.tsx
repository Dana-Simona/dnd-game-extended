import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useAnimation } from 'framer-motion';
import styled from 'styled-components';
import type { VfxItem } from '../../../../../../constants/animationStates/vfxStates';

interface Props {
	item: VfxItem;
}

const NextLevel: React.FC<Props> = ({ item }) => {

	console.log('spawned')
	const [mounted, setMounted] = useState(false);

	const textControls = useAnimation();
	const boxControls = useAnimation();
	const shineControls = useAnimation();

	useEffect(() => {
		setMounted(true);
	}, []);

	useEffect(() => {
		if (!mounted) return;

		const runAnimationSequence = async () => {
			await textControls.start({
				scale: [0, 1.3],
				y: [-150, -100],
				opacity: [0, 1],
				transition: { duration: 0.5, type: 'spring', bounce: 0.6 },
			});

			await new Promise((resolve) => setTimeout(resolve, 250));

			await Promise.all([
				textControls.start({
					scale: 1,
					y: 0,
					transition: {
						type: 'spring',
						stiffness: 400,
						damping: 12,
						mass: 2.5,
					},
				}),
				boxControls.start({
					width: '600px',
					transition: {
						type: 'spring',
						stiffness: 300,
						damping: 20,
					},
				}),
			]);

			await shineControls.start({
				left: ['-100%', '200%'],
				transition: {
					duration: 1.2,
					ease: [0.8, 0, 0.2, 1],
				},
			});
		};

		runAnimationSequence();
	}, [mounted, textControls, boxControls, shineControls]);

	if (!mounted) return null;

	return createPortal(
		<PortalOverlay>
			<AnimationContainer>
				<SilverRectangle
					initial={{ width: 100 }}
					animate={boxControls}
				>
					<ShineDiv animate={shineControls} />
				</SilverRectangle>

				<Title
					initial={{ opacity: 0, scale: 0 }}
					animate={textControls}
				>
					Level {item.amount}
				</Title>
			</AnimationContainer>
		</PortalOverlay>,
		document.body,
	);
};

export default NextLevel;

const PortalOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	pointer-events: none; 
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 9999;
`;

const AnimationContainer = styled.div`
	position: relative;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const SilverRectangle = styled(motion.div)`
	position: absolute;
	height: 100px;
	width: 100px;
	background: linear-gradient(135deg, #e6e6e6 0%, #ffffff 40%, #a6a6a6 100%);
	border: 2px solid #ffffff;
	box-shadow:
		0 25px 50px -12px rgba(0, 0, 0, 0.5),
		inset 0 4px 15px rgba(255, 255, 255, 0.9),
		inset 0 -4px 15px rgba(0, 0, 0, 0.2);
	border-radius: 12px;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
`;

const ShineDiv = styled(motion.div)`
	position: absolute;
	top: 0;
	left: -100%;
	width: 50%;
	height: 100%;
	background: linear-gradient(
		to right,
		rgba(255, 255, 255, 0) 0%,
		rgba(255, 255, 255, 0.9) 50%,
		rgba(255, 255, 255, 0) 100%
	);
	filter: blur(8px);
	transform: skewX(-25deg);
`;

const Title = styled(motion.h1)`
	position: relative;
	font-family: 'Arial Black', Impact, sans-serif;
	font-size: 3.5rem;
	font-weight: 900;
	color: #222;
	margin: 0;
	text-transform: uppercase;
	letter-spacing: 2px;
	-webkit-text-stroke: 1.5px #fff;
	text-shadow: 0px 10px 20px rgba(0, 0, 0, 0.4);
	z-index: 10;
`;

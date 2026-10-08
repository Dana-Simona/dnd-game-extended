import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styled from 'styled-components';

const TEAL = '#00ffcc';
const DARK_GRAY = '#16191bba';
const LIGHT_GRAY = '#575f66c5';

const PANEL_HEIGHT = 220;
const SHINE_WIDTH = 60;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const NextLevel: React.FC = () => {
	const titleControls = useAnimation();
	const panelControls = useAnimation();
	const glowControls = useAnimation();
	const leftShineControls = useAnimation();
	const rightShineControls = useAnimation();
	const nextTextControls = useAnimation();

	useEffect(() => {
		let cancelled = false;

		const run = async () => {
			const travel = window.innerWidth * 0.7;

			await titleControls.start({
				opacity: 1,
				transition: { duration: 0.5, ease: 'easeOut' },
			});
			if (cancelled) return;

			await panelControls.start({
				opacity: 1,
				transition: { duration: 0.25 },
			});
			if (cancelled) return;

			await panelControls.start({
				width: '100vw',
				transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
			});
			if (cancelled) return;

			await Promise.all([
				panelControls.start({
					height: PANEL_HEIGHT,
					transition: { duration: 0.5, ease: [0.76, 0, 0.24, 1] },
				}),
				leftShineControls.start({
					opacity: 1,
					transition: { duration: 0.4 },
				}),
				rightShineControls.start({
					opacity: 1,
					transition: { duration: 0.4 },
				}),
			]);
			if (cancelled) return;

			await wait(150);
			if (cancelled) return;

			const slide = { duration: 0.55, ease: [0.7, 0, 1, 0.5] as const };
			await Promise.all([
				leftShineControls.start({ x: -travel, transition: slide }),
				rightShineControls.start({ x: travel, transition: slide }),
				glowControls.start({
					opacity: 1,
					transition: { duration: 0.35, ease: 'easeOut' },
				}),
			]);
			if (cancelled) return;

			await Promise.all([
				leftShineControls.start({
					opacity: 0,
					transition: { duration: 0.1 },
				}),
				rightShineControls.start({
					opacity: 0,
					transition: { duration: 0.1 },
				}),
				glowControls.start({
					opacity: 0,
					transition: { duration: 0.4, ease: 'easeInOut' },
				}),
			]);
			if (cancelled) return;

			await nextTextControls.start({
				opacity: 1,
				y: 0,
				transition: { duration: 0.4, ease: 'easeOut' },
			});
		};

		run();

		return () => {
			cancelled = true;
		};
	}, [
		titleControls,
		panelControls,
		glowControls,
		leftShineControls,
		rightShineControls,
		nextTextControls,
	]);

	return (
		<Container>
			<Title
				initial={{ opacity: 0 }}
				animate={titleControls}
			>
				Level
			</Title>

			<Panel
				initial={{ width: 80, height: 0, opacity: 0 }}
				animate={panelControls}
			>
				<Glow
					initial={{ opacity: 0 }}
					animate={glowControls}
				/>

				<Shine
					$side='left'
					initial={{ x: 0, opacity: 0 }}
					animate={leftShineControls}
				/>
				<Shine
					$side='right'
					initial={{ x: 0, opacity: 0 }}
					animate={rightShineControls}
				/>

				<NextText
					initial={{ opacity: 0, y: 10 }}
					animate={nextTextControls}
				>
					CLEARED
				</NextText>
			</Panel>
		</Container>
	);
};

export default NextLevel;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	align-items: center;
	justify-content: start;
	padding-top: 30%;
`;

const Title = styled(motion.h1)`
	margin: 0 0 12px 0;
	font-family: monospace;
	font-size: 3.5rem;
	font-weight: 900;
	letter-spacing: 4px;
	text-transform: uppercase;
	color: ${TEAL};
	text-shadow: 0 0 24px rgba(20, 184, 166, 0.45);
	white-space: nowrap;
`;

const Panel = styled(motion.div)`
	position: relative;
	box-sizing: border-box;
	flex-shrink: 0;
	overflow: hidden;
	background: ${DARK_GRAY};
	border-top: 4px solid ${TEAL};
	display: flex;
	align-items: center;
	justify-content: center;
`;

const Glow = styled(motion.div)`
	position: absolute;
	inset: 0;
	background: radial-gradient(
		ellipse at center,
		${LIGHT_GRAY} 0%,
		${DARK_GRAY} 70%
	);
	pointer-events: none;
`;

const Shine = styled(motion.div)<{ $side: 'left' | 'right' }>`
	position: absolute;
	top: -20%;
	left: calc(50% - ${SHINE_WIDTH / 2}px);
	width: ${SHINE_WIDTH}px;
	height: 140%;
	background: linear-gradient(
		to right,
		rgba(255, 255, 255, 0) 0%,
		rgba(255, 255, 255, 0.75) 50%,
		rgba(255, 255, 255, 0) 100%
	);
	filter: blur(4px);
	transform: skewX(${({ $side }) => ($side === 'left' ? '-25deg' : '25deg')});
	pointer-events: none;
`;

const NextText = styled(motion.div)`
	position: relative;
	z-index: 2;
	font-family: monospace;
	font-size: 2.2rem;
	font-weight: 900;
	letter-spacing: 3px;
	text-transform: uppercase;
	color: #f2f5f7;
	white-space: nowrap;
`;

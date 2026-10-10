import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import styled from 'styled-components';

const TEAL = '#00ffcc';
const SLATE = '#0b0e10';
const SLATE_LIGHT = '#141a1d';
const DARK_GRAY = `linear-gradient(180deg, ${SLATE} 0%, ${SLATE_LIGHT} 100%)`;
const TEAL_GLOW = 'rgba(0, 255, 204, 0.22)';
const TEXT = '#e0e0e0';

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
	text-shadow: 0 0 10px rgba(0, 255, 204, 0.5);
	white-space: nowrap;
`;

const Panel = styled(motion.div)`
	position: relative;
	box-sizing: border-box;
	flex-shrink: 0;
	overflow: hidden;
	background: ${DARK_GRAY};
	border-top: 2px solid ${TEAL};
	border-bottom: 2px solid ${TEAL};
	box-shadow:
		0 0 15px rgba(0, 255, 204, 0.3),
		inset 0 0 24px rgba(0, 0, 0, 0.8);
	display: flex;
	align-items: center;
	justify-content: center;

	&::after {
		content: '';
		position: absolute;
		inset: 0;
		z-index: 1;
		pointer-events: none;
		background: repeating-linear-gradient(
			to bottom,
			rgba(0, 0, 0, 0) 0px,
			rgba(0, 0, 0, 0) 2px,
			rgba(0, 0, 0, 0.18) 3px,
			rgba(0, 0, 0, 0.18) 4px
		);
	}
`;

const Glow = styled(motion.div)`
	position: absolute;
	inset: 0;
	background: radial-gradient(
		ellipse at center,
		${TEAL_GLOW} 0%,
		rgba(11, 14, 16, 0) 70%
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
		rgba(180, 255, 240, 0.7) 50%,
		rgba(255, 255, 255, 0) 100%
	);
	filter: blur(1px);
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
	color: ${TEXT};
	text-shadow:
		0 0 10px rgba(0, 255, 204, 0.5),
		0 2px 0 #000;
	white-space: nowrap;

	&::before,
	&::after {
		content: '◆';
		display: inline-block;
		margin: 0 18px;
		font-size: 0.9rem;
		vertical-align: middle;
		color: ${TEAL};
	}
`;

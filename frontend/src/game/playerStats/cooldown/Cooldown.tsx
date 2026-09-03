import React from 'react';
import {
	CooldownContainer,
	CooldownTextGroup,
	CooldownTitle,
	CooldownStatus,
	RadialWrapper,
	SvgCircle,
} from './CooldownStyles';

interface Props {
	currentCooldown: number;
	maxCooldown: number;
}

export const Cooldown: React.FC<Props> = ({ currentCooldown, maxCooldown }) => {
	const isReady = currentCooldown === 0;
	const size = 44;
	const strokeWidth = 4;
	const radius = (size - strokeWidth) / 2;
	const circumference = 2 * Math.PI * radius;

	const percent = isReady
		? 100
		: Math.max(
				0,
				((maxCooldown - currentCooldown) / (maxCooldown || 1)) * 100,
			);

	const strokeDashoffset = circumference - (percent / 100) * circumference;

	return (
		<CooldownContainer>
			<CooldownTextGroup>
				<CooldownTitle>Ability Cooldown</CooldownTitle>
				<CooldownStatus $isReady={isReady}>
					{isReady ? 'Ready' : `${currentCooldown} turns`}
				</CooldownStatus>
			</CooldownTextGroup>

			<RadialWrapper $isOnCooldown={!isReady}>
				<SvgCircle
					width={size}
					height={size}
				>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke='#333'
						strokeWidth={strokeWidth}
						fill='none'
					/>
					<circle
						cx={size / 2}
						cy={size / 2}
						r={radius}
						stroke={isReady ? '#2ecc71' : '#e74c3c'}
						strokeWidth={strokeWidth}
						fill='none'
						strokeDasharray={circumference}
						strokeDashoffset={strokeDashoffset}
						strokeLinecap='round'
						style={{ transition: 'stroke-dashoffset 0.3s ease' }}
					/>
				</SvgCircle>

				<svg
					className='icon'
					viewBox='0 0 24 24'
				>
					<path d='M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0 2C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm1-10h3a1 1 0 1 1 0 2h-4a1 1 0 0 1-1-1V7a1 1 0 1 1 2 0v5z' />
				</svg>
			</RadialWrapper>
		</CooldownContainer>
	);
};

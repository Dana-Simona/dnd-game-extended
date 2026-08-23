import React from 'react';
import { ActionButton } from './ButtonStyles';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: 'Primary' | 'Secondary';
}

export const Button: React.FC<ButtonProps> = ({
	children,
	variant = 'Primary',
	...rest
}) => {
	return (
		<ActionButton
			$variant={variant}
			{...rest}
		>
			{children}
		</ActionButton>
	);
};

export default Button;

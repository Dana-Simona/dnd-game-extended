import React from 'react';
import {
	ArrowSection,
	ArrowHeader,
	ArrowCountValue,
	CircleGrid,
	ArrowDot,
} from './ArrowsStyles';

interface Props {
	arrowCount: number;
}

export const Arrows: React.FC<Props> = ({ arrowCount }) => {
	return (
		<ArrowSection>
			<ArrowHeader>
				<span>Arrows</span>
				<ArrowCountValue>
					{arrowCount}
				</ArrowCountValue>
			</ArrowHeader>

			<CircleGrid>
				{Array.from({ length: arrowCount }).map((_, index) => (
					<ArrowDot
						key={index}
					/>
				))}
			</CircleGrid>
		</ArrowSection>
	);
};

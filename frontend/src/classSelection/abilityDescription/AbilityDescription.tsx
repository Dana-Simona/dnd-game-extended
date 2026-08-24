import { TextContainer } from './AbilityDescriptionStyles';

interface Props {
	description: string;
}

const AbilityDescription: React.FC<Props> = ({ description }) => {
	return <TextContainer>{description}</TextContainer>;
};

export default AbilityDescription;

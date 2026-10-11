import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../../../utils/button/Button';
import { ROUTES } from '../../../../../../constants/routes';

const Lose: React.FC = () => {
	const navigate = useNavigate();

	console.log('lost')
	return (
		<Container>
			<Button
			onClick={() => navigate(ROUTES.CHARACTER_SELECTION)}
			>Start Over</Button>
		</Container>
	);
};

export default Lose;

const Container = styled.div`
	display: flex;
	flex-direction: column;
	height: 100%;
	width: 100%;
	align-items: center;
	justify-content: start;
	background-color: black;
	filter: opacity(0.5);
`;
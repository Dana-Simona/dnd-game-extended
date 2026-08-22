import { useNavigate } from 'react-router-dom';
import {
	Container,
	ErrorCode,
	Title,
	Message,
	MenuButton,
} from './NotFoundStyles';

export default function NotFound() {
	const navigate = useNavigate();

	return (
		<Container>
			<ErrorCode>404</ErrorCode>
			<Title>PAGE NOT FOUND</Title>
			<Message>
				The requested address or route does not exist in this
				dungeon floor.
			</Message>
			<MenuButton onClick={() => navigate('/')}>
				Return to Main Menu
			</MenuButton>
		</Container>
	);
}

import { currentUserVar, popupDisplayVar } from '../../cache';
import ChatList from './chatList/ChatList';
import './chatSection.scss';
import Popup from './Popup';

function ChatSection({ history }) {
	const currentUser = currentUserVar();

	if (currentUser?.currentRoom) {
		history.push(`/rooms/${currentUser.currentRoom.id}`);
	}

	function showPopupHandler() {
		popupDisplayVar('flex');
	}

	return (
		<div className='chat-section'>
			<div className='chat-section__top'>
				<div className='chat-section__label'>List of rooms</div>
				<div
					className='chat-section__create-chat'
					onClick={() => showPopupHandler()}
				>
					<button>New room</button>
				</div>
			</div>

			<ChatList history={history} />
			<Popup />
		</div>
	);
}

export default ChatSection;

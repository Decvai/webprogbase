import { popupDisplayVar } from '../../cache';
import ChatList from './chatList/ChatList';
import './chatSection.scss';
import Popup from './Popup';

function ChatSection() {
	function showPopupHandler() {
		popupDisplayVar('flex');
	}

	return (
		<div className='chat-section'>
			<div
				className='chat-section__create-chat'
				onClick={() => showPopupHandler()}
			>
				<button>Create new chat</button>
			</div>

			<ChatList />
			<Popup />
		</div>
	);
}

export default ChatSection;

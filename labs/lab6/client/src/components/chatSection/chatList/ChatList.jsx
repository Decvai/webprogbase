import { useQuery } from '@apollo/client';
import { GET_ALL_ROOMS } from '../../../operations/queries/chatQueries';
import Loader from '../../../utils/loader/Loader';
import Chat from './chat/Chat';
import './chatList.scss';

function ChatList() {
	const { data, loading, error } = useQuery(GET_ALL_ROOMS);
	const rooms = data?.rooms;

	console.log('ROOMS:', rooms);

	if (loading) return <Loader />;

	return (
		<div className='chat-list'>
			{rooms ? (
				rooms.map(room => <Chat key={room.id} room={room} />)
			) : (
				<div>No rooms</div>
			)}
		</div>
	);
}

export default ChatList;

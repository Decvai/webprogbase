import { useQuery, useSubscription } from '@apollo/client';
import { useEffect } from 'react';
import { GET_ALL_ROOMS } from '../../../operations/queries/chatQueries';
import {
	ROOM_CREATED_SUB,
	ROOM_DELETED_SUB,
	ROOM_UPDATED,
} from '../../../operations/subscriptions/chatSubscriptions';
import Loader from '../../../utils/loader/Loader';
import Chat from './chat/Chat';
import './chatList.scss';

function ChatList({ history }) {
	useSubscription(ROOM_UPDATED);

	const { subscribeToMore, data, loading } = useQuery(GET_ALL_ROOMS, {
		fetchPolicy: 'network-only',
	});

	useEffect(() => {
		subscribeToNewRooms();
		subscribeToDeleteRooms();
	}, []);

	if (loading) return <Loader />;

	const rooms = data?.rooms;
	console.log('rooms:', rooms);

	function subscribeToNewRooms() {
		subscribeToMore({
			document: ROOM_CREATED_SUB,
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;
				const newFeedItem = subscriptionData.data.roomCreated;
				return Object.assign({}, prev, {
					rooms: [newFeedItem, ...prev.rooms],
				});
			},
		});
	}

	function subscribeToDeleteRooms() {
		subscribeToMore({
			document: ROOM_DELETED_SUB,
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev;

				const newFeedItem = subscriptionData.data.roomDeleted;

				return {
					rooms: prev.rooms.filter(
						room => room.id !== newFeedItem.id
					),
				};
			},
		});
	}

	return (
		<div className='chat-list'>
			{rooms ? (
				rooms.map(room => (
					<Chat key={room.id} room={room} history={history} />
				))
			) : (
				<div>No rooms</div>
			)}
		</div>
	);
}

export default ChatList;

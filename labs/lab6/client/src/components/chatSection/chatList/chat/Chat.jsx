import { useMutation, useQuery } from '@apollo/client';
import { SET_USER_CURRENT_ROOM } from '../../../../operations/mutations/chatMutations';
import { PROFILE_QUERY } from '../../../../operations/queries/authorization';
import './chat.scss';

function Chat({ room, history }) {
	const { data: profileData } = useQuery(PROFILE_QUERY, {
		fetchPolicy: 'network-only',
	});

	const [setUserCurrentRoom] = useMutation(SET_USER_CURRENT_ROOM, {
		variables: {
			roomId: room.id,
		},
		onError: err => {
			console.log(err);
		},
	});

	const userId = profileData?.me.id;
	const ownerId = room.owner.id;
	const isOwner = userId === ownerId;

	return (
		<div
			className={isOwner ? 'room room-owner' : 'room'}
			onClick={() => {
				setUserCurrentRoom().then(() => {
					history.push(`/rooms/${room.id}`);
				});
			}}
		>
			<div className='room__name'>{room.name}</div>
			<div className='room__date'>{room.timestamp.split('T')[0]}</div>
			<div className='room__open'>Open</div>
		</div>
	);
}

export default Chat;

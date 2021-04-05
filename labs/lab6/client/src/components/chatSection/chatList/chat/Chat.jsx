import { useMutation, useQuery } from '@apollo/client';
import { NavLink } from 'react-router-dom';
import { PROFILE_QUERY } from '../../../../operations/queries/authorization';
import { SET_USER_CURRENT_ROOM } from '../../../../operations/mutations/chatMutations';
import './chat.scss';
// import Loader from '../../../../utils/loader/Loader';

function Chat({ room }) {
	const { client, loading, data } = useQuery(PROFILE_QUERY, {
		fetchPolicy: 'network-only',
	});

	// if (loading) return <Loader />;

	const [setUserCurrentRoom] = useMutation(SET_USER_CURRENT_ROOM, {
		variables: {
			roomId: room.id,
		},
		onError: err => {
			console.log(err);
		},
	});

	const userId = data?.me.id;
	const ownerId = room.owner.id;
	const isOwner = userId === ownerId;

	return (
		<div className={isOwner ? 'room room-owner' : 'room'}>
			<div className='room__name'>{room.name}</div>
			<div className='room__date'>{room.timestamp}</div>
			<div className='room__members'>{room.members.length}</div>
			<NavLink
				to={`/rooms/${room.id}`}
				onClick={() => setUserCurrentRoom()}
				className='room__open'
			>
				Open
			</NavLink>
		</div>
	);
}

export default Chat;

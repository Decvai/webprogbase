import { useMutation } from '@apollo/client';
import { currentUserVar } from '../../../../cache';
import { SET_USER_CURRENT_ROOM } from '../../../../operations/mutations/chatMutations';
import './chat.scss';

function Chat({ room, history }) {
	const [setUserCurrentRoom] = useMutation(SET_USER_CURRENT_ROOM, {
		variables: {
			roomId: room.id,
		},
		onError: err => {
			console.log(err);
		},
	});

	const userId = currentUserVar().id;

	const ownerId = room.owner.id;
	const isOwner = userId === ownerId;

	return (
		<div
			className={isOwner ? 'room room-owner' : 'room'}
			onClick={() => {
				setUserCurrentRoom().then(() => {
					currentUserVar({
						...currentUserVar(),
						currentRoom: { id: room.id },
					});

					history.push(`/rooms/${room.id}`);
				});
			}}
		>
			<div className='room__name'>{room.name}</div>
			<div className='room__date'>
				{room.timestamp.replace('T', ' ').substr(0, 19)}
			</div>
			<div className='room__open'>Open</div>
		</div>
	);
}

export default Chat;

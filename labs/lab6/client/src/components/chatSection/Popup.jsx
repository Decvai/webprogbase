import { useMutation, useReactiveVar } from '@apollo/client';
import { useState } from 'react';
import { popupDisplayVar } from '../../cache';
import { CREATE_NEW_ROOM } from '../../operations/mutations/chatMutations';
import Input from '../../utils/input/Input';

const Popup = () => {
	const [roomName, setRoomName] = useState('');
	const popupDisplay = useReactiveVar(popupDisplayVar);
	const [createRoom] = useMutation(CREATE_NEW_ROOM);

	function createRoomHandler() {
		createRoom({
			variables: { name: roomName },
		});
		// client.resetStore();
		popupDisplayVar('none');
	}

	return (
		<div
			className='popup'
			style={{ display: popupDisplay }}
			onClick={() => popupDisplayVar('none')}
		>
			<div className='popup__content' onClick={e => e.stopPropagation()}>
				<div className='popup__header'>
					<div className='popup__title'>Create new room</div>
					<div
						className='popup__close'
						onClick={() => popupDisplayVar('none')}
						style={{ cursor: 'pointer' }}
					>
						X
					</div>
				</div>
				<Input
					type='text'
					placeholder='Enter room name...'
					value={roomName}
					setValue={setRoomName}
				/>
				<button
					className='popup__create'
					onClick={() => createRoomHandler()}
				>
					Create
				</button>
			</div>
		</div>
	);
};

export default Popup;

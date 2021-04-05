import { useMutation, useQuery } from '@apollo/client';
import React from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import { PROFILE_QUERY } from '../../../../operations/queries/authorization';
import { GET_ALL_ROOMS } from '../../../../operations/queries/chatQueries';
import Loader from '../../../../utils/loader/Loader';
import './chatMenu.scss';
import SendMessageIcon from './../../../../assets/icons/send.png';
import ChatMembersIcon from './../../../../assets/icons/chat-members.png';
import LeaveIcon from './../../../../assets/icons/leave.png';
import {
	CREATE_MESSAGE,
	DELETE_ROOM,
	LEAVE_CURRENT_ROOM,
	UPDATE_ROOM,
} from '../../../../operations/mutations/chatMutations';

function ChatMenu(props) {
	const { id } = useParams();
	const { data: roomsData, loading: getRoomsLoading } = useQuery(
		GET_ALL_ROOMS
	);
	const { data: profileData, loading: profileLoading } = useQuery(
		PROFILE_QUERY,
		{
			fetchPolicy: 'network-only',
		}
	);
	const [leaveCurrentRoom] = useMutation(LEAVE_CURRENT_ROOM);
	const [createMessage, { data: messageData }] = useMutation(CREATE_MESSAGE);
	const [deleteRoom] = useMutation(DELETE_ROOM);
	const [updateRoom, { loading: updateLoading }] = useMutation(UPDATE_ROOM, {
		onCompleted: () => {
			alert('Updated');
		},
		onError: err => {
			alert(err);
		},
	});

	if (getRoomsLoading || profileLoading || updateLoading) return <Loader />;

	const rooms = roomsData?.rooms;
	const currentRoom = rooms?.find(r => r.id === id);
	const currentUser = profileData?.me;

	const isOwner = currentRoom?.owner.id === currentUser?.id;

	function membersListToggle() {
		const membersList = document.querySelector('.chat-menu__members-list');
		const chatOpen = document.querySelector('.chat-menu__members');
		const confirmBtn = document.querySelector(
			'.chat-menu__new-message-confirm'
		);

		chatOpen.classList.toggle('active');
		membersList.classList.toggle('active');
		confirmBtn.classList.toggle('straightened');
	}

	function confirmBtnHandler() {
		const input = document.querySelector('.chat-menu__new-message-input');

		if (!input.value) return;

		createMessage({
			variables: {
				text: input.value,
			},
		});
		input.value = '';
	}

	function onUpdateNameHandler(e) {
		e.stopPropagation();
		const currentName = document.querySelector('.chat-menu__name')
			.innerText;

		if (!currentName) {
			alert("You've entered an empty value");
			return;
		}

		updateRoom({
			variables: {
				id: currentRoom.id,
				name: currentName,
			},
		});
	}

	function onFocusNameHandler() {
		const updateBtn = document.querySelector('.chat-menu__name-after');
		updateBtn.classList.add('visible');
	}

	function onBlurNameHandler() {
		const updateBtn = document.querySelector('.chat-menu__name-after');

		setTimeout(() => {
			updateBtn.classList.remove('visible');
		}, 300);
	}

	console.log(currentRoom);

	return (
		<div className='chat-menu'>
			<div className='chat-menu__top'>
				<NavLink
					to='/rooms'
					className='chat-menu__leave'
					onClick={() => leaveCurrentRoom()}
				>
					<img src={LeaveIcon} alt='Leave' />
				</NavLink>

				<div
					className='chat-menu__name-wrapper'
					onBlur={() => onBlurNameHandler()}
				>
					<div
						contentEditable={isOwner ? 'true' : 'false'}
						spellCheck='false'
						className='chat-menu__name'
						onFocus={() => onFocusNameHandler()}
						suppressContentEditableWarning={true}
					>
						{currentRoom.name}
					</div>
					<div
						className='chat-menu__name-after'
						onClick={e => onUpdateNameHandler(e)}
					>
						Update
					</div>
				</div>

				<div>
					{isOwner && (
						<NavLink
							to='/rooms'
							onClick={() =>
								deleteRoom({
									variables: {
										id: currentRoom.id,
									},
								})
							}
							className='chat-menu__delete'
						>
							Delete
						</NavLink>
					)}
				</div>
			</div>

			<div className='chat-menu__body'>
				<div className='chat-menu__messages'>
					{currentRoom.lastMessages.map(message => (
						<div
							key={message.id}
							className={
								message.author.id === currentUser.id
									? 'mine messages'
									: 'yours messages'
							}
						>
							<div className='message'>{message.text}</div>
						</div>
					))}
				</div>
			</div>

			<div className='chat-menu__bottom'>
				<div className='chat-menu__new-message'>
					<input
						placeholder='Write a message...'
						type='text'
						className='chat-menu__new-message-input'
						onKeyUp={e => {
							if (e.key === 'Enter') {
								confirmBtnHandler();
							}
						}}
					></input>
					<div className='chat-menu__members'>
						<img
							className='chat-menu__members-img'
							src={ChatMembersIcon}
							alt='chat-members'
							onClick={() => membersListToggle()}
						/>
						<ul className='chat-menu__members-list'>
							{currentRoom.members.map(member => (
								<li
									key={member.id}
									className='chat-menu__member'
								>
									{currentUser.id === member.id && 'Me: '}
									<span
										className={
											currentUser.id === member.id
												? 'chat-menu__member-me'
												: ''
										}
									>
										{member.username}
									</span>
									{member.id === currentRoom.owner.id &&
										' <-- Owner'}
								</li>
							))}
						</ul>
					</div>
					<div
						className='chat-menu__new-message-confirm'
						onClick={() => confirmBtnHandler()}
					>
						<img src={SendMessageIcon} alt='Send' />
					</div>
				</div>
			</div>
		</div>
	);
}

export default ChatMenu;

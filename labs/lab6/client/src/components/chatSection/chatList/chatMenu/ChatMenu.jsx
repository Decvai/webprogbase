import { useMutation, useQuery, useSubscription } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router';
import {
	CREATE_MESSAGE,
	DELETE_ROOM,
	LEAVE_CURRENT_ROOM,
	UPDATE_ROOM,
} from '../../../../operations/mutations/chatMutations';
import { PROFILE_QUERY } from '../../../../operations/queries/authorization';
import { GET_ALL_ROOMS } from '../../../../operations/queries/chatQueries';
import {
	CURRENT_ROOM_CHANGED,
	MEMBER_JOINED,
	MEMBER_LEFT,
	MESSAGES_SUBSCRIPTION,
	ROOM_UPDATED,
} from '../../../../operations/subscriptions/chatSubscriptions';
import Loader from '../../../../utils/loader/Loader';
import { gotoBottom } from '../../../../utils/utils';
import ChatMembersIcon from './../../../../assets/icons/chat-members.png';
import LeaveIcon from './../../../../assets/icons/leave.png';
import SendMessageIcon from './../../../../assets/icons/send.png';
import UpdateIcon from './../../../../assets/icons/update.png';
import './chatMenu.scss';

function ChatMenu({ history }) {
	const { id: roomId } = useParams();
	const [hasRoomsData, setHasRoomsData] = useState(false);
	const [messages, setMessages] = useState([]);

	const { data: lastMessage } = useSubscription(MESSAGES_SUBSCRIPTION);
	useSubscription(ROOM_UPDATED);
	useSubscription(MEMBER_JOINED, {
		onSubscriptionData: () => {
			refetch();
		},
	});
	useSubscription(MEMBER_LEFT, {
		onSubscriptionData: () => {
			refetch();
		},
	});
	useSubscription(CURRENT_ROOM_CHANGED, {
		onSubscriptionData: ({ subscriptionData }) => {
			const room = subscriptionData.data.currentRoomChanged.currentRoom;
			if (!room) {
				history.push('/rooms');
				alert('room was deleted');
			}
		},
	});

	const { refetch, data: roomsData, loading: getRoomsLoading } = useQuery(
		GET_ALL_ROOMS,
		{
			fetchPolicy: 'network-only',
		}
	);
	const { data: profileData, loading: profileLoading } = useQuery(
		PROFILE_QUERY,
		{
			fetchPolicy: 'network-only',
		}
	);

	const [leaveCurrentRoom] = useMutation(LEAVE_CURRENT_ROOM, {
		onCompleted: () => {
			history.push('/rooms');
		},
		onError: err => {
			console.log(err);
			history.push('/rooms');
		},
	});
	const [createMessage] = useMutation(CREATE_MESSAGE);
	const [deleteRoom] = useMutation(DELETE_ROOM);
	const [updateRoom] = useMutation(UPDATE_ROOM, {
		onError: err => {
			alert(err);
		},
	});

	useEffect(() => {
		if (!lastMessage) return;
		const lastMsg = lastMessage.messageCreated;
		setMessages([...messages, lastMsg]);
	}, [lastMessage]);

	useEffect(() => {
		const chatMenuBody = document.querySelector('.chat-menu__body');
		if (!chatMenuBody) return;
		gotoBottom('.chat-menu__body');
	});

	if (getRoomsLoading || profileLoading) {
		return <Loader />;
	}

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

	const rooms = roomsData?.rooms;
	const currentRoom = rooms?.find(r => r.id === roomId);
	const currentUser = profileData?.me;
	const isOwner = currentRoom?.owner.id === currentUser?.id;

	if (!currentRoom) {
		return (
			<div className='chat-menu'>
				<div className='chat-menu__top'>
					<div
						className='chat-menu__leave'
						onClick={() => leaveCurrentRoom()}
					>
						<img src={LeaveIcon} alt='Leave' />
					</div>
				</div>
				<div>Error, current room is not defined</div>
			</div>
		);
	}

	if (!currentUser.currentRoom) {
		return <Redirect to='/rooms' />;
	}

	if (currentUser.currentRoom.id !== currentRoom.id) {
		return <Redirect to={`/rooms/${currentUser.currentRoom.id}`} />;
	}

	if (!hasRoomsData) {
		setHasRoomsData(true);
		setMessages(currentRoom.lastMessages);
	}

	return (
		<div className='chat-menu'>
			<div className='chat-menu__top'>
				<div
					className='chat-menu__leave'
					onClick={() => leaveCurrentRoom()}
				>
					<img src={LeaveIcon} alt='Leave' />
				</div>

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
						<img src={UpdateIcon} alt='Update' />
					</div>
				</div>

				<div>
					{isOwner && (
						<div
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
						</div>
					)}
				</div>
			</div>

			<div className='chat-menu__body'>
				<div className='chat-menu__messages'>
					{messages.map(message => (
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

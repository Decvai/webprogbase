import { gql } from '@apollo/client';

export const SET_USER_CURRENT_ROOM = gql`
	mutation JoinRoom($roomId: ID!) {
		joinRoom(roomId: $roomId) {
			id
		}
	}
`;

export const LEAVE_CURRENT_ROOM = gql`
	mutation {
		leaveCurrentRoom {
			id
		}
	}
`;

export const CREATE_MESSAGE = gql`
	mutation CreateMessage($text: String!) {
		createMessage(text: $text) {
			text
		}
	}
`;

export const CREATE_NEW_ROOM = gql`
	mutation CreateRoom($name: String!) {
		createRoom(name: $name) {
			id
			name
			timestamp
			owner {
				id
			}
		}
	}
`;

export const UPDATE_ROOM = gql`
	mutation UpdateRoom($id: ID!, $name: String!) {
		updateRoom(id: $id, name: $name) {
			id
		}
	}
`;

export const DELETE_ROOM = gql`
	mutation DeleteRoom($id: ID!) {
		deleteRoom(id: $id) {
			id
		}
	}
`;

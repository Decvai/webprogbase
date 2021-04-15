import { gql } from '@apollo/client';

export const MESSAGES_SUBSCRIPTION = gql`
	subscription OnMessageCreated {
		messageCreated {
			id
			room {
				id
			}
			author {
				id
				username
			}
			text
		}
	}
`;

export const ROOM_CREATED_SUB = gql`
	subscription OnRoomCreated {
		roomCreated {
			id
			name
			timestamp
		}
	}
`;

export const ROOM_DELETED_SUB = gql`
	subscription OnRoomDeleted {
		roomDeleted {
			id
		}
	}
`;

export const ROOM_UPDATED = gql`
	subscription OnRoomUpdated {
		roomUpdated {
			id
			name
		}
	}
`;

export const MEMBER_JOINED = gql`
	subscription OnMemberJoined {
		memberJoined {
			id
			username
		}
	}
`;

export const MEMBER_LEFT = gql`
	subscription OnMemberLeft {
		memberLeft {
			id
			username
		}
	}
`;

export const CURRENT_ROOM_CHANGED = gql`
	subscription OnCurrentRoomChanged {
		currentRoomChanged {
			currentRoom {
				id
			}
		}
	}
`;

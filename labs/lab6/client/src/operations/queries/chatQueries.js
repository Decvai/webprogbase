import { gql } from '@apollo/client';

export const GET_ALL_ROOMS = gql`
	query {
		rooms {
			id
			name
			timestamp
			members {
				id
				username
			}
			owner {
				id
			}
			lastMessages {
				id
				text
				author {
					id
					username
				}
				timestamp
			}
		}
	}
`;

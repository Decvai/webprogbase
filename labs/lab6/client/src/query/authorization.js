import { gql } from '@apollo/client';

export const REGISTRATION = gql`
	query Register($username: String!, $password: String!) {
		register(username: $username, password: $password) {
			id
			username
		}
	}
`;

export const LOGIN = gql`
	query Login($username: String!, $password: String!) {
		login(username: $username, password: $password)
	}
`;

export const ABOUT_ME = gql`
	query {
		me {
			id
			username
		}
	}
`;

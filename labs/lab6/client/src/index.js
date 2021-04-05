import 'normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { ApolloProvider, ApolloClient, createHttpLink } from '@apollo/client';
import { API_URI } from './config';
import { cache } from './cache';

import { setContext } from '@apollo/client/link/context';
const httpLink = createHttpLink({
	uri: API_URI,
});

const authLink = setContext((_, { headers }) => {
	const token = localStorage.getItem('token');

	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : '',
		},
	};
});

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache,
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById('root')
);

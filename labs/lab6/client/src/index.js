import {
	ApolloClient,
	ApolloProvider,
	createHttpLink,
	split,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';
import 'normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
// import { BrowserRouter } from 'react-router-dom';
import { HashRouter as Router } from 'react-router-dom';
import { cache } from './cache';
import App from './components/App';
import { API_URI } from './config';

const httpLink = createHttpLink({
	uri: 'https://' + API_URI,
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

const wsLink = new WebSocketLink({
	uri: 'wss://' + API_URI + '/graphql',
	options: {
		reconnect: true,
		connectionParams: {
			Authorization: `Bearer ${localStorage.getItem('token')}`,
		},
	},
});

const concatedLink = authLink.concat(httpLink);

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === 'OperationDefinition' &&
			definition.operation === 'subscription'
		);
	},
	wsLink,
	concatedLink
);

const client = new ApolloClient({
	link: splitLink,
	cache,
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<Router>
			<App />
		</Router>
	</ApolloProvider>,
	document.getElementById('root')
);

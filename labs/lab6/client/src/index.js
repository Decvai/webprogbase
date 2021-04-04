import 'normalize.css';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { ApolloProvider, ApolloClient, InMemoryCache } from '@apollo/client';
import { API_URI } from './config';

const client = new ApolloClient({
	uri: API_URI,
	cache: new InMemoryCache(),
});

ReactDOM.render(
	<ApolloProvider client={client}>
		<App />
	</ApolloProvider>,
	document.getElementById('root')
);

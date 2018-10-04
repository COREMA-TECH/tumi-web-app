import React, { Component } from 'react';
import './App.css';
import Main from './Main/Main';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';

import withGlobalContent from 'Generic/Global';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import { propType } from 'graphql-anywhere';

/**
 *  CONFIGURATION OF APOLLO CLIENT
 */
const baseEndpointURL = 'https://corema-new-api.herokuapp.com';

// Endpoint URL
const httpLink = createHttpLink({
	uri: baseEndpointURL + '/graphql'
});

const authLink = setContext((_, { headers }) => {
	// get the authentication token from local storage if it exists
	const token = localStorage.getItem('Token');
	// return the headers to the context so httpLink can read them
	return {
		headers: {
			...headers,
			authentication: token
		}
	};
});

// To configure Apollo client with link (url) endpoint and cache option
const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache()
});

// Endpoint URL for Login
const loginHttpLink = createHttpLink({
	uri: baseEndpointURL + '/login'
});

const loginClient = new ApolloClient({
	link: loginHttpLink,
	cache: new InMemoryCache()
});

class App extends Component {
	render() {
		return (
			<ApolloProvider client={client}>
				<Router>
					<div className="App">
						<Main />
					</div>
				</Router>
			</ApolloProvider>
		);
	}
	static childContextTypes = {
		baseUrl: PropTypes.string,
		endpointBaseURL: PropTypes.string,
		loginClient: PropTypes.object
	};

	getChildContext = () => ({
		baseUrl: 'http://13.58.18.163:4000',
		endpointBaseURL: baseEndpointURL,
		loginClient: loginClient
	});
}

export default App;

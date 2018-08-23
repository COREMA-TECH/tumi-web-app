import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import {ApolloProvider} from 'react-apollo';
import {ApolloClient} from 'apollo-client';
import {createHttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

/**
 *  CONFIGURATION OF APOLLO CLIENT
 */

// Endpoint URL
const httpLink = createHttpLink({
    // uri: 'https://morning-lake-18657.herokuapp.com/graphql'
    uri: 'http://192.168.0.103:3000/graphql'
});

// To configure Apollo client with link (url) endpoint and cache option
const client = new ApolloClient({
    link: httpLink,
    cache: new InMemoryCache()
});

/**
 * The App is wrapped with the higher-order component ApolloProvider
 * that gets passed the client as a prop.
 */
ReactDOM.render(
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>,
    document.getElementById('root')
);

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import firebase from 'firebase';

// Initialize firebase with config
firebase.initializeApp({
    apiKey: 'AIzaSyBvha5XSztYQjUYvnh-THlS6WKEC2MPkbg',
    authDomain: 'tumiapp-66cd6.firebaseapp.com',
    databaseURL: 'https://tumiapp-66cd6.firebaseio.com',
    projectId: 'tumiapp-66cd6',
    storageBucket: 'tumiapp-66cd6.appspot.com',
    messagingSenderId: '79324693031'
});

/**
 *  CONFIGURATION OF APOLLO CLIENT
 */
// Endpoint URL
const httpLink = createHttpLink({
    //uri: 'https://morning-lake-18657.herokuapp.com/graphql'
<<<<<<< HEAD
    uri: 'https://corema-new-api.herokuapp.com/graphql'
    //uri: 'http://192.168.0.107:4000/graphql'
=======
    //uri: 'https://corema-new-api.herokuapp.com/graphql'
    // uri: 'http://192.168.0.108:4000/graphql'
    //Url de Produccion
    uri: 'http://13.58.18.163:4000/graphql'
>>>>>>> 7204eabc60cd2f00e0844497438520ce7eee07ba
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
        <App />
    </ApolloProvider>,
    document.getElementById('root')
);

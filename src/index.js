import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

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
 * The App is wrapped with the higher-order component ApolloProvider
 * that gets passed the client as a prop.
 */
ReactDOM.render(<App/>, document.getElementById('root'));

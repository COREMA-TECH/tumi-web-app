import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from 'react-redux'
import { createStore } from 'redux'
import reducer from './redux/reducers/';

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

if (localStorage.getItem("languageForm") === undefined || localStorage.getItem("languageForm") == null) {
    localStorage.setItem('languageForm', 'en');
}

let store = createStore(reducer)

/**
 * The App is wrapped with the higher-order component ApolloProvider
 * that gets passed the client as a prop.
 */
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));

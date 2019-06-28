import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';

if (localStorage.getItem("languageForm") === undefined || localStorage.getItem("languageForm") == null) {
    localStorage.setItem('languageForm', 'en');
}

/**
 * The App is wrapped with the higher-order component ApolloProvider
 * that gets passed the client as a prop.
 */
ReactDOM.render(<App />, document.getElementById('root'));

import React, { Component } from 'react';
import './App.css';
import Main from './Main/Main';
import { BrowserRouter as Router } from 'react-router-dom';
import PropTypes from 'prop-types';

import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { setContext } from 'apollo-link-context';
import ReactDOM from 'react-dom';
import { connection } from './connection.default.js';

if (localStorage.getItem('languageForm') === undefined || localStorage.getItem('languageForm') == null) {
	localStorage.setItem('languageForm', 'en');
}

var authorizedPath = [
	'/home',
	'/home/application',
	'/home/application/info'
];

if (localStorage.getItem('isEmployee') == 'true' && !authorizedPath.includes(window.location.pathname)) {
	localStorage.setItem('showMenu', false);
	window.location.href = '/home/application';
}

if (localStorage.getItem('isEmployee') == 'false') {
	localStorage.setItem('showMenu', true);
}

if (localStorage.getItem('isEmployee') == 'true' && window.location.pathname == "/home") {
	window.location.href = '/home/application';
}
/**
 *  CONFIGURATION OF APOLLO CLIENT
 */
const baseEndpointURL = connection;




const token =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7IklkIjoxMCwiQ29kZV9Vc2VyIjoiYWRtaW4gICAgICJ9LCJpYXQiOjE1Mzg2NjI4ODgsImV4cCI6MTg1NDIzODg4OH0.3p2Hej6LhKeiNvONYNsJ2S7-5NSeeC-gcKgYyJvc8F0';
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

const getDistance = (lat1, lon1, lat2, lon2, unit) => {

	if ((lat1 == lat2) && (lon1 == lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1 / 180;
		var radlat2 = Math.PI * lat2 / 180;
		var theta = lon1 - lon2;
		var radtheta = Math.PI * theta / 180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180 / Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit == "K") { dist = dist * 1.609344 }
		if (unit == "N") { dist = dist * 0.8684 }
		return dist;
	}

}
class App extends Component {
	handleScroll = (event) => {
		const node = ReactDOM.findDOMNode(this);
		let scroll = node.querySelector('.buttonsGroup');
		//console.log(window.scrollY);
		if (!scroll) return false;
		if (scroll.scrollHeight <= window.scrollY) scroll.classList.add('buttonsGroup-fixed');
		else scroll.classList.remove('buttonsGroup-fixed');
	};

	componentDidMount = () => {
		window.addEventListener('scroll', this.handleScroll);
	};

	componentWillMount() {
		window.removeEventListener('scroll', this.handleScroll);

		localStorage.setItem('languageForm', 'en');
	}

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
		loginClient: PropTypes.object,
		token: PropTypes.string,
		avatarURL: PropTypes.string,
		maxFileSize: PropTypes.number,
		extWord: PropTypes.array,
		extImage: PropTypes.array,
		extPdf: PropTypes.array,
		acceptAttachFile: PropTypes.string,
		UID: PropTypes.func,
		getDistance: PropTypes.func
	};

	getChildContext = () => ({
		baseUrl: baseEndpointURL,
		endpointBaseURL: baseEndpointURL,
		loginClient: loginClient,
		token: token,
		avatarURL: 'https://intellihr.com.au/wp-content/uploads/2017/06/avatar_placeholder_temporary.png',
		maxFileSize: 25 * 1024 * 1024, //This is 25 MB
		extWord: ['.doc', '.docx'],
		extImage: ['.jpg', '.jpeg', '.bmp', '.gif', '.png', '.tiff'],
		extPdf: ['.pdf'],
		acceptAttachFile: 'application/pdf, image/*, application/msword',
		UID: () => {
			return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
		},
		getDistance
	});
}

export default App;

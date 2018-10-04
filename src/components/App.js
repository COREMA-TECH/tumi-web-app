import React, { Component } from 'react';
import './App.css';
import Main from './Main/Main';
import { BrowserRouter as Router } from 'react-router-dom';

import withGlobalContent from 'Generic/Global';

class App extends Component {
	render() {
		console.log('Token App', sessionStorage.getItem('Token'));
		return (
			<Router>
				<div className="App">
					<Main />
				</div>
			</Router>
		);
	}
}

export default withGlobalContent(App);

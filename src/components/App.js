import React, { Component } from 'react';
import './App.css';
import Main from './Main/Main';
import { BrowserRouter as Router } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import withGlobalContent from './Global';

class App extends Component {
	render() {
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

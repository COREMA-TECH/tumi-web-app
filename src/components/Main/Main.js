import React, { Component } from 'react';
import './index.css';

import Nav from '../Nav/';
import Toolbar from '../Toolbar/Main';
import MainContainer from '../MainContainer/MainContainer';
import { Route } from 'react-router-dom';

class Main extends Component {
	render() {
		return (
			<div className="main">
				<Nav />

				<Toolbar />

				<Route exact path="/company" component={MainContainer} />
			</div>
		);
	}
}

export default Main;

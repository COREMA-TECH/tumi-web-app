import React, { Component } from 'react';
import './index.css';
import Nav from '../Nav/Main';
import MainContainer from '../MainContainer/Main/MainContainer';

class Main extends Component {
	render() {
		return (
			<div className="main">
				<Nav />
				<MainContainer />
			</div>
		);
	}
}

export default Main;

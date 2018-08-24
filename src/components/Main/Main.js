import React, { Component } from 'react';
import './index.css';
import Nav from '../Nav/Main';
import MainContainer from '../MainContainer/Main/MainContainer';

class Main extends Component {
	state = {
		mobileOpen: false
	};

	handleDrawerToggle = () => {
		this.setState((state) => ({ mobileOpen: !state.mobileOpen }));
	};
	render() {
		return (
			<div className="main">
				<Nav handleDrawerToggle={this.handleDrawerToggle} mobileOpen={this.state.mobileOpen} />
				<MainContainer handleDrawerToggle={this.handleDrawerToggle} mobileOpen={this.state.mobileOpen} />
			</div>
		);
	}
}

export default Main;

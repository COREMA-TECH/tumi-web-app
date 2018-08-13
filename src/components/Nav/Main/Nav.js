import React, { Component } from 'react';
import './index.css';
import HeaderNav from '../HeaderNav';
import Menu from '../Menu';

class Nav extends Component {
	render() {
		return (
			<div className="nav">
				<HeaderNav />
				<Menu />
			</div>
		);
	}
}

export default Nav;

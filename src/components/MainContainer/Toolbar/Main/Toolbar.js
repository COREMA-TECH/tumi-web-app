import React, { Component } from 'react';
import './index.css';
import Search from '../SearchBar';
import Toolbox from '../Toolbox';

class Toolbar extends Component {
	render() {
		return (
			<React.Fragment>
				<Search />
				<Toolbox />
			</React.Fragment>
		);
	}
}

export default Toolbar;

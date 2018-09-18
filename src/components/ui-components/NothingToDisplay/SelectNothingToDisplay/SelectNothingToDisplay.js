import React, { Component } from 'react';
import './index.css';

class SelectNothingToDisplay extends Component {
	render() {
		return <input type="text" value="Nothing to display" className={'input-form input-nothing'} disabled="true" />;
	}
}

export default SelectNothingToDisplay;

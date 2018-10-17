import React, { Component } from 'react';
import './index.css';

class SelectNothingToDisplay extends Component {
	render() {
		return <input type="text" value="Nothing to display" className={'form-control input-nothing'} disabled="true" />;
	}
}

export default SelectNothingToDisplay;

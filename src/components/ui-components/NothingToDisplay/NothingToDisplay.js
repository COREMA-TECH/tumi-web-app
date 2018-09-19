import React, { Component } from 'react';
import './index.css';

class NothingToDisplay extends Component {
	render() {
		return (
			<div className="Error-container">
				<div className="row">
					<div className="col-12">
						<img src={["/icons/", this.props.icon , ".png"].join('')} className="Error-icon"/>
						<h1 className={[ this.props.type, 'Error-title' ].join(' ')}>{this.props.title}</h1>
						<span className="Error-text">{this.props.message}</span>
					</div>
				</div>
			</div>
		);
	}
}

export default NothingToDisplay;

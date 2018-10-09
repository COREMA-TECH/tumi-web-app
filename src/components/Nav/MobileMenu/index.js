import React from 'react';
import MenuItem from './MenuItem';
import Global from 'Generic/Global';
import { Link } from "react-router-dom";

const MobileMenu = (props) => (
	<div className="MenuMobile">
		<ul className="MainMenu-container">
			<li className="MainMenu-option">
				<a className="closeIcon" onClick={props.handleCloseMenu}>
					<i className="fas fa-times"></i>
				</a>
			</li>
			<li className="MainMenu-option">
				<MenuItem item="Company" title="Companies" icon="fa fa-home MenuMobile-icon" />
			</li>
			<li className="MainMenu-option">
				<MenuItem item="Contracts" title="Contracts" icon="fas fa-handshake MenuMobile-icon" />
			</li>
			<li className="MainMenu-option">
				<MenuItem item="Permissions" title="Permissions" icon="far fa-clipboard MenuMobile-icon" />
			</li>
			<li className="MainMenu-option">
				<Link to={`/home/application`} className="MenuMobile-link" onClick={props.handleCloseMenu}>
					<span className="fas fa-file-signature MenuMobile-icon" title={props.title}></span>
					<span>Apply Form</span>
				</Link>
			</li>
		</ul>
	</div>
);

export default Global(MobileMenu);

import React from 'react';
import MenuItem from './MenuItem';
import Global from 'Generic/Global';

const MobileMenu = (props) => (
	<div className="MenuMobile">
		<ul className="MainMenu-container">
			<li className="MainMenu-option">
				<a className="closeIcon" onClick={props.handleCloseMenu}>
					<i className="fas fa-times"></i>
				</a>	
			</li>
			<li className="MainMenu-option">
				<MenuItem item="Company" title="Companies" icon="icon-home MenuMobile-icon" />
			</li>
			<li className="MainMenu-option">
				<MenuItem item="Contracts" title="Contracts" icon="icon-doc MenuMobile-icon" />
			</li>
			<li className="MainMenu-option">
				<MenuItem item="Permissions" title="Permissions" icon="icon-calendar MenuMobile-icon" />
			</li>
			<li className="MainMenu-option">
				<MenuItem item="Work Orders" title="WorkOrders" icon="icon-chart-bar MenuMobile-icon" />
			</li>
		</ul>
	</div>
);

export default Global (MobileMenu);

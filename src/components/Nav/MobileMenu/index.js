import React from 'react';
import MenuItem from './MenuItem';

const MobileMenu = (props) => (
    <div className="MenuMobile">
        <ul className="MainMenu-container">
            <li class="MainMenu-option">
		        <MenuItem item="Company" title="Companies" icon="icon-home menu-item__icon" />
            </li>
            <li class="MainMenu-option">
		        <MenuItem item="Contracts" title="Contracts" icon="icon-doc menu-item__icon" />
            </li>
            <li class="MainMenu-option">
		        <MenuItem item="Permissions" title="Permissions" icon="icon-calendar menu-item__icon" />
            </li>
            <li class="MainMenu-option">
		        <MenuItem item="Work Orders" title="WorkOrders" icon="icon-chart-bar menu-item__icon" />
            </li>
        </ul>
    </div>
);

export default MobileMenu;

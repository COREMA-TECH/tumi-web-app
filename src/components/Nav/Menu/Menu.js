import React from 'react';
import MenuItem from '../MenuItem/MenuItem';
import './index.css';
import {Link} from "react-router-dom";

const Menu = (...props) => (
	<ul className="menu">
		<MenuItem item="Company" title="Companies" icon="icon-home menu-item__icon" />
		<MenuItem item="Contracts" title="Contracts" icon="icon-doc menu-item__icon" />
		<MenuItem item="Permissions" title="Permissions" icon="icon-calendar menu-item__icon" />
        <Link to={`/employment-application`} className="menu__item">
            <span className="icon-doc menu-item__icon" title={props.title}></span>
            <span className="nav-title">Apply Form</span>
        </Link>
	</ul>
);

export default Menu;

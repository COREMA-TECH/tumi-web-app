import React from 'react';
import MenuItem from '../MenuItem/MenuItem';
import './index.css';
import { Link } from "react-router-dom";

const Menu = (...props) => (
	<ul className="menu">
		<MenuItem item="Company" title="Companies" icon="fa fa-home" />
		<MenuItem item="Contracts" title="Contracts" icon="fas fa-handshake" />
		<MenuItem item="Recruiter" title="Recruiter" icon="fas fa-clipboard" />
		<Link to={`/home/application`} className="menu__item">
			<span className="fas fa-file-signature" title={props.title}></span>
			<span className="nav-title">Operations</span>
		</Link>
	</ul>
);

export default Menu;

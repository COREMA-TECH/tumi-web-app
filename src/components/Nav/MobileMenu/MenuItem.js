import React from 'react';
import { Link } from 'react-router-dom';
import Global from 'Generic/Global';

const MenuItem = (props) => (
	<Link to={`/home/${props.item}`} className="MenuMobile-link" onClick={props.handleCloseMenu}>
		<span className={props.icon} title={props.title}></span>
		<span>{props.title}</span>
	</Link>
);

export default Global(MenuItem);
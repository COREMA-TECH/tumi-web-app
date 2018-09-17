import React from 'react';
import { Link } from 'react-router-dom';

const MenuItem = (props) => (
	<Link to={`/home/${props.item}`} className="MenuMobile-link">
		<span className={props.icon} title={props.title}></span>
		<span>{props.title}</span>
	</Link>
);

export default MenuItem;
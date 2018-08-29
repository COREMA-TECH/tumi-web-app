import React from 'react';
import './index.css';
import { Link } from 'react-router-dom';

const MenuItem = (props) => (
	<Link to={`/${props.item}`} className="menu__item">
		<span className={props.icon}></span>
	</Link>
);

export default MenuItem;

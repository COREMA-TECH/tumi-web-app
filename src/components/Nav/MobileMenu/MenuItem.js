import React from 'react';
import { Link } from 'react-router-dom';
import Global from 'Generic/Global';

const MenuItem = (props) => {

	const handleItemMenuAction = () => {
		alert('hola');
	};

	return (
		<Link to={`/home/${props.item}`} className="MenuMobile-link" onClick={handleItemMenuAction}>
			<i className={props.icon} title={props.title}></i>
			<span>{props.title}</span>
		</Link>
	);
}

export default Global(MenuItem);
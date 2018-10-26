import React from 'react';
import Global from 'Generic/Global';
import { Link } from "react-router-dom";



const MobileMenu = (props) => {

	const handleItemMenuAction = (event) => {
		event.preventDefault();
		let selfHtml = event.currentTarget;
		let submenu = selfHtml.nextSibling;
		if (selfHtml.classList.contains('selected')) {
			selfHtml.classList.remove("selected");
			submenu.classList.remove("SubMenu-show");
		} else {
			selfHtml.classList.add("selected");
			submenu.classList.add("SubMenu-show");
		}
	};

	return (
		<div className="MenuMobile">
			<ul className="MainMenu-container">
				<li className="MainMenu-option">
					<a className="closeIcon" onClick={props.handleCloseMenu}>
						<i className="fas fa-times"></i>
					</a>
				</li>
				<li className="MainMenu-option">
					<Link to={`/home/Company`} className="MenuMobile-link" onClick={props.handleCloseMenu}>
						<i className={'fas fa-home MenuMobile-icon'} title={'Companies'}></i>
						<span>Companies</span>
					</Link>
				</li>
				<li className="MainMenu-option">
					<Link to={`/home/Contracts`} className="MenuMobile-link" onClick={props.handleCloseMenu}>
						<i className={'far fa-handshake MenuMobile-icon'} title={'Contracts'}></i>
						<span>Contracts</span>
					</Link >
				</li >
				<li className="MainMenu-option">
					<Link to={`/home/Recruiter`} className="MenuMobile-link" onClick={props.handleCloseMenu}>
						<i className={'fas fa-clipboard MenuMobile-icon'} title={'Recruiter'}></i>
						<span>Recruiter</span>
					</Link >
				</li >
				<li className="MainMenu-option">
					<Link to={`/home/application`} className="MenuMobile-link" onClick={handleItemMenuAction} data-submenu="1">
						<i className="fas fa-file-signature MenuMobile-icon" title={'Operation Manager'}></i>
						<span>Operation Manager</span>
					</Link>
					<ul className="SubMenu" id="1">
						<li className="SubMenu-item">
							<a className="SubMenu-link" href="/home/application">
								<i className="far fa-circle SubMenu-icon"></i> New Employtes Package
							</a>
						</li>
						<li className="SubMenu-item">
							<a className="SubMenu-link" href="/employment-application">
								<i className="far fa-circle SubMenu-icon"></i> Public Application
							</a>
						</li>
					</ul>
				</li>
			</ul>
		</div >
	)
};

export default Global(MobileMenu);

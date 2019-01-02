import React from 'react';
import Global from 'Generic/Global';
import { Link } from 'react-router-dom';

const MobileMenu = (props) => {
	const handleItemMenuAction = (event) => {
		event.preventDefault();
		let selfHtml = event.currentTarget;
		let submenu = selfHtml.nextSibling;
		if (selfHtml.classList.contains('selected')) {
			selfHtml.classList.remove('selected');
			submenu.classList.remove('SubMenu-show');
		} else {
			selfHtml.classList.add('selected');
			submenu.classList.add('SubMenu-show');
		}
	};

	return (
		<div className="MenuMobile">
			<ul className="MainMenu-container">
				<li className="MainMenu-option">
					<a className="closeIcon" onClick={props.handleCloseMenu}>
						<i className="far fa-times-circle"></i>
					</a>
				</li>
				<li className="MainMenu-option">
					<Link to={`/home/Company`} className="MenuMobile-link" onClick={props.handleCloseMenu}>
						<i className={'fas fa-warehouse MenuMobile-icon'} title={'Companies'} />
						<span>Management Company</span>
					</Link>
				</li>
				<li className="MainMenu-option">
					<Link to={`/home/Properties`} className="MenuMobile-link" onClick={props.handleCloseMenu}>
						<i className={'fas fa-building MenuMobile-icon'} title={'Properties'} />
						<span>Properties</span>
					</Link>
				</li>
				<li className="MainMenu-option">
					<Link to={`/home/Contracts`} className="MenuMobile-link" onClick={props.handleCloseMenu}>
						<i className={'far fa-handshake MenuMobile-icon'} title={'Contracts'} />
						<span>Contracts</span>
					</Link>
				</li>
				<li className="MainMenu-option">
					<Link to={`/home/employees`} className="MenuMobile-link" onClick={props.handleCloseMenu}>
						<i className={'far fa-handshake MenuMobile-icon'} title={'Employees'} />
						<span>Employees</span>
					</Link>
				</li>
				<li className="MainMenu-option">
					<Link
						to={`/home/application`}
						className="MenuMobile-link"
						onClick={handleItemMenuAction}
						data-submenu="1"
					>
						<i className="fas fa-user-cog MenuMobile-icon" title={'Operations'} />
						<span>Operations</span>
					</Link>
					<ul className="SubMenu" id="1">
						<li className="SubMenu-item">
							<a className="SubMenu-link" href="/home/dashboard/manager">
								<i className="fas fa-angle-double-right SubMenu-icon" /> Dashboard
							</a>
						</li>
						<li className="SubMenu-item">
							<a className="SubMenu-link" href="/home/board/manager">
								<i className="fas fa-angle-double-right SubMenu-icon" /> Board
							</a>
						</li>
						<li className="SubMenu-item">
							<a className="SubMenu-link" href="/home/application">
								<i className="fas fa-angle-double-right SubMenu-icon" /> New Employees Package
							</a>
						</li>
						<li className="SubMenu-item">
							<a className="SubMenu-link" href="/employment-application">
								<i className="fas fa-angle-double-right SubMenu-icon" /> Public Application
							</a>
						</li>
						<li className="SubMenu-item">
							<a className="SubMenu-link" href="/home/work-orders">
								<i className="fas fa-angle-double-right SubMenu-icon" /> Work Order
							</a>
						</li>
						<li className="SubMenu-item">
							<a className="SubMenu-link" href="/home/schedules">
								<i className="fas fa-angle-double-right SubMenu-icon" /> Schedules
							</a>
						</li>
						<li className="SubMenu-item">
							<a className="SubMenu-link" href="/home/property/schedules">
								<i className="fas fa-angle-double-right SubMenu-icon" /> Manage Schedules
							</a>
						</li>
					</ul>
				</li>
				<li className="MainMenu-option">
					<Link
						to={`/home/application`}
						className="MenuMobile-link"
						onClick={handleItemMenuAction}
						data-submenu="1"
					>
						<i className="fas fa-chalkboard-teacher MenuMobile-icon" title={'Hotel Manager'} />
						<span>Hotel Manager</span>
					</Link>
					<ul className="SubMenu" id="1">
						<li className="SubMenu-item">
							<a className="SubMenu-link" href="/home/dashboard/manager">
								<i className="fas fa-angle-double-right SubMenu-icon" /> Dashboard
							</a>
						</li>
						<li className="SubMenu-item">
							<a className="SubMenu-link" href="/home/board/manager">
								<i className="fas fa-angle-double-right SubMenu-icon" /> Board
							</a>
						</li>

					</ul>
				</li>
				<li className="MainMenu-option">
					<Link
						to={`/home/application`}
						className="MenuMobile-link"
						onClick={handleItemMenuAction}
						data-submenu="1"
					>
						<i className="far fa-address-card MenuMobile-icon" title={'Recruiter'} />
						<span>Recruiter</span>
					</Link>
					<ul className="SubMenu" id="1">
						<li className="SubMenu-item">
							<a className="SubMenu-link" href="/home/dashboard/recruiter">
								<i className="fas fa-angle-double-right SubMenu-icon" /> Dashboard
							</a>
						</li>
						<li className="SubMenu-item">
							<a className="SubMenu-link" href="/home/board/recruiter">
								<i className="fas fa-angle-double-right SubMenu-icon" /> Board
							</a>
						</li>
						<li className="SubMenu-item">
							<a className="SubMenu-link" href="/home/Recruiter">
								<i className="fas fa-angle-double-right SubMenu-icon" /> New Lead
							</a>
						</li>
						<li className="SubMenu-item">
							<a className="SubMenu-link" href="/home/work-orders">
								<i className="fas fa-angle-double-right SubMenu-icon" /> Work Order
							</a>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	);
};

export default Global(MobileMenu);

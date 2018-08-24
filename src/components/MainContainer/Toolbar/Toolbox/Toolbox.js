import React, { Component } from 'react';
import './index.css';

import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Badge from '@material-ui/core/Badge';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Switch from '@material-ui/core/Switch';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import SettingsIcon from '@material-ui/icons/Settings';

class Toolbox extends Component {
	state = {
		open: false,
		anchorElUser: null,
		anchorElNotification: null
	};

	handleMenuUser = (event) => {
		console.log(event.currentTarget);
		this.setState({ anchorElUser: event.currentTarget, anchorElNotification: null });
	};

	handleCloseUser = () => {
		this.setState({ anchorElUser: null, anchorElNotification: null });
	};

	handleMenuNotifications = (event) => {
		console.log(event.currentTarget);
		this.setState({ anchorElNotification: event.currentTarget, anchorElUser: null });
	};

	handleCloseNotification = () => {
		this.setState({ anchorElNotification: null, anchorElUser: null });
	};

	render() {
		const { anchorElUser, anchorElNotification } = this.state;
		const openUser = Boolean(anchorElUser);
		const openNotification = Boolean(anchorElNotification);
		return (
			<React.Fragment>
				<div id="menuUser">
					<IconButton
						aria-owns={openUser ? 'user-appbar' : null}
						aria-haspopup="true"
						onClick={this.handleMenuUser}
						color="inherit"
					>
						<AccountCircle color="primary" />
					</IconButton>
					<Menu
						id="user-appbar"
						anchorEl={anchorElUser}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right'
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right'
						}}
						open={openUser}
						onClose={this.handleCloseUser}
					>
						<MenuItem onClick={this.handleCloseUser}>Profile</MenuItem>
						<MenuItem onClick={this.handleCloseUser}>My account</MenuItem>
					</Menu>
				</div>
				<div id="notificationMenu">
					<IconButton
						aria-owns={openNotification ? 'notification-appbar' : null}
						aria-haspopup="true"
						onClick={this.handleMenuNotifications}
						color="inherit"
					>
						<Badge badgeContent={4} color="secondary">
							<NotificationsIcon color="primary" />
						</Badge>
					</IconButton>
					<Menu
						id="notification-appbar"
						anchorEl={anchorElNotification}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right'
						}}
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right'
						}}
						open={openNotification}
						onClose={this.handleCloseNotification}
					>
						<MenuItem onClick={this.handleCloseNotification}>Notification 01</MenuItem>
						<MenuItem onClick={this.handleCloseNotification}>Notification 02</MenuItem>
					</Menu>
				</div>
			</React.Fragment>
		);
	}
}

export default Toolbox;

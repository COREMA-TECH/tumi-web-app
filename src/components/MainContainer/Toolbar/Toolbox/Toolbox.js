import React, { Component } from 'react';
import './index.css';

import IconButton from '@material-ui/core/IconButton';
import NotificationsIcon from '@material-ui/icons/Notifications';
import SettingsIcon from '@material-ui/icons/Settings';
import Badge from '@material-ui/core/Badge';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

class Toolbox extends Component {
	state = {
		open: false
	};

	handleToggle = () => {
		this.setState((state) => ({ open: !state.open }));
	};

	handleClose = (event) => {
		if (this.anchorEl.contains(event.target)) {
			return;
		}
		this.setState({ open: false });
	};

	render() {
		const { open } = this.state;
		return (
			<div className="toolbox">
				<IconButton>
					<SettingsIcon color="primary" />
				</IconButton>
				<IconButton
					buttonRef={(node) => {
						this.anchorEl = node;
					}}
					aria-owns={open ? 'menu-list-grow' : null}
					aria-haspopup="true"
					onClick={this.handleToggle}
				>
					<Badge badgeContent={4} color="secondary">
						<NotificationsIcon color="primary" />
					</Badge>
				</IconButton>
				<Popper
					modifiers={{ preventOverflow: { enabled: false } }}
					placement="left"
					open={open}
					transition
					disablePortal
				>
					{({ TransitionProps, placement }) => (
						<Grow
							{...TransitionProps}
							id="menu-list-grow"
							style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
						>
							<Paper>
								<ClickAwayListener onClickAway={this.handleClose}>
									<MenuList>
										<MenuItem onClick={this.handleClose}>User</MenuItem>
										<MenuItem onClick={this.handleClose}>My account</MenuItem>
										<MenuItem onClick={this.handleClose}>Logout</MenuItem>
									</MenuList>
								</ClickAwayListener>
							</Paper>
						</Grow>
					)}
				</Popper>
			</div>
		);
	}
}

export default Toolbox;

import React, { Component } from 'react';
import './index.css';
import HeaderNav from '../HeaderNav';
import Menu from '../Menu';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Hidden from '@material-ui/core/Hidden';
import Divider from '@material-ui/core/Divider';
import MenuIcon from '@material-ui/icons/Menu';
import InboxIcon from '@material-ui/icons/Inbox';
import DraftsIcon from '@material-ui/icons/Drafts';

const drawerWidth = 240;

const styles = (theme) => ({
	root: {
		flexGrow: 1,
		height: 440,
		zIndex: 1,
		overflow: 'hidden',
		position: 'relative',
		display: 'flex',
		width: '100%'
	},
	appBar: {
		position: 'absolute',
		marginLeft: drawerWidth,
		[theme.breakpoints.up('md')]: {
			width: `calc(100% - ${drawerWidth}px)`
		}
	},
	navIconHide: {
		[theme.breakpoints.up('md')]: {
			display: 'none'
		}
	},
	toolbar: theme.mixins.toolbar,
	drawerPaper: {
		width: drawerWidth,
		[theme.breakpoints.up('md')]: {
			position: 'relative'
		}
	},
	content: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing.unit * 3
	}
});
class Nav extends Component {
	render() {
		const { classes, theme } = this.props;

		const drawer = (
			<div>
				<div className={classes.toolbar}>
					<HeaderNav />
				</div>
				<Divider />
				<List component="nav">
					<ListItem button component="a" href="/Company">
						<ListItemIcon>
							<InboxIcon />
						</ListItemIcon>
						<ListItemText primary="Company" />
					</ListItem>
					<ListItem button component="a" href="/Contracts">
						<ListItemIcon>
							<DraftsIcon />
						</ListItemIcon>
						<ListItemText primary="Contracts" />
					</ListItem>
				</List>
				<Divider />
				<List component="nav">
					<ListItem button component="a" href="/WorkOrders">
						<ListItemIcon>
							<InboxIcon />
						</ListItemIcon>
						<ListItemText primary="Work Orders" />
					</ListItem>
					<ListItem button component="a" href="/Permissions">
						<ListItemIcon>
							<DraftsIcon />
						</ListItemIcon>
						<ListItemText primary="Permissions" />
					</ListItem>
				</List>
			</div>
		);
		return (
			<div className="">
				<div className={classes.root}>
					<Hidden mdUp>
						<Drawer
							variant="temporary"
							anchor={theme.direction === 'rtl' ? 'right' : 'left'}
							open={this.props.mobileOpen}
							onClose={this.props.handleDrawerToggle}
							classes={{
								paper: classes.drawerPaper
							}}
							ModalProps={{
								keepMounted: true // Better open performance on mobile.
							}}
						>
							{drawer}
						</Drawer>
					</Hidden>
					<Hidden smDown implementation="css">
						<Drawer
							variant="permanent"
							open
							classes={{
								paper: classes.drawerPaper
							}}
						>
							{drawer}
						</Drawer>
					</Hidden>
				</div>
			</div>
		);
	}
}

Nav.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(Nav);

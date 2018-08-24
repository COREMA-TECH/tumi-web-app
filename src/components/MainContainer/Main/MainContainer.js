import React, { Component } from 'react';
import './index.css';
import Toolbar from '../Toolbar/Main/Toolbar';
import Container from '../Container/';

import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ToolbarContainer from '@material-ui/core/Toolbar';
import AppBar from '@material-ui/core/AppBar';

const drawerWidth = 240;

const styles = (theme) => ({
	appBar: {
		position: 'absolute',
		marginLeft: drawerWidth,
		[theme.breakpoints.up('md')]: {
			width: `calc(100% - ${drawerWidth}px)`
		},
		backgroundColor: 'white'
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
	},
	flex: {
		flexGrow: 1
	},
	menuButton: {
		marginLeft: -12,
		marginRight: 20
	}
});

class MainContainer extends Component {
	render() {
		const { classes } = this.props;

		return (
			<div className="main-container">
				<div className="main-container--header">
					<div className={classes.root}>
						<AppBar className={classes.appBar}>
							<ToolbarContainer>
								<IconButton
									color="inherit"
									aria-label="Open drawer"
									onClick={this.props.handleDrawerToggle}
									className={classes.navIconHide}
								>
									<MenuIcon color="primary" />
								</IconButton>
								<Toolbar />
							</ToolbarContainer>
						</AppBar>
					</div>
				</div>
				<div className="main-container--container">
					<main className={classes.content}>
						<Container />
					</main>
				</div>
			</div>
		);
	}
}
MainContainer.propTypes = {
	classes: PropTypes.object.isRequired,
	theme: PropTypes.object.isRequired
};

export default withStyles(styles, { withTheme: true })(MainContainer);

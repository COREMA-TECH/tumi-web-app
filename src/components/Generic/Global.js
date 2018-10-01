import { Snackbar } from '@material-ui/core';
import { MySnackbarContentWrapper } from './SnackBar';
import React, { Component } from 'react';
const withGlobalContent = (WrappedComponent) => {
	return class Global extends Component {
		state = {
			openSnackbar: false,
			variantSnackbar: 'info',
			messageSnackbar: 'Dummy text!'
		};

		baseUrl = "http://192.168.0.108:4000";

		handleCloseSnackbar = (event, reason) => {
			if (reason === 'clickaway') {
				return;
			}

			this.setState({ openSnackbar: false });
		};

		handleOpenSnackbar = (variant, message) => {
			this.setState({
				openSnackbar: true,
				variantSnackbar: variant,
				messageSnackbar: message
			});
		};

		closeMenu = (event) => {
			document.getElementById("MenuMobile-callback").checked = false;
		};

		customProps = {
			handleCloseSnackbar: this.handleCloseSnackbar,
			handleOpenSnackbar: this.handleOpenSnackbar,
			handleCloseMenu: this.closeMenu,
			baseUrl: this.baseUrl
		};

		render() {
			var obj = Object.assign({}, this.props, this.customProps);
			return (
				<React.Fragment>
					<Snackbar
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'center'
						}}
						open={this.state.openSnackbar}
						autoHideDuration={3000}
						onClose={this.handleCloseSnackbar}
					>
						<MySnackbarContentWrapper
							onClose={this.handleCloseSnackbar}
							variant={this.state.variantSnackbar}
							message={this.state.messageSnackbar}
						/>
					</Snackbar>
					<WrappedComponent {...obj} />
				</React.Fragment>
			);
		}
	};
};

export default withGlobalContent;

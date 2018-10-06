import { Snackbar } from '@material-ui/core';
import { MySnackbarContentWrapper } from './SnackBar';
import React, { Component } from 'react';

/**
 *  CONFIGURATION OF APOLLO CLIENT
 */

const withGlobalContent = (WrappedComponent,) => {
	return class Global extends Component {
		state = {
			openSnackbar: false,
			variantSnackbar: 'info',
			messageSnackbar: 'Dummy text!'
		};

		handleCloseSnackbar = (event, reason) => {
			if (reason === 'clickaway') {
				return;
			}

			this.setState({ openSnackbar: false });
		};

		handleOpenSnackbar = (variant, message, verticalAlign = 'bottom', horizontalAlign = 'center') => {
			this.setState({
				openSnackbar: true,
				variantSnackbar: variant,
				messageSnackbar: message,
                verticalAlign: verticalAlign,
                horizontalAlign: horizontalAlign
			});
		};

		closeMenu = (event) => {
			document.getElementById('MenuMobile-callback').checked = false;
		};

		customProps = {
			handleCloseSnackbar: this.handleCloseSnackbar,
			handleOpenSnackbar: this.handleOpenSnackbar,
			handleCloseMenu: this.closeMenu
		};

		render() {
			var obj = Object.assign({}, this.props, this.customProps);
			return (
				<React.Fragment>
					<Snackbar
						anchorOrigin={{
							vertical: this.state.verticalAlign,
							horizontal: this.state.horizontalAlign
						}}
						open={this.state.openSnackbar}
						autoHideDuration={5000}
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

import React from 'react';
import Dialog from '@material-ui/core/Dialog/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent/DialogContent';
import DialogActions from '@material-ui/core/DialogActions/DialogActions';

if (localStorage.getItem('languageForm') === undefined || localStorage.getItem('languageForm') == null) {
    localStorage.setItem('languageForm', 'en');
}

const spanishActions = require(`ApplyForm/Application/languagesJSON/${localStorage.getItem(
	'languageForm'
)}/spanishActions`);

const styles = (theme) => ({
	wrapper: {
		margin: theme.spacing.unit,
		position: 'relative'
	},

	buttonProgress: {
		//		color: green[500],
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12
	}
});

class ConfirmDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			open: false
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({ open: nextProps.open });
	}

	render() {
		let {confirmActionLabel} = this.props;
		return (
			<Dialog open={this.state.open} onClose={this.props.closeAction} aria-labelledby="form-dialog-title">
				<DialogTitle>{this.props.title}</DialogTitle>
				<DialogContent />
				<DialogActions>
					<button className="applicant-card__cancel-button" onClick={this.props.closeAction}>
						{spanishActions[2].label}
					</button>
					<button
						className="applicant-card__save-button"
						onClick={() => {
							this.props.confirmAction();
						}}
					>
						{this.props.loading && <i className="fac fa fa-spinner fa-spin" />}
						{confirmActionLabel || spanishActions[3].label}
					</button>
				</DialogActions>
			</Dialog>
		);
	}
}

export default ConfirmDialog;

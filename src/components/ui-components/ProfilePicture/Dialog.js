import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';

class CustomDialog extends Component {

    render() {
        const { fullScreen } = this.props;
        return <Dialog
            fullScreen={fullScreen}
            open={this.props.open}
            aria-labelledby="responsive-dialog-title"
            maxWidth={this.props.maxWidth}
        >
            <DialogTitle id="responsive-dialog-title">{this.props.title}</DialogTitle>
            <DialogContent>
                {this.props.children}
            </DialogContent>
            <DialogActions>
                <button onClick={this.props.handleClose} className="btn btn-danger">
                    Close&nbsp;<i class="fas fa-ban"></i>
                </button>
            </DialogActions>
        </Dialog>
    }
}

CustomDialog.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
};

const GenericDialog = withMobileDialog()(CustomDialog);
export { GenericDialog };
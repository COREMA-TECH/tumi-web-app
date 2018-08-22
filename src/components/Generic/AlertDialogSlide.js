import React from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import Button from '@material-ui/core/Button';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}

class AlertDialogSlide extends React.Component {
    state = {
        open: this.props.open
    };

    render(props) {
        return (
            <Dialog
                open={this.props.open}
                TransitionComponent={Transition}
                keepMounted
                onClose={this.props.handleClose}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">{'Confirm action?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">{this.props.content}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.handleConfirm} color="primary" variant="contained">
                        Accept
                    </Button>
                    <Button onClick={this.props.handleClose} color="secondary" variant="contained">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default AlertDialogSlide;

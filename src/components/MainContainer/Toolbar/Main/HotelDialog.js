import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TabsInDialog from '../../../Company/TabsInDialog/TabsInDialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Toolbar from '@material-ui/core/Toolbar';

class HotelDialog extends Component {

    constructor() {
        super();
        this.state = {
            open: false,
            idProperty: null,
            idManagement: 99999
        }
    }

    UNSAFE_componentWillMount() {

    }

    render() {
        console.log(this.props);
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    aria-labelledby="scroll-dialog-title"
                    fullScreen
                >
                    <DialogTitle id="alert-dialog-title dialog-header">{'Property Information'}</DialogTitle>
                    <AppBar style={{ background: '#0092BD' }}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={this.props.handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="title" color="inherit">
                                Management Hotel
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <DialogContent>
                        <TabsInDialog
                            idCompany={this.props.idCompany}
                            Markup={this.props.Markup}
                            idProperty={this.props.idProperty}
                            handleClose={this.handleClose}
                            handleOpenSnackbar={this.props.handleOpenSnackbar}
                        />
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

}

export default HotelDialog;
import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import green from '@material-ui/core/colors/green';
import AlertDialogSlide from 'Generic/AlertDialogSlide';
import {withApollo} from 'react-apollo';
import Tooltip from '@material-ui/core/Tooltip';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import 'ui-components/InputForm/index.css';
import './index.css';
import withGlobalContent from 'Generic/Global';

const styles = (theme) => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexWrap: 'wrap',
        marginBottom: '30px',
        width: '100%'
    },
    root: {
        display: 'flex',
        alignItems: 'center'
    },
    formControl: {
        margin: theme.spacing.unit
        //width: '100px'
    },
    contactControl: {width: '535px', paddingRight: '0px'},
    rolControl: {width: '260px', paddingRight: '0px'},
    languageControl: {width: '260px', paddingRight: '0px'},
    usernameControl: {
        width: '150px'
    },
    fullnameControl: {
        width: '300px'
    },
    emailControl: {
        width: '350px'
    },
    numberControl: {
        //width: '150px'
    },
    passwordControl: {
        width: '120px'
    },

    resize: {
        //width: '200px'
    },
    divStyle: {
        width: '95%',
        display: 'flex'
        //justifyContent: 'space-around'
    },
    divStyleColumns: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        paddingLeft: '40px'
    },
    divAddButton: {
        display: 'flex',
        justifyContent: 'end',
        width: '95%',
        heigth: '60px'
    },
    button: {
        margin: theme.spacing.unit
    },
    input: {
        display: 'none'
    },
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative'
    },
    buttonSuccess: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700]
        }
    },
    fabProgress: {
        color: green[500],
        position: 'absolute',
        top: -6,
        left: -6,
        zIndex: 1
    },
    buttonProgress: {
        color: green[500],
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12
    }
});

class PayRoll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            filterText: '',
        };
    }

    componentWillMount() {

    }

    filterPayRoll = (filterText) => {

    };

    filterChangeHandler = (e) => {
        let value = e.target.value;
        this.setState({
            filterText: value
        }, () => {
            this.filterPayRoll(value);
        });
    };

    handleClickOpenModal = () => {
        this.setState({ openModal: true });
    };

    render() {
        const {classes} = this.props;
        const {fullScreen} = this.props;

        return (
            <div className="users_tab">

                <AlertDialogSlide
                    handleClose={this.handleCloseAlertDialog}
                    handleConfirm={this.handleConfirmAlertDialog}
                    open={this.state.opendialog}
                    loadingConfirm={this.state.loadingConfirm}
                    content="Do you really want to continue whit this operation?"
                />

                <Dialog
                    fullScreen={fullScreen}
                    open={this.state.openModal}
                    onClose={this.cancelUserHandler}
                    aria-labelledby="responsive-dialog-title"
                    maxWidth="sm"
                >
                    <DialogTitle id="responsive-dialog-title" style={{padding: '0px'}}>
                        <div className="modal-header">
                            <h5 className="modal-title">
                                {this.state.idToEdit != null &&
                                this.state.idToEdit != '' &&
                                this.state.idToEdit != 0 ? (
                                    'Edit Payroll'
                                ) : (
                                    'Add Payroll'
                                )}
                            </h5>
                        </div>
                    </DialogTitle>
                    <DialogContent maxWidth="md">
                        <div className="card-body">
                            <div className="row">
                                <div className="col-lg-12">

                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions style={{margin: '16px 10px'}}>
                        <div className={classes.root}>
                            <div className={classes.wrapper}>
                                <Tooltip
                                    title="Save"
                                >
                                    <div>
                                        <button
                                            // disabled={isLoading || !this.Login.AllowEdit || !this.Login.AllowInsert}
                                            className="btn btn-success"
                                            onClick={this.addUserHandler}
                                        >
                                            Save
                                            {/*{isLoading && <i className="fas fa-spinner fa-spin ml-1"/>}*/}
                                        </button>
                                    </div>
                                </Tooltip>
                                <Tooltip
                                    title="Cancel"
                                >
                                    <div>
                                        <button
                                            className="btn btn-default"
                                            onClick={() => {
                                            }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </Tooltip>
                            </div>
                        </div>
                    </DialogActions>
                </Dialog>

                <div className="row">
                    <div className="col-md-6">
                        <div className="input-group mb-3">
                            <div className="input-group-prepend">
                                <span className="input-group-text" id="basic-addon1">
                                    <i className="fa fa-search icon"/>
                                </span>
                            </div>
                            <input
                                onChange={this.filterChangeHandler}
                                value={this.state.filterText}
                                type="text"
                                placeholder="Payroll search"
                                className="form-control"
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <button className="float-right btn btn-success mr-1" onClick={this.handleClickOpenModal}>
                            Add PayRoll<i className="fas fa-plus ml-2"/>
                        </button>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="">
                            <div className="row">
                                <div className="col-md-12">

                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}

PayRoll.propTypes = {
    fullScreen: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(withMobileDialog()(withGlobalContent(PayRoll))));


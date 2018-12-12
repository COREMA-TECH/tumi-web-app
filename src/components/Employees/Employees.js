import React, {Component} from 'react';
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import Dialog from "@material-ui/core/Dialog/Dialog";
import green from "@material-ui/core/colors/green";
import PropTypes from 'prop-types';
import {withStyles} from "@material-ui/core";

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
    numberControl: {
        //width: '200px'
    },
    nameControl: {
        //width: '100px'
    },
    emailControl: {
        //width: '200px'
    },
    comboControl: {
        //width: '200px'
    },
    resize: {
        //width: '200px'
    },
    divStyle: {
        width: '95%',
        display: 'flex',
        justifyContent: 'space-around'
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

class Employees extends Component {
    constructor(props) {
        super(props);

        this.state = {
            openModal: false
        }
    }

    /**
     * To open modal updating the state
     */
    handleClickOpenModal = () => {
        this.setState({openModal: true});
    };

    /**
     * To hide modal and then restart modal state values
     */
    handleCloseModal = () => {
        this.setState({
            openModal: false
        });
    };

    render() {
        const {classes} = this.props;
        const {fullScreen} = this.props;

        let renderHeaderContent = () => (
            <div className="row">
                <div className="col-md-6">
                    <div class="input-group mb-3">
                        <div class="input-group-prepend">
							<span class="input-group-text" id="basic-addon1">
								<i className="fa fa-search icon"/>
							</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Search employees"
                            className="form-control"
                        />
                    </div>
                </div>
                <div className="col-md-6">
                    <button
                        className="btn btn-success float-right"
                        onClick={this.handleClickOpenModal}
                    >
                        Add Employees
                    </button>
                </div>
            </div>
        );

        let renderNewEmployeeDialog = () => (
            <Dialog
                fullScreen={fullScreen}
                open={this.state.openModal}
                onClose={this.handleCloseModal}
                aria-labelledby="responsive-dialog-title"
                maxWidth="lg"
            >
                <DialogTitle style={{padding: '0px'}}>
                    <div className="modal-header">
                        <h5 class="modal-title">New Employees</h5>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <form className="container">

                    </form>
                </DialogContent>
                <DialogActions style={{margin: '20px 20px'}}>
                    <div className={classes.root}>
                        <div className={classes.wrapper}>
                            <button
                                variant="fab"
                                className="btn btn-success"
                                onClick={this.insertDepartment}
                            >
                                Save {!this.state.saving && <i class="fas fa-save"/>}
                                {this.state.saving && <i class="fas fa-spinner fa-spin"/>}
                            </button>
                        </div>
                    </div>
                    <div className={classes.root}>
                        <div className={classes.wrapper}>
                            <button
                                variant="fab"
                                className="btn btn-danger"
                                onClick={this.handleCloseModal}
                            >
                                Cancel <i class="fas fa-ban"/>
                            </button>
                        </div>
                    </div>
                </DialogActions>
            </Dialog>
        );

        return (
            <div>
                {
                    renderHeaderContent()
                }

                {
                    renderNewEmployeeDialog()
                }
            </div>
        );
    }
}

Employees.propTypes = {
    classes: PropTypes.object.isRequired,
    fullScreen: PropTypes.bool.isRequired
};

export default withStyles(styles)(Employees);
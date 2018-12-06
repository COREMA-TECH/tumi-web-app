import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withApollo } from 'react-apollo';
import { ADD_APPLICATION_PHASES, UPDATE_APPLICANT } from "./Mutations";

class ApplicationPhasesForm extends Component {

    constructor() {
        super();
        this.state = {
            ReasonId: 0,
            Comment: ""
        }
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };

    handleSubmit = (event) => {
        event.preventDefault();
        this.addApplicationPhase(event);
        this.updateApplicationInformation(event);
    }

    updateApplicationInformation = (event) => {
        this.setState(
            {
                insertDialogLoading: true
            },
            () => {
                this.props.client
                    .mutate({
                        mutation: UPDATE_APPLICANT,
                        variables: {
                            id: this.props.ApplicationId,
                            isLead: true,
                            idRecruiter: localStorage.getItem('LoginId'),
                            idWorkOrder: this.props.WorkOrderId
                        }
                    })
                    .then(({ data }) => {
                        this.setState({ editing: false });
                        //this.props.handleOpenSnackbar('success', Message, 'bottom', 'right');
                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar(
                            'error',
                            'Error to update applicant information. Please, try again!',
                            'bottom',
                            'right'
                        );
                    });
            });
    };

    addApplicationPhase = (event) => {
        this.props.client.mutate({
            mutation: ADD_APPLICATION_PHASES,
            variables: {
                applicationPhases: {
                    Comment: this.state.Comment,
                    UserId: localStorage.getItem('LoginId'),
                    WorkOrderId: this.props.WorkOrderId,
                    ReasonId: this.state.ReasonId,
                    ApplicationId: this.props.ApplicationId,
                    StageId: 30460
                }
            }
        }).then(({ data }) => {
            this.setState({
                editing: false
            });
            this.props.handleCloseModal(event);
            this.props.handleOpenSnackbar('success', "The Candidate was rejected", 'bottom', 'right');
        }).catch((error) => {
            console.log(error);
            this.props.handleOpenSnackbar(
                'error',
                'Error to Add applicant information. Please, try again!',
                'bottom',
                'right'
            );
        });
    }

    render() {
        return (
            <Dialog maxWidth="xl" open={this.props.openReason}>
                <DialogTitle style={{ padding: '0px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Application Rejected</h5>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <form action="" onSubmit={this.handleSubmit}>
                        <div className="row">
                            <div className="col-md-6">
                                <div class="inputGroup">
                                    <input id="radio1" name="ReasonId" type="radio" value="30458" onChange={this.handleChange} />
                                    <label for="radio1">No Show</label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div class="inputGroup">
                                    <input id="radio2" name="ReasonId" type="radio" value="30459" onChange={this.handleChange} />
                                    <label for="radio2">Disqualify</label>
                                </div>
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="">Comment</label>
                                <textarea onChange={this.handleChange} name="Comment" className="form-control" id="" cols="30" rows="10"></textarea>
                            </div>
                            <div className="col-md-12 mt-2">
                                <button className="btn btn-danger float-right" onClick={this.props.handleCloseModal}>
                                    Cancel
                                    <i class="fas fa-ban ml-1"></i>
                                </button>
                                <button className="btn btn-success float-right mr-1" >
                                    Save
                                    <i class="fas fa-save ml-1"></i>
                                </button>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

        );
    }

}

export default withStyles()(withMobileDialog()(withApollo(ApplicationPhasesForm)));
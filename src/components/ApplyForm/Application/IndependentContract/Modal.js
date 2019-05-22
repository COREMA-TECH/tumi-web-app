import React, { Component } from 'react';
import Content from './Content';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import withApollo from "react-apollo/withApollo";
import { ADD_INDEPENDENT_CONTRACT } from './Mutations';
import PropTypes from 'prop-types';

const spanishActions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);

class IndependentContractModal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            hasSign: false
        }
    }

    setSignStatus = (hasSign) => {
        this.setState(() => ({ hasSign }))
    }

    saveIndependentContact = () => {
        let html = document.getElementById('independenContractContainer');

        if (!html)
            this.props.handleOpenSnackbar(
                'error',
                'This document can not be processed , please try again!',
                'bottom',
                'right'
            );
        else {
            let inputs = html.getElementsByTagName('input');

            //Disable elements before save html into database
            for (let i = 0; i < inputs.length; i++) {
                inputs[i].disabled = true;
            }

            //Insert record into database
            this.props.client
                .mutate({
                    mutation: ADD_INDEPENDENT_CONTRACT,
                    variables: {
                        html: html.outerHTML,
                        ApplicantId: this.props.applicationId
                    }
                })
                .then(({ data }) => {
                    this.props.handleOpenSnackbar(
                        'success',
                        'Created successfully',
                        'bottom',
                        'right'
                    );
                    this.props.handleVisibility(false)();
                    if (this.props.getApplicantInformation)
                        this.props.getApplicantInformation(this.props.applicationId);
                })
                .catch(error => {
                    // If there's an error show a snackbar with a error message
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to save Independet Contract. Please, try again!',
                        'bottom',
                        'right'
                    );
                });
        }
    }

    handleIndependenContractSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (this.state.hasSign)
            this.saveIndependentContact();
        else
            this.props.handleOpenSnackbar(
                'warning',
                'You must sign the document to continue!',
                'bottom',
                'right'
            );
    }

    render() {
        return <Dialog maxWidth="md" open={this.props.open} onClose={this.props.handleVisibility(false)}>

            <form id="independentContractForm" onSubmit={this.handleIndependenContractSubmit}>
                <DialogTitle>
                    <h5 className="modal-title">INDEPENDENT CONTRACT</h5>
                </DialogTitle>
                <DialogContent>
                    <Content setSignStatus={this.setSignStatus} />
                </DialogContent>
                <DialogActions>
                    <div className="applicant-card__footer">
                        <button
                            className="applicant-card__cancel-button"
                            onClick={this.props.handleVisibility(false)}
                        >
                            {spanishActions[2].label}
                        </button>
                        <button type="submit" className="applicant-card__save-button" > Accept </button>

                    </div>
                </DialogActions>

            </form>
        </Dialog>

    }
}

IndependentContractModal.propTypes = {
    applicationId: PropTypes.object.isRequired,
    open: PropTypes.object.isRequired,
    handleVisibility: PropTypes.func.isRequired,
    handleOpenSnackbar: PropTypes.func.isRequired
};

export default withApollo(IndependentContractModal);
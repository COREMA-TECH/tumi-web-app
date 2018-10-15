import React, {Component} from 'react';
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import SignatureForm from "../../SignatureForm/SignatureForm";
import withApollo from "react-apollo/withApollo";
import {ADD_NON_DISCLOSURE} from "./Mutations";
import withGlobalContent from "../../../Generic/Global";

class NonDisclosure extends Component {
    constructor(props) {
        super(props);

        this.state = {
            signature: null,
            openSignature: false
        }
    }

    handleSignature = (value) => {
        this.setState({
            signature: value,
            openSignature: false
        });
    };

    insertNonDisclosure = (item) => {
        this.props.client
            .query({
                query: ADD_NON_DISCLOSURE,
                variables: {
                    disclosures: item
                }
            })
            .then(({data}) => {
                // Show a snackbar with a success message
                this.props.handleOpenSnackbar(
                    'success',
                    'Successfully saved!',
                    'bottom',
                    'right'
                );
            })
            .catch(error => {
                // If there's an error show a snackbar with a error message
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to save Non-Disclosure information. Please, try again!',
                    'bottom',
                    'right'
                );
            });
    };


    render() {
        let renderSignatureDialog = () => (
            <div>
                <Dialog
                    open={this.state.openSignature}
                    onClose={() => {
                        this.setState({
                            openSignature: false,
                        }, () => {
                            if (this.state.signature === '') {
                                this.setState({
                                    accept: false
                                })
                            }
                        })
                    }}
                    aria-labelledby="form-dialog-title">
                    <DialogTitle>
                        <h1 className="primary apply-form-container__label text-center">Please Sign</h1>
                    </DialogTitle>
                    <DialogContent>
                        <SignatureForm applicationId={this.state.applicationId}
                                       signatureValue={this.handleSignature}/>
                    </DialogContent>
                </Dialog>
            </div>
        );

        return (
            <div className="Apply-container--application">
                <div className="row">
                    <div className="col-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">Non-Disclosure</span>
                                {
                                    this.state.editing ? (
                                        ''
                                    ) : (
                                        <button className="applicant-card__edit-button" onClick={() => {
                                            this.setState({
                                                openSignature: true
                                            })
                                        }}>Sign <i className="far fa-edit"></i>
                                        </button>
                                    )
                                }
                            </div>
                            <div className="row pdf-container"></div>
                        </div>
                    </div>
                </div>
                {
                    renderSignatureDialog()
                }
            </div>
        );
    }
}

export default withApollo(withGlobalContent(NonDisclosure));
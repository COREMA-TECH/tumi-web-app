import React, { Component, Fragment } from 'react';
import SignatureForm from "../../SignatureForm/SignatureForm";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";

class Signature extends Component {

    constructor(props) {
        super(props);
        this.state = {
            signature: ''
        }
    }

    handleSignature = (value) => {
        this.props.handleSignature(value);
    }

    render() {
        return(
            <Fragment>
                <Dialog open={this.props.openSignature} onClose={this.props.enableSignature} aria-labelledby="form-dialog-title">
                        <DialogContent>
                            <SignatureForm applicationId={this.props.applicationId}
                                showSaveIcon={null}
                                signatureValue={this.handleSignature}
                            />
                        </DialogContent>
                </Dialog>
            </Fragment>
        );
    }

}

export default Signature;
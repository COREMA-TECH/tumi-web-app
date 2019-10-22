import React, { Component, Fragment } from 'react';
import SignatureForm from "../../SignatureForm/SignatureForm";

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
                <SignatureForm applicationId={this.props.applicationId}
                    showSaveIcon={null}
                    signatureValue={this.handleSignature}
                />
            </Fragment>
        );
    }

}

export default Signature;
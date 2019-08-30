import React, { Component } from 'react';
import renderHTML from 'react-render-html';
import PropTypes from 'prop-types';
import { CREATE_RECORD } from './mutations';
import { CREATE_DOCUMENTS_PDF_QUERY } from './queries';
import withApollo from "react-apollo/withApollo";
import moment from 'moment';

const uuidv4 = require('uuid/v4');
const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAu4AAAGJCAIAAABaZiHiAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpFRDBCQ0YxQ0JCNTMxMUU4QUI5RTkyNjREMDAzMDg4MiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpFRDBCQ0YxREJCNTMxMUU4QUI5RTkyNjREMDAzMDg4MiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkVEMEJDRjFBQkI1MzExRThBQjlFOTI2NEQwMDMwODgyIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkVEMEJDRjFCQkI1MzExRThBQjlFOTI2NEQwMDMwODgyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+D8DOXwAAD39JREFUeNrs3UuyG0UQ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";

class VerificationLetter extends Component {

    state = {
        sending: false,
        downloading: false,
        email: ''
    }

    sleep() {
        return new Promise((resolve) => setTimeout(resolve, 8000));
    }

    onClickCancelHanler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.props.handleCloseModalVerificacion();
    }

    onClickDownloadHandler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState(() => ({ downloading: true }));
        let filename = `ApplicantVerificationLetter_${this.props.ApplicationId}_${uuidv4()}`;
        this.props.client
            .query({
                query: CREATE_DOCUMENTS_PDF_QUERY,
                variables: {
                    contentHTML: this.getContentPDF(),
                    Name: filename
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data: { createdocumentspdf } }) => {
                if (createdocumentspdf != null) {
                    this.sleep().then(() => {
                        var url = `${this.context.baseUrl}/public/Documents/${filename}.pdf`;
                        window.open(url, '_blank');
                        this.setState({ downloading: false });
                        this.props.handleCloseModalVerificacion();
                    }).catch(error => {
                        this.setState({ downloading: false })
                    })
                } else {
                    this.props.handleOpenSnackbar('error', 'Error downloading PDF');
                    this.setState({ downloading: false });
                }
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error downloading PDF');
                this.setState({ downloading: false });
            });
    }

    getContentPDF = () => {
        let contentPDF = document.getElementById('verificationLetterDocumentPDF');
        let contentPDFClone = contentPDF.cloneNode(true);
        return `<html style="zoom: 70%;">${contentPDFClone.innerHTML}</html>`;
    }

    onSubmitHandler = (e) => {
        e.preventDefault();
        this.setState(() => ({ sending: true }));
        this.props.client.mutate({
            mutation: CREATE_RECORD,
            variables: {
                html: this.getContentPDF(),
                ApplicationId: this.props.ApplicationId,
                email: this.state.email
            }
        })
            .then(({ data: { addApplicantVerificationLetter } }) => {
                this.sleep().then(() => {
                    let url = `${this.context.baseUrl}${addApplicantVerificationLetter.replace('.', '')}`;
                    window.open(url, '_blank');
                    this.setState(() => ({ sending: false }));
                    this.props.handleCloseModalVerificacion();
                }).catch(error => {
                    this.setState({ sending: false })
                })
            })
            .catch(error => {
                this.setState(() => ({ sending: false }));
                this.props.handleOpenSnackbar('error', 'Error sending Verification Letter');
            })
    }

    onChangeHandler = (e) => {
        let element = e.target;
        this.setState(() => ({
            [element.name]: element.value
        }))
    }

    renderDowloadIcons = (downloading) => {
        if (downloading)
            return <React.Fragment>Downloading <i className="fas fa-spinner fa-spin ml-1" /></React.Fragment>
        return <React.Fragment>Download <i className="fas fa-download ml-1" /></React.Fragment>
    }

    render() {

        let { employeeName, employmentType, startDate, positionName } = this.props;
        let { sending, email, downloading } = this.state;
        let working = sending || downloading;

        return <React.Fragment>
            <form id="verificationLetterForm" onSubmit={this.onSubmitHandler}>
                <div className="row pdf-container" style={{ maxWidth: '700px' }}>
                    <div id="verificationLetterDocumentPDF" className="signature-information">
                        {renderHTML(`
                        <body>
                            <p><img style="width: 130px;" src='${logoBase64}' /></p>
                            <br/>
                            <p style="text-align: center; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;" align="center"><strong><u><span style="font-size: 12.0pt;">VERIFICATION OF EMPLOYMENT</span></u></strong></p>
                            <p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
                            <p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">${moment().format("MM/DD/YYYY")}</p>
                            <p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
                            <p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif; font-weight: bold;"><strong>Tumi Staffing</strong></p>
                            <p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif; font-weight: bold;"><strong>Po Box 592715</strong></p>
                            <p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif; font-weight: bold;"><strong>San Antonio, TX 78259</strong></p>
                            <p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
                            <p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">RE: Verification of Employment for <input style="width:200px; border:0; border-bottom: solid 1px #e4e4e4 ;" type="text" value='${employeeName}'/> </p>
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">To whom it may concern:</p>
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">Please accept this letter as confirmation that <input  style="width:265px; border:0; border-bottom: solid 1px #e4e4e4;" type="text"  value='${employeeName}'/> has been employed with <strong style = "font-weight: bold";>Tumi Staffing</strong> since <input type="text" style="width:200px; border:0; border-bottom: solid 1px #e4e4e4;" value='${moment(startDate).format('MM/DD/YYYY')}'/>.</p>
                            <br />
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">Currently, <input type="text" style="width:300px; border:0; border-bottom: solid 1px #e4e4e4;"  value='${employeeName}'/> holds the Title of <input type="text" style="width:250px; border:0; border-bottom: solid 1px #e4e4e4;" value='${positionName}' /> and works on a <input type="text" style="width:250px; border:0; border-bottom: solid 1px #e4e4e4;"  value='${employmentType}'/> basis.</p>
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;"><a></a>&nbsp;</p>
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">If you have any questions or require further information, please don&rsquo;t hesitate to contact me at 210-853-2099.</p>
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">Sincerely yours,</p>
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
                            <p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;"><strong>Claudia Robbins</strong></p>
                            <p style="text-align: justify; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;"><strong>Owner</strong></p>
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
                        </body>`)}
                    </div>
                </div>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <button
                            className={'btn btn-primary'}
                            disabled={working}
                            onClick={this.onClickDownloadHandler}
                        >
                            {this.renderDowloadIcons(downloading)}
                        </button>
                    </div>
                    <input name="email" type="email" required placeholder="example@exapmle.com" className="form-control" value={email} onChange={this.onChangeHandler} />
                    <div className="input-group-append">
                        <button
                            type="submit"
                            className={'btn btn-info'}
                            disabled={working}
                        >
                            Send
                            {!sending && <i className="fas fa-envelope ml-1" />}
                            {sending && <i className="fas fa-spinner fa-spin ml-1" />}
                        </button>
                        <button
                            className={'btn btn-danger'}
                            onClick={this.onClickCancelHanler}
                            disabled={working}
                        >
                            Close <i class="fas fa-times ml-1"></i>
                        </button>
                    </div>
                </div>
            </form>
        </React.Fragment>
    }
    static contextTypes = {
        baseUrl: PropTypes.string
    };
}

VerificationLetter.propTypes = {
    employeeName: PropTypes.string.isRequired,
    employmentType: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    positionName: PropTypes.string.isRequired,
    ApplicationId: PropTypes.number.isRequired,
    handleCloseModalVerificacion: PropTypes.func.isRequired,
    handleOpenSnackbar: PropTypes.func.isRequired
};


export default withApollo(VerificationLetter);
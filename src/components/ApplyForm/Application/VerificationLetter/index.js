import React, { Component } from 'react';
import renderHTML from 'react-render-html';
import PropTypes from 'prop-types';
import { CREATE_RECORD } from './mutations';
import withApollo from "react-apollo/withApollo";

class VerificationLetter extends Component {

    state = {
        downloading: false
    }

    sleep() {
        return new Promise((resolve) => setTimeout(resolve, 8000));
    }

    onClickCancelHanler = (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.props.handleCloseModalVerificacion();
    }

    onSubmitHandler = (e) => {
        e.preventDefault();
        this.setState(() => ({ downloading: true }));
        this.props.client.mutate({
            mutation: CREATE_RECORD,
            variables: {
                html: document.getElementById('verificationLetterDocumentPDF').innerHTML,
                ApplicationId: this.props.ApplicationId,
                email: this.state.email
            }
        })
            .then(({ data: { addApplicantVerificationLetter } }) => {
                this.sleep().then(() => {
                    let url = `${this.context.baseUrl}${addApplicantVerificationLetter.replace('.', '')}`;
                    window.open(url, '_blank');
                    this.setState(() => ({ downloading: false }));
                    this.props.handleCloseModalVerificacion();
                }).catch(error => {
                    this.setState({ downloading: false })
                })
            })
            .catch(error => {
                this.setState(() => ({ downloading: false }));
                this.props.handleOpenSnackbar('error', 'Error sending Verification Letter');
            })
    }

    onChangeHandler = (e) => {
        let element = e.target;
        this.setState(() => ({
            [element.name]: element.value
        }))
    }

    render() {

        let { employeeName, employmentType, startDate, positionName } = this.props;
        let { downloading, email } = this.state;

        return <React.Fragment>
            <form id="verificationLetterForm" onSubmit={this.onSubmitHandler}>
                <div className="row pdf-container" style={{ maxWidth: '700px' }}>
                    <div id="verificationLetterDocumentPDF" className="signature-information">
                        {renderHTML(`<!DOCTYPE html>
                    <html>
                        <head>
                        </head>
                        <body>
                            <p style="text-align: center; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;" align="center"><strong><u><span style="font-size: 12.0pt;">VERIFICATION OF EMPLOYMENT</span></u></strong></p>
                            <p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
                            <p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">Today&rsquo;s Date</p>
                            <p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
                            <p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif; font-weight: bold;"><strong>Tumi Staffing</strong></p>
                            <p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif; font-weight: bold;"><strong>Po Box 592715</strong></p>
                            <p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif; font-weight: bold;"><strong>San Antonio, TX 78259</strong></p>
                            <p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
                            <p style="margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">RE: Verification of Employment for <input style="width:200px; border:0; border-bottom: solid 1px #e4e4e4 ;" type="text" value='${employeeName}'/> </p>
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">&nbsp;</p>
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">To whom it may concern:</p>
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">Please accept this letter as confirmation that <input  style="width:265px; border:0; border-bottom: solid 1px #e4e4e4;" type="text"  value='${employeeName}'/> has been employed with <strong style = "font-weight: bold";>Tumi Staffing</strong> since <input type="text" style="width:200px; border:0; border-bottom: solid 1px #e4e4e4;" value='${startDate}'/>.</p>
                            <br />
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;">Currently, <input type="text" style="width:300px; border:0; border-bottom: solid 1px #e4e4e4;"  value='${employeeName}'/> holds the Title of <input type="text" style="width:250px; border:0; border-bottom: solid 1px #e4e4e4;" value='${positionName}' /> and works on a <input type="text" style="width:250px; border:0; border-bottom: solid 1px #e4e4e4;"  value='${employmentType}'/> basis.</p>
                            <p style="text-align: justify; line-height: 150%; margin: 0in 0in 0.0001pt; font-size: 11pt; font-family: Calibri, sans-serif;"><a name="_GoBack"></a>&nbsp;</p>
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
                        </body>
                    </html>`)}
                    </div>
                </div>
                <div className="input-group">
                    <input name="email" type="email" required placeholder="example@exapmle.com" className="form-control" value={email} onChange={this.onChangeHandler} />
                    <div className="input-group-append">
                        <button
                            type="submit"
                            className={'btn btn-info'}
                            disabled={downloading}
                        >
                            Send
                            {!downloading && <i className="fas fa-envelope ml-1" />}
                            {downloading && <i className="fas fa-spinner fa-spin ml-1" />}
                        </button>
                        <button
                            className={'btn btn-danger'}
                            onClick={this.onClickCancelHanler}
                            disabled={downloading}
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
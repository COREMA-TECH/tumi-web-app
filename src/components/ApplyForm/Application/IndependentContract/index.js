import React, { Component } from 'react';
import Content from './Content';
import withApollo from 'react-apollo/withApollo';
import withGlobalContent from "../../../Generic/Global";
import { GET_APPLICANT_INFO, CREATE_DOCUMENTS_PDF_QUERY } from './Queries';
import PropTypes from 'prop-types';

const uuidv4 = require('uuid/v4');

class IndependentContract extends Component {

    constructor(props) {
        super(props);

        this.state = {
            html: '',
            applicant: '',
            downloading: false
        }

    }

    componentWillMount() {
        this.loadInformation();
    }

    loadInformation = () => {
        this.props.client
            .query({
                query: GET_APPLICANT_INFO,
                variables: {
                    ApplicationId: this.props.applicationId
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data: { applicantIndependentContract } }) => {
                if (applicantIndependentContract.length > 0) {
                    let applicant = applicantIndependentContract[0];
                    this.setState(() => ({ html: applicant.html || '', applicant: `${applicant.application.firstName}_${applicant.application.lastName || ''}` }));
                }


            })
            .catch(error => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error loading data, please try again!',
                    'bottom',
                    'right'
                );
            })
    }

    downloadDocumentsHandler = (random) => {
        var url = this.context.baseUrl + '/public/Documents/' + "independentContract-" + random + this.state.applicant + '.pdf';
        window.open(url, '_blank');
        this.setState({ downloading: false });
    };

    createDocumentsPDF = () => {

        var random = uuidv4();
        this.setState(() => ({ downloading: true }),
            () => {
                let divContent = document.getElementById('independentContractPDF')
                let divClone = divContent.cloneNode(true);

                this.props.client
                    .query({
                        query: CREATE_DOCUMENTS_PDF_QUERY,
                        variables: {
                            contentHTML: `<html style="zoom: 70%;">${divClone.innerHTML}</html>`,
                            Name: "independentContract-" + random + this.state.applicant
                        },
                        fetchPolicy: 'no-cache'
                    })
                    .then((data) => {
                        if (data.data.createdocumentspdf != null) {
                            this.sleep().then(() => {
                                this.downloadDocumentsHandler(random);
                            }).catch(error => {
                                this.setState({ downloading: false })
                            })
                        } else {
                            this.props.handleOpenSnackbar(
                                'error',
                                'Error: Loading agreement: createdocumentspdf not exists in query data'
                            );
                            this.setState({ loadingData: false, downloading: false });
                        }
                    })
                    .catch((error) => {
                        this.props.handleOpenSnackbar('error', 'Error: Loading Create Documents in PDF: ' + error);
                        this.setState({ loadingData: false, downloading: false });
                    });
            })
    };

    sleep() {
        return new Promise((resolve) => setTimeout(resolve, 8000));
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.applicationId != this.props.applicationId) {
            this.setState({
                applicationId: nextProps.applicationId
            });
        }
    }

    render() {
        let { downloading } = this.state;

        return (
            <div className="Apply-container--application">
                <div className="row">
                    <div className="col-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">INDEPENDENT CONTRACT</span>

                                <button className="applicant-card__edit-button" onClick={this.createDocumentsPDF} disabled={downloading}>
                                    {!downloading && <React.Fragment>Download < i className="fas fa-download" /></React.Fragment>}
                                    {downloading && <React.Fragment>Downloading < i className="fas fa-spinner fa-spin" /></React.Fragment>}
                                </button>
                            </div>
                            <div style={{ width: '1000px', margin: '0 auto' }}>
                                <div className="row pdf-container--i9-w4" >
                                    <div id="independentContractPDF" className="signature-information" dangerouslySetInnerHTML={{ __html: this.state.html }}>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    static contextTypes = {
        baseUrl: PropTypes.string
    };
}

export default withApollo(withGlobalContent(IndependentContract));

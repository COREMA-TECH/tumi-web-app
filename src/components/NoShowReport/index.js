import React, { Component } from 'react';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import Header from './Header';
import Table from './Table';
import withApollo from 'react-apollo/withApollo';
import { GET_REPORT_INFORMATION, CREATE_DOCUMENTS_PDF_QUERY } from './queries';
import PropTypes from 'prop-types';

const uuidv4 = require('uuid/v4');


class NoShowReport extends Component {

    DEFAULT_STATE = {
        tableData: [],
        loadingReport: false,
        downloading: false
    }

    constructor(props) {
        super(props);
        this.state = {
            ...this.DEFAULT_STATE
        }
    }

    getReportInformation = () => {
        let { startDate, endDate, idRecruiter } = this.props;

        this.setState(() => ({ loadingReport: true }), () => {
            this.props.client
                .query({
                    query: GET_REPORT_INFORMATION,
                    fetchPolicy: 'no-cache',
                    variables: {
                        startDate,
                        endDate,
                        idRecruiter
                    }
                })
                .then(({ data: { applicationPhaseByDate, applicationPhaseByDate_Resume } }) => {
                    this.setState(() => ({
                        tableData: applicationPhaseByDate,
                        loadingReport: false,
                        header: applicationPhaseByDate_Resume

                    }));
                })
                .catch(error => {
                    this.setState(() => ({ loadingReport: false }));
                });
        })
    }


    createDocumentsPDF = () => {
        var random = uuidv4();

        this.setState(() => ({ downloading: true }),
            () => {
                this.props.client
                    .query({
                        query: CREATE_DOCUMENTS_PDF_QUERY,
                        variables: {
                            contentHTML: document.getElementById('noShowReportPDF').innerHTML,
                            Name: "noShowReport-" + random
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

    downloadDocumentsHandler = (random) => {
        var url = this.context.baseUrl + '/public/Documents/' + "noShowReport-" + random + '.pdf';
        window.open(url, '_blank');
        this.setState({ downloading: false });
    };

    sleep() {
        return new Promise((resolve) => setTimeout(resolve, 8000));
    }

    componentWillMount() {
        this.getReportInformation();
    }

    render() {
        let { tableData, loadingReport, downloading } = this.state;

        return <React.Fragment>
            {loadingReport && <LinearProgress />}

            <div className="row">
                <button className="btn btn-success ml-auto" disabled={downloading || loadingReport} onClick={this.createDocumentsPDF}>
                    {!downloading && <React.Fragment>Download < i className="fas fa-download" /></React.Fragment>}
                    {downloading && <React.Fragment>Downloading < i className="fas fa-spinner fa-spin" /></React.Fragment>}
                </button>
            </div>

            <div id="noShowReportPDF" className="row p-0">
                <div className="col-md-12 p-0">
                    <div className="card">
                        <Header header={{ recruiter: this.props.recruiter, ...this.state.header }} handleOpenSnackbar={this.props.handleOpenSnackbar} />
                        <Table data={tableData} />
                    </div>
                </div>

            </div>

        </React.Fragment>
    }

    static contextTypes = {
        baseUrl: PropTypes.string
    };
}

NoShowReport.propTypes = {
    recruiter: PropTypes.object.isRequired,
    handleOpenSnackbar: PropTypes.func.isRequired
};

export default withApollo(NoShowReport);
import React, { Component } from 'react';
import Stepper from '@material-ui/core/Stepper';
import StepLabel from '@material-ui/core/StepLabel';
import { withStyles } from '@material-ui/core/styles';
import BackgroundCheck from "../BackgroundCkeck/BackgroundCheck";
import NonDisclosure from "../NonDisclosure/NonDisclosure";
import ConductCode from "../ConductCode/ConductCode";
import AntiHarassment from "../AntiHarassment/AntiHarassment";
import WorkerCompensation from "../WorkerCompensation/WorkerCompensation";
import ApplicantDocument from "../ApplicantDocuments/ApplicantDocument";
import AntiDiscrimination from '../AntiDiscrimination/'
import FormI9 from '../I9/FormsI9';
import FormW4 from "../W4/FormsW4";
import Benefits from '../Benefits';
import { GET_APPLICATION_STATUS, GET_MERGED_DOCUMENT } from './Queries';
import { withApollo } from 'react-apollo';
import withGlobalContent from '../../../Generic/Global';
import NonRetaliation from '../NonRetaliation';
import { generateDocuments } from './GenerateDocuments';
import HistoricalNHP from '../HistoricalNHP';

const steps = {
    0: "W4",
    1: "I9",
    2: "Background Check",
    3: "Anti Harassment",
    4: "Anti Discrimination",
    5: "Non-Disclousure",
    6: "Non Retaliation",
    7: "Code of Conduct",
    8: "Benefit election form",
    9: "Worker's Compensation",
    10: "General Documents",
    11: "Historical NHP"
};

const styles = theme => ({
    root: {
        width: '100%',
        display: 'flex'
    },
    stepper: {
        color: '#41afd7'
    }
});

class Documents extends Component {

    constructor(props) {
        super(props);
        this.state = {
            steps: steps,
            activeStep: 0,
            applicationStatus: {},
            applicationId: this.props.applicationId,
            downloading: false,
            summaryHtml: ''
        };
    }

    setActiveStep = (index) => {
        this.setState(_ => {
            return { activeStep: index }
        });
    }

    getDocumentScreen = (step) => {

        let stepScreen = '';
        let applicationId = this.state.applicationId;

        switch (step) {
            case 0:
                stepScreen = <FormW4 applicationId={applicationId} changeTabState={this.changeTabState} />
                break;
            case 1:
                stepScreen = <FormI9 applicationId={applicationId} changeTabState={this.changeTabState} />;
                break;
            case 2:
                stepScreen = <BackgroundCheck applicationId={applicationId} changeTabState={this.changeTabState} />
                break;
            case 3:
                stepScreen = <AntiHarassment applicationId={applicationId} changeTabState={this.changeTabState} />
                break;
            case 4:
                stepScreen = <AntiDiscrimination applicationId={applicationId} changeTabState={this.changeTabState} />
                break;
            case 5:
                stepScreen = <NonDisclosure applicationId={applicationId} changeTabState={this.changeTabState} />
                break;
            case 6:
                stepScreen = <NonRetaliation applicationId={applicationId} changeTabState={this.changeTabState} />
                break;
            case 7:
                stepScreen = <ConductCode applicationId={applicationId} changeTabState={this.changeTabState} />
                break;
            case 8: 
                stepScreen = <Benefits applicationId={applicationId} changeTabState={this.changeTabState} />
                break;
            case 9:
                stepScreen = <WorkerCompensation applicationId={applicationId} changeTabState={this.changeTabState} />
                break;
            case 10:
                stepScreen = <ApplicantDocument applicationId={applicationId} changeTabState={this.changeTabState} />
                break;
            case 11:
                stepScreen = <HistoricalNHP applicationId={applicationId} />
                break;
        }

        return stepScreen;
    }

    getApplicantStatus = () => {
        if (!this.state.applicationId)
            return;

        this.props.client.query({
            query: GET_APPLICATION_STATUS,
            fetchPolicy: 'no-cache',
            variables: {
                id: this.state.applicationId
            }
        }).then(({ data }) => {
            this.setState(_ => {
                return { applicationStatus: data.applicationCompletedData }
            });
        }).catch(error => {
            console.log(error)
        });
    }

    setSummaryHtml = (summaryHtml) => {
        this.setState({ summaryHtml });
    }

    componentWillMount() {
        this.getApplicantStatus();
        generateDocuments(this.props.client, this.props.applicationId, this.setSummaryHtml);
    }

    // componentWillUpdate() {
    //     this.props.getApplicantStatus();
    // }

    getDocumentStatus = (index) => {

        let isCompleted = false;

        switch (index) {
            case 0:
                isCompleted = this.state.applicationStatus.W4;
                break;
            case 1:
                isCompleted = this.state.applicationStatus.I9;
                break;
            case 2:
                isCompleted = this.state.applicationStatus.BackgroundCheck;
                break;
            case 3:
                isCompleted = this.state.applicationStatus.HarassmentPolicy;
                break;
            case 4:
                isCompleted = this.state.applicationStatus.AntiDiscrimination;
                break;
            case 5:
                isCompleted = this.state.applicationStatus.Disclosure;
                break;
            case 6:
                isCompleted = this.state.applicationStatus.NonRelation;
                break;
            case 7:
                isCompleted = this.state.applicationStatus.ConductCode;
                break;
            case 8:
                isCompleted = this.state.applicationStatus.BenefitElection;
                break;
            case 9:
                isCompleted = this.state.applicationStatus.WorkerCompensation;
                break;
            case 10:
                isCompleted = true; // General Documents
                break;
            case 11:
                isCompleted = true; // NHP History
                break;
        }

        return isCompleted;
    }

    changeTabState = () => {
        this.getApplicantStatus(); // local
        this.props.getApplicantStatus(); // general
    }

    handleMergeDocumentClick = () => {
        let { downloading } = this.state;
        if (!downloading) {
            this.setState({
                downloading: true
            }, () => {
                this.props.client.query({
                    query: GET_MERGED_DOCUMENT,
                    fetchPolicy: 'no-cache',
                    variables: {
                        applicationId: this.state.applicationId,
                        summaryHtml: this.state.summaryHtml
                    }
                }).then(({ data }) => {
                    if (data.pdfMergeQuery)
                        window.open(data.pdfMergeQuery, '_blank');
                    else
                        this.props.handleOpenSnackbar(
                            'error',
                            'Error to merge documents!',
                            'bottom',
                            'center'
                        );
                    this.setState({ downloading: false });
                }).catch(error => {
                    console.log(error);
                    this.setState({ downloading: false });
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to merge documents!',
                        'bottom',
                        'center'
                    );
                });
            })
        }
    }

    render() {
        const { activeStep, steps, downloading } = this.state;
        const { classes } = this.props;
        return (
            <React.Fragment>
                <div className="row">
                    <div className="col-md-2">
                        <div className="Stepper-wrapper">
                            <div className="applicant-card__header header-profile-menu">
                                <button className="applicant-card__edit-button" onClick={this.handleMergeDocumentClick}>
                                    Download NHP &nbsp;
                                    {downloading ? <i class="fas fa-spinner fa-spin" /> : <i className="fas fa-download" />}
                                </button>
                            </div>
                            <Stepper activeStep={activeStep} orientation="vertical">
                                {
                                    Object.keys(steps).map((key, index) => {
                                        return (
                                            <div
                                                key={index}
                                                onClick={() => this.setActiveStep(index)}
                                                className={activeStep === index ? 'MenuStep-item selected' : 'MenuStep-item'}
                                            >
                                                <StepLabel className={[classes.stepper, `stepper-label Tab-fa-icon Tab-fa-circle ${!this.getDocumentStatus(index) ? 'incomplete' : 'completed'}`]}>
                                                    {steps[key]}
                                                </StepLabel>
                                            </div>
                                        );
                                    })
                                }
                            </Stepper>
                        </div>
                    </div>
                    <div className="col-md-10">
                        {this.getDocumentScreen(activeStep)}
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

export default withApollo(withGlobalContent(withStyles(styles)(Documents)));
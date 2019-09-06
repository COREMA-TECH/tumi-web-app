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
import FormI9 from '../I9/FormsI9';
import FormW4 from "../W4/FormsW4";
import { GET_APPLICATION_STATUS, GET_MERGED_DOCUMENT } from './Queries';
import { withApollo } from 'react-apollo';
import withGlobalContent from '../../../Generic/Global';

const steps = {
    0: "Background Check",
    1: "Non-Disclousure",
    2: "Code of Conduct",
    3: "Anti Harassment",
    4: "Worker's Compensation",
    5: "I9",
    6: "W4",
    7: "General Documents"
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
            downloading: false
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

        switch(step) {
            case 0:
                stepScreen = <BackgroundCheck applicationId={applicationId} changeTabState={this.changeTabState} />
                break;
            case 1:
                stepScreen = <NonDisclosure applicationId={applicationId} changeTabState={this.changeTabState} />
                break;
            case 2: 
                stepScreen = <ConductCode applicationId={applicationId} changeTabState={this.changeTabState} />
                break;
            case 3: 
                stepScreen = <AntiHarassment applicationId={applicationId} changeTabState={this.changeTabState} />
                break;
            case 4:
                stepScreen = <WorkerCompensation applicationId={applicationId} changeTabState={this.changeTabState} />
                break;
            case 5: 
                stepScreen = <FormI9 applicationId={applicationId} changeTabState={this.changeTabState} />;
                break;
            case 6:
                stepScreen = <FormW4 applicationId={applicationId} changeTabState={this.changeTabState} />
                break;
            case 7: 
                stepScreen = <ApplicantDocument applicationId={applicationId} changeTabState={this.changeTabState} />
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

    componentWillMount() {
        this.getApplicantStatus();
    }

    getDocumentStatus = (index) => {

        let isCompleted = false;

        switch(index) {
            case 0:
                isCompleted = this.state.applicationStatus.ApplicantBackgroundCheck;
                break;
            case 1:
                isCompleted = this.state.applicationStatus.ApplicantDisclosure;
                break;
            case 2: 
                isCompleted = this.state.applicationStatus.ApplicantConductCode;
                break;
            case 3: 
                isCompleted = this.state.applicationStatus.ApplicantHarassmentPolicy;
                break;
            case 4:
                isCompleted = this.state.applicationStatus.ApplicantWorkerCompensation;
                break;
            case 5: 
                isCompleted = this.state.applicationStatus.ApplicantW4;
                break;
            case 6:
                isCompleted = this.state.applicationStatus.ApplicantI9;
                break;
            case 7:
                isCompleted = true;
                break;
        }

        return isCompleted;
    }

    changeTabState = () => {
        this.getApplicantStatus();
    }

    handleMergeDocumentClick = () => {
        let {downloading} = this.state;
        if(!downloading){
            this.setState({
                downloading: true
            }, () => {
                this.props.client.query({
                    query: GET_MERGED_DOCUMENT,
                    fetchPolicy: 'no-cache',
                    variables: {
                        applicationId: this.state.applicationId
                    }
                }).then(({ data }) => {
                    if(data.pdfMergeQuery)
                        window.open(data.pdfMergeQuery, '_blank');
                    else
                        this.props.handleOpenSnackbar(
                            'error',
                            'Error to merge documents!',
                            'bottom',
                            'center'
                        );
                    this.setState({downloading: false});
                }).catch(error => {
                    console.log(error);
                    this.setState({downloading: false});
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
                            <Stepper activeStep={activeStep} orientation="vertical" className="stepper-menu">
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
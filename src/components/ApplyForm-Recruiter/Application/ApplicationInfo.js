import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './index.css';
import './stepper.css';
import '../index.css';
import withApollo from "react-apollo/withApollo";
import Application from "./Application"; 
import Language from "./Languages/Language";
import PreviousEmployment from "./PreviousEmployment/PreviousEmployment";
import Skills from "./skills/Skills";


const menuSpanish = require(`./languagesJSON/${localStorage.getItem('languageForm')}/menuSpanish`);

const styles = theme => ({
    root: {
        width: '100%',
        display: 'flex'
    },
    button: {
        marginTop: 0,
        marginRight: 0,
        backgroundColor: '#41afd7',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#3d93b9'
        }

    },
    actionsContainer: {
        marginBottom: 0,
    },
    resetContainer: {
        padding: 0,
    },
    stepper: {
        color: '#41afd7'
    }
});

function getSteps() {
    let steps = menuSpanish.map(item => {
        return item.label
    });

    return steps;
}

class VerticalLinearStepper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeStep: 0,
            applicationId: null
        }
    }

    // To handle the stepper
    handleNext = () => {
        this.setState(state => ({
            activeStep: state.activeStep + 1,
        }));
    };
    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };
    handleReset = () => {
        this.setState({
            activeStep: 0,
        });
    };


    componentWillMount() {
        // Get id of the application and pass to the components
        try {
            if (this.props.location.state.ApplicationId === undefined)
                window.location.href = "/home/application";

            this.setState({
                applicationId: this.props.location.state.ApplicationId
            });

            localStorage.setItem('languageForm', 'en');
        } catch (error) {
            window.location.href = "/home/application";
        }
    }

    render() {
        const {classes} = this.props;
        const steps = getSteps();
        const {activeStep} = this.state;

        if (this.state.applicationId == 0) {
            this.state.applicationId = localStorage.getItem('idApplication');
        }

        let getStepContent = (step) => {
            switch (step) {
                case 0:
                    return <Application applicationId={this.state.applicationId} handleNext={this.handleNext}/>;
                case 1:
                    return <Language applicationId={this.state.applicationId} handleNext={this.handleNext}
                                     handleBack={this.handleBack}/>;
                case 2:
                    return <PreviousEmployment applicationId={this.state.applicationId} handleNext={this.handleNext}
                                               handleBack={this.handleBack}/>;
                case 3:
                    return <Skills applicationId={this.state.applicationId} handleNext={this.handleNext}
                                   handleBack={this.handleBack}/>;
                default:
                    return 'Unknown step';
            }
        };

        return (
            <div className="main-stepper-container">
                <div className="row">
                    <div className="col-md-12 pl-3 mb-2">
                        <button
                            className="btn btn-success btn-sm"
                            onClick={() => {
                                this.props.history.push({
                                    pathname: '/home/board/recruiter',
                                    state: {ApplicationId: 0}
                                });
                            }}>
                            <i className="fas fa-chevron-left"/> Go To Board
                        </button>
                    </div>
                    <div className="col-md-4 col-lg-2">
                        <div className="Stepper-wrapper">
                            <div className="applicant-card__header">
                                <h2 className="applicant-card__title">Steps</h2>
                            </div>
                            <Stepper activeStep={activeStep} orientation="vertical" className="">
                                {steps.map((label, index) => {
                                    if (this.state.applicationId == 0) {
                                        this.state.activeStep = 0;
                                    }
                                    return (
                                        <div
                                            key={label}
                                            onClick={() => {
                                                this.setState({activeStep: index})
                                            }}
                                            className={this.state.activeStep === index ? 'MenuStep-item selected' : 'MenuStep-item '}
                                        >
                                            <StepLabel className={[classes.stepper, 'stepper-label']}>
                                                {label}
                                            </StepLabel>
                                        </div>
                                    );
                                })}
                            </Stepper>
                            {activeStep === steps.length && (
                                <Paper square elevation={0} className={classes.resetContainer}>
                                    <Typography>All steps completed - you&quot;re finished</Typography>
                                    <Button onClick={this.handleReset} className={classes.button}>
                                        Reset
                                    </Button>
                                </Paper>
                            )}
                        </div>
                    </div>
                    <div className="col-md-8 col-lg-10">
                        <div className="StepperForm-wrapper">
                            <Typography className="">
                                {getStepContent(this.state.activeStep)}
                            </Typography>
                        </div>
                    </div>
                </div>


            </div>
        );
    }
}

VerticalLinearStepper.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(withApollo(VerticalLinearStepper));
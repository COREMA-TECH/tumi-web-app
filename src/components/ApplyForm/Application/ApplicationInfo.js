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

const uuidv4 = require('uuid/v4');

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
    return ['General Information', 'Languages', 'Education', 'Previous Employment', 'Military Service', 'Skills', 'Disclaimer'];
}

class VerticalLinearStepper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeStep: 0
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
    }

    render() {
        const {classes} = this.props;
        const steps = getSteps();
        const {activeStep} = this.state;

        let getStepContent = (step) => {
            switch (step) {
                case 0:
                    return <Application applicationId={70}/>;
                case 1:
                    return <Language />;
                case 2:
                    return 'Step 2';
                case 3:
                    return 'Step 3';
                default:
                    return 'Unknown step';
            }
        };

        return (
            <div className="main-stepper-container">
                <header className="Header">Applicant Information</header>
                <Stepper activeStep={activeStep} orientation="vertical" className="main-stepper-nav">
                    {steps.map((label, index) => {
                        return (
                            <div
                                key={label}
                                onClick={() => {
                                    this.setState({activeStep: index})
                                }}
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

                <Typography className="main-stepper-content">
                    {getStepContent(this.state.activeStep)}
                </Typography>
            </div>
        );
    }
}

VerticalLinearStepper.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(withApollo(VerticalLinearStepper));
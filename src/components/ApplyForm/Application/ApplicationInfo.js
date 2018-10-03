import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepContent from '@material-ui/core/StepContent';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './index.css';
import '../index.css';
import withApollo from "react-apollo/withApollo";
import Application from "./Application";

const uuidv4 = require('uuid/v4');

const styles = theme => ({
    root: {
        width: '100%',
        display: 'flex'
    },
    button: {
        marginTop: 0,
        marginRight: theme.spacing.unit,
        backgroundColor: '#41afd7',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#3d93b9'
        }

    },
    actionsContainer: {
        marginBottom: theme.spacing.unit * 2,
    },
    resetContainer: {
        padding: theme.spacing.unit * 3,
    },
    stepper: {
        color: '#41afd7'
    }
});

function getSteps() {
    return ['Applicant Information', 'Languages', 'Education', 'Previous Employment', 'Military Service', 'Skills', 'Disclaimer'];
}

class VerticalLinearStepper extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        const {classes} = this.props;
        const steps = getSteps();
        const {activeStep} = this.state;


        let getStepContent = (step) => {
            switch (step) {
                case 0:
                    return <Application/>;
                default:
                    return 'Unknown step';
            }
        };

        return (
            <div className="main-stepper-container">
                <header className="Header">Application Form</header>
                <Stepper activeStep={activeStep} orientation="vertical" className="main-stepper-nav">
                    {steps.map((label, index) => {
                        return (
                            <Step key={label}>
                                <StepLabel className={classes.stepper}>
                                    {label}
                                </StepLabel>
                                <StepContent>
                                    <Typography variant="caption">{index === 0 ? 'Required' : 'Optional'}</Typography>
                                </StepContent>
                            </Step>
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
import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import FullWidthTabs from "../FullWidthTabs/FullWidthTabs";
import {Redirect} from "react-router-dom";

const styles = theme => ({
    root: {
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '1px 2px 15px #ddd'
    },
    backButton: {
        marginRight: theme.spacing.unit,
    },
    instructions: {
        marginTop: theme.spacing.unit,
        marginBottom: theme.spacing.unit,
    },
    bottomDivider: {
        borderTop: '1px solid #eee',
        width: '100%',
        marginBottom: '20px',
        marginTop: '50px',
        display: 'flex',
        justifyContent: 'center'
    }
});

function getSteps() {
    return ['General Information', 'Contacts', 'Departments', 'Positions and Rates'];
}

function getStepContent(stepIndex) {
    switch (stepIndex) {
        case 0:
            return 'General Information';
        case 1:
            return 'Contacts';
        case 2:
            return 'Departments';
        case 3:
            return 'Positions and Rates';
        default:
            return 'Uknown stepIndex';
    }
}

class HorizontalLabelPositionBelowStepper extends React.Component {
    state = {
        activeStep: 0,
    };

    handleNext = () => {
        const {activeStep} = this.state;
        this.setState({
            activeStep: activeStep + 1,
        });
    };

    handleBack = () => {
        const {activeStep} = this.state;
        this.setState({
            activeStep: activeStep - 1,
        });
    };

    handleReset = () => {
        this.setState({
            activeStep: 2,
        });
    };

    render() {
        const {classes} = this.props;
        const steps = getSteps();
        const {activeStep} = this.state;

        return (
            <div
                className={classes.root}
                style={
                    {borderRadius: '5px',}
                }
            >
                <Stepper activeStep={activeStep} alternativeLabel>
                    {steps.map(label => {
                        return (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        );
                    })}
                </Stepper>

                <FullWidthTabs item={this.state.activeStep} />

                <div style={{padding: 15}} className={classes.bottomDivider}>
                    {this.state.activeStep === steps.length ? (
                        <div>
                            <Redirect
                                to={{
                                    pathname: "/company"
                                }}
                            />
                        </div>
                    ) : (
                        <div>
                            <div>
                                <Button
                                    disabled={activeStep === 0}
                                    onClick={this.handleBack}
                                    className={classes.backButton}
                                >
                                    Back
                                </Button>
                                <Button variant="contained" color="primary" onClick={this.handleNext}>
                                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

HorizontalLabelPositionBelowStepper.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(HorizontalLabelPositionBelowStepper);
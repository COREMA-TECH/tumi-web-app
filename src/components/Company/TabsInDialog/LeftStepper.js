import React, {Component, Fragment} from 'react';
import ImageUpload from 'ui-components/ImageUpload/ImageUpload';
import Stepper from '@material-ui/core/Stepper';
import StepLabel from '@material-ui/core/StepLabel';

const STEPS = [
    'General',
    'Employees',
    'Schedules',
    'Punches'
];

class LeftStepper extends Component {
    
    render() {
        const { classes, activeStep } = this.props;
        return <div className="card">
            <div className="">
                <div className="row">
                    <div className="col-md-12">
                        <div className="GeneralInformation-wrapper">
                            <ImageUpload
                                id="avatarFilePI"
                                updateAvatar={this.props.handleUpdateAvatar}
                                fileURL={this.props.avatar}
                                disabled={false}
                                handleOpenSnackbar={this.props.handleOpenSnackbar}
                            />
                        </div>
                    </div>

                    <div className="col-md-12">
                        <Stepper activeStep={activeStep} orientation="vertical" className="">
                            {STEPS.map((label, index) => {
                                return (
                                    <div
                                        key={label}
                                        onClick={() => this.props.handleChangeStepper(index)}
                                        className={this.props.activeStep === index ? 'MenuStep-item selected' : 'MenuStep-item'}
                                    >
                                        <StepLabel className={[classes.stepper, 'stepper-label']} >
                                            {label}
                                        </StepLabel>
                                    </div>
                                );
                            })}
                        </Stepper>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default LeftStepper;
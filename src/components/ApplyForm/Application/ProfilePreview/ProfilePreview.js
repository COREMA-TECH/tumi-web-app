import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './preview-profile.css';
import '../index.css';
import '../stepper.css';
import '../../index.css';
import withApollo from "react-apollo/withApollo";
import General from "./General";
import Shifts from '../../../Schedules/Shifts';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import DirectDeposit from "../../../DirectDeposit";

import { GET_APPLICATION_PROFILE_INFO, GET_ACTIVE_EMPLOYEES_BY_MARKS } from "./Queries";
import { UDPATE_PROFILE_PICTURE } from './Mutations';

import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import { ProfilePicture } from 'ui-components/ProfilePicture/'
import GenericContent from 'Generic/Global'
const menuSpanish = require(`../languagesJSON/${localStorage.getItem('languageForm')}/profileMenu`);

const styles = theme => ({
    tabs: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
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
        if (item.id !== 7) {
            return item.label
        }
    });

    return steps;
}

class VerticalLinearStepper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeStep: 0,
            applicationId: null,
            loading: false,
            data: [],
            openModal: false,
            value: 0,
            username: '',
            Urlphoto: '',
            employee: null
        }
    }

    handleChange = (event, value) => {
        this.setState({ activeStep: value });
    };

    // To handle the stepper
    handleNext = () => {
        this.setState(state => ({
            activeStep: state.activeStep + 1,
        }));
    };

    /**
     * Go back in stepper
     */
    handleBack = () => {
        this.setState(state => ({
            activeStep: state.activeStep - 1,
        }));
    };

    /**
     * To reset the stepper
     */
    handleReset = () => {
        this.setState({
            activeStep: 0,
        });
    };

    /**
     * To fetch profile user information
     **/
    getProfileInformation = () => {
        this.props.client
            .query({
                query: GET_APPLICATION_PROFILE_INFO,
                variables: {
                    id: this.props.applicationId
                }
            })
            .then(({ data }) => {
                let application = data.applications[0];
                this.setState({
                    username: application.firstName + ' ' + application.lastName,
                    Urlphoto: application.Urlphoto,
                    employee: application.employee
                }, () => {

                    if (this.state.employee)
                        this.checkUserActiveByMarks();
                    else
                        this.setState({
                            activeEmployee: null
                        });

                    this.setState({
                        loading: false
                    });
                });
            })
            .catch(error => {
                this.setState({
                    loading: false,
                    error: true
                })
            })
    };


    updateImage = (url) => {
        this.props.client
            .mutate({
                mutation: UDPATE_PROFILE_PICTURE,
                variables: {
                    id: this.props.applicationId,
                    url: url
                }
            })
            .then(({ data }) => {
                this.props.handleOpenSnackbar('success', 'Profile picture updated!', 'bottom', 'right');
            })
            .catch(error => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error updating profile picture. Please, try again!',
                    'bottom',
                    'right'
                );
            })
    };

    checkUserActiveByMarks = () => {
        this.props.client.query({
            query: GET_ACTIVE_EMPLOYEES_BY_MARKS,
            variables: {
                id: this.state.employee.Employees.id
            }
        }).then(({ data }) => {
            this.setState({
                activeEmployee: data.activeEmployeesByMarks[0]
            }, () => {
                this.setState({
                    loading: false
                })
            });
        }).catch(error => {
            this.setState({
                loading: false,
                error: true
            })
        })
    }

    componentWillMount() {
        // Get id of the application and pass to the components

        try {
            this.setState({
                applicationId: this.props.applicationId
            }, () => {
                this.setState({
                    loading: true
                }, () => {
                    this.getProfileInformation();
                })
            });

            localStorage.setItem('languageForm', 'en');
        } catch (error) {
            window.location.href = "/home/application";
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.applicationId != this.props.applicationId) {
            this.setState({
                applicationId: nextProps.applicationId
            });
        }
    }

    render() {
        const { classes } = this.props;
        const { value } = this.state;
        const steps = getSteps();
        const { activeStep } = this.state;

        let idEntity = null, Id_Department = null, EmployeeId = -1;



        if (this.state.employee)
            idEntity = this.state.employee.Employees.idEntity, Id_Department = this.state.employee.Employees.Id_Department, EmployeeId = this.state.employee.Employees.id;

        let getStepContent = (step) => {
            switch (step) {
                case 0:
                    return <General applicationId={this.props.applicationId} activeUser={this.state.activeEmployee ? true : false} hasEmployee={this.state.employee || null} />;
                case 1:
                    return <div className="card mt-0">
                        <Shifts
                            saveTemplateShift={() => { }}
                            openEditConfirm={() => { }}
                            handleOpenSnackbar={this.props.handleOpenSnackbar}
                            location={idEntity}
                            deparment={Id_Department}
                            selectedEmployee={EmployeeId}
                        />
                    </div>
                case 6:
                    return <DirectDeposit applicationId={this.props.applicationId} />
            }
        };

        if (this.state.loading) {
            return <LinearProgress />
        }

        return (
            <div className="main-stepper-container profile-preview-component">
                <div className="row">
                    <div className="col-md-4 col-lg-2">
                        <div className="Stepper-wrapper">
                            <div className="applicant-card__header header-profile-menu">
                                <ProfilePicture handleOpenSnackbar={this.props.handleOpenSnackbar} updateImage={this.updateImage} url={this.state.Urlphoto} />
                                <div className="profile-header-info">
                                    <div className="username">{this.state.username}</div>
                                    {/*<div className="username-number-code">{this.props.id}</div>*/}
                                </div>
                            </div>
                            <div className={"tabs"}>
                                <AppBar position="static" color="#0092BD">
                                    <Tabs
                                        value={value}
                                        onChange={this.handleChange}
                                        indicatorColor="#000000"
                                        textColor="primary"
                                        scrollable
                                        scrollButtons="auto"
                                    >
                                        {steps.map((label, index) => {
                                            return (
                                                <Tab label={label} key={index} classes={{ root: "ProfileTab-item", selected: "selected" }} />
                                            );
                                        })}
                                    </Tabs>
                                </AppBar>
                            </div>
                            <Stepper activeStep={activeStep} orientation="vertical" className="stepper-menu">
                                {steps.map((label, index) => {
                                    return (
                                        <div
                                            key={label}
                                            onClick={() => {
                                                this.setState({ activeStep: index })
                                            }}
                                            className={this.state.activeStep === index ? 'MenuStep-item selected' : 'MenuStep-item'}
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
    classes: PropTypes.object
};

export default withStyles(styles)(withApollo(GenericContent(VerticalLinearStepper)));
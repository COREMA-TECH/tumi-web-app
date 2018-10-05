import React, {Component} from 'react';
import {
    ADD_APLICANT_PREVIOUS_EMPLOYMENT,
    REMOVE_APPLICANT_LANGUAGE,
    REMOVE_APPLICANT_PREVIOUS_EMPLOYMENT
} from "../../Mutations";
import Button from "@material-ui/core/Button/Button";
import InputMask from "react-input-mask";
import withApollo from "react-apollo/withApollo";
import {GET_APPLICATION_PREVIOUS_EMPLOYMENT_BY_ID} from "../../Queries";
import CircularProgressLoading from "../../../material-ui/CircularProgressLoading";
import withGlobalContent from "../../../Generic/Global";

const uuidv4 = require('uuid/v4');

class PreviousEmployment extends Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            applicationId: null,
            previousEmployment: [],
            newPreviousEmployment: [],
            loading: false
        }
    }

    insertPreviousEmploymentApplication = () => {
        if (this.state.previousEmployment.length > 0) {
            // to remove all the uuid properties in the object
            this.state.previousEmployment.forEach((item) => {
                delete item.uuid;
            });

            this.state.previousEmployment.forEach((item) => {
                item.ApplicationId = this.state.applicationId;
            });

            this.setState((prevState) => ({
                newPreviousEmployment: this.state.previousEmployment.filter((_, i) => {
                    console.log(_.id);
                    return _.id === undefined;
                })
            }), () => {
                // Then insert previous employment
                this.props.client
                    .mutate({
                        mutation: ADD_APLICANT_PREVIOUS_EMPLOYMENT,
                        variables: {
                            application: this.state.newPreviousEmployment
                        }
                    })
                    .then(() => {
                        this.setState({
                            editing: false,
                            newPreviousEmployment: []
                        });

                        this.props.handleOpenSnackbar(
                            'success',
                            'Successfully created',
                            'bottom',
                            'right'
                        );

                        this.getPreviousEmploymentList(this.state.applicationId);
                    })
                    .catch((error) => {
                        // Replace this alert with a Snackbar message error
                        alert('Error');
                    });
            });
        } else {
            this.handleNext();
        }
    };

    // To get a list of previous employments saved from API
    getPreviousEmploymentList = (id) => {
        this.setState({
            loading: true
        }, () => {
            this.props.client
                .query({
                    query: GET_APPLICATION_PREVIOUS_EMPLOYMENT_BY_ID,
                    variables: {
                        id: id
                    },
                    fetchPolicy: 'no-cache'
                })
                .then(({data}) => {
                    this.setState({
                        previousEmployment: data.applications[0].employments,
                        loading: false
                    });
                })
                .catch(error => {
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to show previous employment. Please, try again!',
                        'bottom',
                        'right'
                    );
                });
        });
    };

    removePreviousEmploymentById = (id) => {
        this.props.client
            .mutate({
                mutation: REMOVE_APPLICANT_PREVIOUS_EMPLOYMENT,
                variables: {
                    id: id
                }
            })
            .then(({data}) => {
                this.props.handleOpenSnackbar(
                    'success',
                    'Successfully removed',
                    'bottom',
                    'right'
                );
                this.getPreviousEmploymentList(this.state.applicationId);
            })
            .catch(error => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to remove previous employment. Please, try again!',
                    'bottom',
                    'right'
                );
            });
    };

    componentWillMount() {
        this.setState({
            applicationId: this.props.applicationId
        }, () => {
            this.getPreviousEmploymentList(this.state.applicationId);
        });
    }

    render() {
        // To render the Previous Employment Section
        let renderPreviousEmploymentSection = () => (
            <form
                id="form-previous-employment"
                className=""
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    let item = {
                        uuid: uuidv4(),
                        companyName: document.getElementById('companyNameEmployment').value,
                        phone: document.getElementById('companyPhoneEmployment').value,
                        address: document.getElementById('companyAddressEmployment').value,
                        supervisor: document.getElementById('companySupervisor').value,
                        jobTitle: document.getElementById('companyJobTitle').value,
                        payRate: parseFloat(document.getElementById('companyPayRate').value),
                        startDate: document.getElementById('companyStartDate').value,
                        endDate: document.getElementById('companyEndDate').value,
                        reasonForLeaving: document.getElementById('companyReasonForLeaving').value,
                        ApplicationId: 1 // Static application id
                    };
                    this.setState(
                        (prevState) => ({
                            open: false,
                            previousEmployment: [...prevState.previousEmployment, item]
                        }),
                        () => {
                            document.getElementById('form-previous-employment').reset();
                            document.getElementById('companyNameEmployment').classList.remove('invalid-apply-form');
                            document.getElementById('companyPhoneEmployment').classList.remove('invalid-apply-form');
                            document.getElementById('companyAddressEmployment').classList.remove('invalid-apply-form');
                            document.getElementById('companySupervisor').classList.remove('invalid-apply-form');
                            document.getElementById('companyJobTitle').classList.remove('invalid-apply-form');
                            document.getElementById('companyPayRate').classList.remove('invalid-apply-form');
                            document.getElementById('companyStartDate').classList.remove('invalid-apply-form');
                            document.getElementById('companyEndDate').classList.remove('invalid-apply-form');
                            document.getElementById('companyReasonForLeaving').classList.remove('invalid-apply-form');

                            this.setState({
                                previousEmploymentPhone: ''
                            });
                        }
                    );
                }}
            >
                <div className="row">
                    {this.state.previousEmployment.length > 0 ? (
                        <div key={uuidv4()} className="skills-container skills-container--header">
                            <div className="row">
                                <div className="col-1">
                                    <span>Company</span>
                                </div>
                                <div className="col-2">
                                    <span>Address</span>
                                </div>
                                <div className="col-1">
                                    <span>Job Title</span>
                                </div>
                                <div className="col-1">
                                    <span>Phone</span>
                                </div>
                                <div className="col-1">
                                    <span>Supervisor</span>
                                </div>
                                <div className="col-1">
                                    <span>Pay Rate</span>
                                </div>
                                <div className="col-2">
                                    <span>Start Date</span>
                                </div>
                                <div className="col-2">
                                    <span>End Date</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        ''
                    )}
                    {this.state.previousEmployment.map((employmentItem) => (
                        <div key={uuidv4()} className="skills-container">
                            <div className="row">
                                <div className="col-1">
                                    <span>{employmentItem.companyName}</span>
                                </div>
                                <div className="col-2">
                                    <span>{employmentItem.address}</span>
                                </div>
                                <div className="col-1">
                                    <span>{employmentItem.jobTitle}</span>
                                </div>
                                <div className="col-1">
                                    <span>{employmentItem.phone}</span>
                                </div>
                                <div className="col-1">
                                    <span>{employmentItem.supervisor}</span>
                                </div>
                                <div className="col-1">
                                    <span>{employmentItem.payRate}</span>
                                </div>
                                <div className="col-2">
                                    <span>{employmentItem.startDate.substring(0, 10)}</span>
                                </div>
                                <div className="col-2">
                                    <span>{employmentItem.endDate.substring(0, 10)}</span>
                                </div>
                                <div className="col-1">
                                    <span
                                        className="delete-school-button"
                                        onClick={() => {
                                            this.setState((prevState) => ({
                                                previousEmployment: this.state.previousEmployment.filter((_, i) => {
                                                    return _.uuid !== employmentItem.uuid;
                                                })
                                            }), () => {
                                                if (employmentItem.id !== undefined) {
                                                    this.removePreviousEmploymentById(employmentItem.id)
                                                }
                                            });
                                        }}
                                    >
                                        <i className="fas fa-trash-alt"></i>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                {
                    this.state.editing ? (
                            <div className="row">
                                <div className="col-2"></div>
                                <div className="col-8">
                                    <div className="form-section-1">
                                        <div className="row">
                                            <div className="col-8">
                                                <span className="primary"> Company</span>
                                                <div className="input-container--validated">
                                                    <input
                                                        id="companyNameEmployment"
                                                        form="form-previous-employment"
                                                        name="companyNameEmployment"
                                                        type="text"
                                                        className="form-control"
                                                        required
                                                        min="0"
                                                        maxLength="50"
                                                        minLength="3"
                                                    />
                                                    <span className="check-icon"/>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <span className="primary"> Phone</span>
                                                <div className="input-container--validated">
                                                    <InputMask
                                                        id="companyPhoneEmployment"
                                                        form="form-previous-employment"
                                                        name="phoneEmployment"
                                                        mask="+(999) 999-9999"
                                                        maskChar=" "
                                                        value={this.state.previousEmploymentPhone}
                                                        className="form-control"
                                                        onChange={(event) => {
                                                            this.setState({
                                                                previousEmploymentPhone: event.target.value
                                                            });
                                                        }}
                                                        required
                                                        placeholder="+(999) 999-9999"
                                                        minLength="15"
                                                    />
                                                    {/*<input*/}
                                                    {/*id="companyPhoneEmployment"*/}
                                                    {/*form="form-previous-employment"*/}
                                                    {/*name="phoneEmployment"*/}
                                                    {/*type="number"*/}
                                                    {/*className="form-control"*/}
                                                    {/*required*/}
                                                    {/*min="0"*/}
                                                    {/*maxLength="10"*/}
                                                    {/*minLength="10"*/}
                                                    {/*/>*/}
                                                    <span className="check-icon"/>
                                                </div>
                                            </div>
                                            <div className="col-8">
                                                <span className="primary"> Address</span>
                                                <div className="input-container--validated">
                                                    <input
                                                        id="companyAddressEmployment"
                                                        form="form-previous-employment"
                                                        name="addressEmployment"
                                                        type="text"
                                                        className="form-control"
                                                        required
                                                        min="0"
                                                        maxLength="50"
                                                        minLength="3"
                                                    />
                                                    <span className="check-icon"/>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <span className="primary"> Supervisor</span>
                                                <div className="input-container--validated">
                                                    <input
                                                        id="companySupervisor"
                                                        form="form-previous-employment"
                                                        name="supervisorEmployment"
                                                        type="text"
                                                        className="form-control"
                                                        required
                                                        min="0"
                                                        maxLength="50"
                                                        minLength="3"
                                                    />
                                                    <span className="check-icon"/>
                                                </div>
                                            </div>
                                            <div className="col-8">
                                                <span className="primary"> Job Title</span>
                                                <div className="input-container--validated">
                                                    <input
                                                        id="companyJobTitle"
                                                        form="form-previous-employment"
                                                        name="jobTitleEmployment"
                                                        type="text"
                                                        className="form-control"
                                                        required
                                                        min="0"
                                                        maxLength="50"
                                                        minLength="3"
                                                    />
                                                    <span className="check-icon"/>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <span className="primary"> Pay Rate</span>
                                                <div className="input-container--validated">
                                                    <input
                                                        id="companyPayRate"
                                                        form="form-previous-employment"
                                                        name="payRateEmployment"
                                                        type="number"
                                                        className="form-control"
                                                        required
                                                        min="0"
                                                        maxLength="50"
                                                        minLength="3"
                                                    />
                                                    <span className="check-icon"/>
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <span className="primary"> Dates</span>
                                                <div className="input-container--validated">
                                                    <input
                                                        id="companyStartDate"
                                                        form="form-previous-employment"
                                                        name="startPreviousEmployment"
                                                        type="date"
                                                        className="form-control"
                                                        required
                                                        min="0"
                                                        maxLength="50"
                                                        minLength="3"
                                                    />
                                                    <span className="check-icon"/>
                                                </div>
                                            </div>
                                            <div className="col-3">
                                                <span className="primary">To: </span>
                                                <div className="input-container--validated">
                                                    <input
                                                        id="companyEndDate"
                                                        form="form-previous-employment"
                                                        name="endPreviousEmployment"
                                                        type="date"
                                                        className="form-control"
                                                        required
                                                        min="0"
                                                        maxLength="50"
                                                        minLength="3"
                                                    />
                                                    <span className="check-icon"/>
                                                </div>
                                            </div>
                                            <div className="col-6">
                                                <span className="primary"> Reason for leaving</span>
                                                <textarea
                                                    id="companyReasonForLeaving"
                                                    form="form-previous-employment"
                                                    name="reasonForLeavingEmployment"
                                                    className="form-control textarea-apply-form"
                                                />
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-12">
                                                <Button type="submit" form="form-previous-employment" className="save-skill-button">
                                                    Add
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    ) : ''
                }
            </form>
        );

        return (
            <div className="Apply-container--application">
                <div className="row">
                    <div className="col-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">Previous Employment</span>
                                {
                                    this.state.editing ? (
                                        ''
                                    ) : (
                                        <button className="applicant-card__edit-button" onClick={() => {
                                            this.setState({
                                                editing: true
                                            })
                                        }}>Add <i className="fas fa-plus"/>
                                        </button>
                                    )
                                }
                            </div>
                            <div className="row">
                                {
                                    this.state.loading ? (
                                        <div className="form-section-1 form-section--center">
                                            <CircularProgressLoading/>
                                        </div>
                                    ) : (
                                        renderPreviousEmploymentSection()
                                    )
                                }
                            </div>
                            {
                                this.state.editing ? (
                                    <div className="applicant-card__footer">
                                        <button
                                            className="applicant-card__cancel-button"
                                            onClick={
                                                () => {
                                                    this.setState((prevState) => ({
                                                        previousEmployment: this.state.previousEmployment.filter((_, i) => {
                                                            return _.id !== undefined;
                                                        })
                                                    }), () => {
                                                        this.setState({
                                                            editing: false
                                                        });
                                                    });
                                                }
                                            }
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                this.insertPreviousEmploymentApplication()
                                            }}
                                            className="applicant-card__save-button">
                                            Save
                                        </button>
                                    </div>
                                ) : (
                                    ''
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


export default withApollo(withGlobalContent(PreviousEmployment));
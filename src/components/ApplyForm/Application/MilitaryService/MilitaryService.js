import React, { Component } from 'react';
import { GET_APPLICATION_MILITARY_SERVICES_BY_ID } from "../../Queries";
import withApollo from "react-apollo/withApollo";
import { ADD_MILITARY_SERVICES, UPDATE_MILITARY_SERVICES } from "../../Mutations";
import CircularProgressLoading from "../../../material-ui/CircularProgressLoading";
import withGlobalContent from "../../../Generic/Global";


const spanishActions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);
const menuSpanish = require(`../languagesJSON/${localStorage.getItem('languageForm')}/menuSpanish`);
const militaryServiceLabels = require(`../languagesJSON/${localStorage.getItem('languageForm')}/militaryServices`);

class MilitaryService extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // Editing state properties - To edit general info
            editing: false,
            id: null,
            branch: '',
            startDateMilitaryService: '',
            endDateMilitaryService: '',
            rankAtDischarge: '',
            typeOfDischarge: '',
            militaryServiceLength: 0,
            loading: false,
            saving: false
        }
    }

    componentWillMount() {
        this.setState({
            applicationId: this.props.applicationId
        }, () => {
            this.getMilitaryServiceInfo(this.state.applicationId);
        });
    }

    validateInformation = (mutation = () => { }) => {
        let { branch, startDateMilitaryService, endDateMilitaryService, rankAtDischarge, typeOfDischarge, applicationId } = this.state;
        let formData = {
            branch: branch,
            startDate: startDateMilitaryService || null,
            endDate: endDateMilitaryService || null,
            rankAtDischarge: rankAtDischarge || null,
            typeOfDischarge: parseInt(typeOfDischarge)
        };
        let values = [];
        Object.values(formData).map(value => {
            if (value)
                values.push(value);
        })
        console.log({ formData, values })
        if (values.length == 0)
            this.props.handleOpenSnackbar('warning', 'You need to fill at least one field', 'bottom', 'right');
        else {
            mutation();
        }
    }

    // To insert a object with mnilitary service information
    insertMilitaryServicesApplication = () => {
        this.setState(() => ({ saving: true }));
        this.props.client
            .mutate({
                mutation: ADD_MILITARY_SERVICES,
                variables: {
                    application: [
                        {
                            branch: this.state.branch,
                            startDate: this.state.startDateMilitaryService || null,
                            endDate: this.state.endDateMilitaryService || null,
                            rankAtDischarge: this.state.rankAtDischarge || null,
                            typeOfDischarge: parseInt(this.state.typeOfDischarge),
                            ApplicationId: this.state.applicationId
                        }
                    ]
                }
            })
            .then(() => {
                //TODO: Show a success message
                this.getMilitaryServiceInfo(this.state.applicationId);
                this.props.handleOpenSnackbar(
                    'success',
                    'Successfully created',
                    'bottom',
                    'right'
                );
                this.setState(() => ({ saving: false, editing: false }));
            })
            .catch((error) => {
                // Replace this alert with a Snackbar message error
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to save military service. Please, try again!',
                    'bottom',
                    'right'
                );
                this.setState(() => ({ saving: false }));
            });
    };

    // To insert a object with mnilitary service information
    updateMilitaryServicesApplication = () => {
        this.setState(() => ({ saving: true }));
        this.props.client
            .mutate({
                mutation: UPDATE_MILITARY_SERVICES,
                variables: {
                    application: {
                        id: this.state.id,
                        branch: this.state.branch,
                        startDate: this.state.startDateMilitaryService || null,
                        endDate: this.state.endDateMilitaryService || null,
                        rankAtDischarge: this.state.rankAtDischarge || null,
                        typeOfDischarge: parseInt(this.state.typeOfDischarge),
                        ApplicationId: this.state.applicationId
                    }
                }
            })
            .then(() => {
                this.setState({
                    editing: false,
                    saving: false
                });

                this.props.handleOpenSnackbar(
                    'success',
                    'Successfully updated',
                    'bottom',
                    'right'
                );
                this.getMilitaryServiceInfo(this.state.applicationId);
            })
            .catch((error) => {
                // Replace this alert with a Snackbar message error
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to update military services. Please, try again!',
                    'bottom',
                    'right'
                );
                this.setState(() => ({ saving: false }));
            });
    };

    // To get a list of previous employments saved from API
    getMilitaryServiceInfo = (id) => {
        this.setState({
            loading: true
        }, () => {
            this.props.client
                .query({
                    query: GET_APPLICATION_MILITARY_SERVICES_BY_ID,
                    variables: {
                        id: id
                    },
                    fetchPolicy: 'no-cache'
                })
                .then(({ data }) => {
                    if (data.applications[0].militaryServices.length > 0) {
                        let _ = data.applications[0].militaryServices[0];
                        this.setState({
                            id:_.id,
                            branch:_.branch,
                            startDateMilitaryService:_.startDate?_.startDate.substring(0, 10):'',
                            endDateMilitaryService:_.endDate?_.endDate.substring(0, 10):'',
                            rankAtDischarge:_.rankAtDischarge,
                            typeOfDischarge:_.typeOfDischarge,
                            militaryServiceLength: data.applications[0].militaryServices.length
                        });

                        this.setState({
                            editing: false
                        });
                    } else {
                        this.setState({
                            militaryServiceLength: 0,
                        });

                        this.setState({
                            editing: false
                        });
                    }

                    this.setState({
                        loading: false
                    })
                })
                .catch(error => {
                    this.setState({
                        loading: false
                    });

                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to show military service information. Please, try again!',
                        'bottom',
                        'right'
                    );
                });
        });
    };

    onClickSaveHandler = () => {

        this.validateInformation(() => {
            if (this.state.militaryServiceLength > 0) {
                // If the register exist, just update
                this.updateMilitaryServicesApplication();
            } else {
                this.insertMilitaryServicesApplication();
            }
        })

    }

    render() {
        // To render the Military Service Section
        let renderMilitaryServiceSection = () => (
            <div className="card-body">
                <div className="military-service-form">
                    <div className="row">
                        <div className="col-6">
                            <span className="primary"> {militaryServiceLabels[0].label}</span>
                            <input
                                onChange={(e) => {
                                    this.setState({
                                        branch: e.target.value
                                    });
                                }}
                                value={this.state.branch}
                                name="militaryBranch"
                                type="text"
                                className="form-control"
                                min="0"
                                disabled={!this.state.editing}
                                maxLength="50"
                                minLength="3"
                            />
                            <span className="check-icon" />
                        </div>
                        <div className="col-6">
                            <span className="primary"> {militaryServiceLabels[1].label}</span>
                            <input
                                onChange={(e) => {
                                    this.setState({
                                        rankAtDischarge: e.target.value
                                    });
                                }}
                                value={this.state.rankAtDischarge}
                                name="militaryRankDischarge"
                                type="text"
                                className="form-control"
                                min="0"
                                disabled={!this.state.editing}
                                maxLength="50"
                                minLength="3"
                            />
                            <span className="check-icon" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-3">
                            <span className="primary"> {militaryServiceLabels[2].label}</span>
                            <input
                                onChange={(e) => {
                                    this.setState({
                                        startDateMilitaryService: e.target.value
                                    });
                                }}
                                value={this.state.startDateMilitaryService}
                                name="militaryStartDate"
                                type="date"
                                className="form-control"
                                min="0"
                                disabled={!this.state.editing}
                                maxLength="50"
                                minLength="3"
                            />
                        </div>
                        <div className="col-3">
                            <span className="primary">{militaryServiceLabels[3].label}</span>
                            <input
                                onChange={(e) => {
                                    this.setState({
                                        endDateMilitaryService: e.target.value
                                    });
                                }}
                                value={this.state.endDateMilitaryService}
                                name="militaryEndDate"
                                type="date"
                                className="form-control"
                                min="0"
                                disabled={!this.state.editing}
                                maxLength="50"
                                minLength="3"
                            />
                        </div>
                        <div className="col-6">
                            <span className="primary"> {militaryServiceLabels[4].label}</span>
                            <select
                                onChange={(e) => {
                                    this.setState({
                                        typeOfDischarge: e.target.value
                                    });
                                }}
                                value={this.state.typeOfDischarge}
                                name="dischargeType"
                                id="dischargeType"
                                disabled={!this.state.editing}
                                className="form-control"
                            >
                                <option value="">{spanishActions[5].label}</option>
                                <option value="1">Honorable discharge</option>
                                <option value="2">General discharge</option>
                                <option value="3">Other than honorable (OTH) discharge</option>
                                <option value="4">Bad conduct discharge</option>
                                <option value="5">Dishonorable discharge</option>
                                <option value="6">Entry-level separation.</option>
                            </select>
                            <span className="check-icon" />
                        </div>
                    </div>
                </div>
            </div>
        );

        return (
            <div className="Apply-container--application">
                <div className="">
                    <div className="">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">{menuSpanish[4].label}</span>
                                {
                                    this.state.editing ? (
                                        ''
                                    ) : (

                                            <button className="applicant-card__edit-button" onClick={() => {
                                                this.setState({
                                                    editing: true
                                                })
                                            }}>
                                                {
                                                    this.state.militaryServiceLength === 0 ? (
                                                        <span> {spanishActions[0].label} <i className="fas fa-plus" /></span>
                                                    ) : (
                                                            <span> {spanishActions[1].label} <i className="far fa-edit"></i></span>
                                                        )
                                                }
                                            </button>
                                        )
                                }
                            </div>
                            <div className="">
                                {
                                    this.state.loading ? (
                                        <div className="form-section-1 form-section--center">
                                            <CircularProgressLoading />
                                        </div>
                                    ) : (
                                            renderMilitaryServiceSection()
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
                                                    this.getMilitaryServiceInfo(this.state.applicationId);
                                                }
                                            }
                                        >
                                            {spanishActions[2].label}
                                        </button>
                                        <button
                                            onClick={this.onClickSaveHandler}
                                            className="applicant-card__save-button">
                                            {spanishActions[4].label}
                                            {!this.state.saving && <i className="far fa-save ml-2" />}
                                            {this.state.saving && <i className="fa fa-spinner fa-spin ml-2" />}
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

export default withApollo(withGlobalContent(MilitaryService));
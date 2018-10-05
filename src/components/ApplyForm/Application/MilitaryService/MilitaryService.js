import React, {Component} from 'react';
import {GET_APPLICATION_MILITARY_SERVICES_BY_ID} from "../../Queries";
import withApollo from "react-apollo/withApollo";
import {ADD_MILITARY_SERVICES} from "../../Mutations";
import CircularProgressLoading from "../../../material-ui/CircularProgressLoading";

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
            loading: false
        }
    }

    componentWillMount() {
        this.setState({
            applicationId: this.props.applicationId
        }, () => {
            this.getMilitaryServiceInfo(this.state.applicationId);
        });
    }

    // To insert a object with mnilitary service information
    insertMilitaryServicesApplication = () => {
        // TODO: validate empty fields in this sections
        if (
            this.state.branch ||
            this.state.startDateMilitaryService ||
            this.state.endDateMilitaryService ||
            this.state.rankAtDischarge ||
            this.state.typeOfDischarge
        ) {
            this.props.client
                .mutate({
                    mutation: ADD_MILITARY_SERVICES,
                    variables: {
                        application: [
                            {
                                branch: this.state.branch,
                                startDate: this.state.startDateMilitaryService,
                                endDate: this.state.endDateMilitaryService,
                                rankAtDischarge: this.state.rankAtDischarge,
                                typeOfDischarge: parseInt(this.state.typeOfDischarge),
                                ApplicationId: this.state.applicationId
                            }
                        ]
                    }
                })
                .then(() => {
                    //TODO: Show a success message
                    alert("Created");
                })
                .catch((error) => {
                    // Replace this alert with a Snackbar message error
                    alert('Error');
                });
        }
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
                .then(({data}) => {
                    if (data.applications[0].militaryServices.length > 0) {
                        this.setState({
                            id: data.applications[0].militaryServices[0].id,
                            branch: data.applications[0].militaryServices[0].branch,
                            startDate: data.applications[0].militaryServices[0].startDate,
                            endDate: data.applications[0].militaryServices[0].endDate,
                            rankAtDischarge: data.applications[0].militaryServices[0].rankAtDischarge,
                            typeOfDischarge: data.applications[0].militaryServices[0].typeOfDischarge,
                            militaryServiceLength: data.applications[0].militaryServices.length
                        })
                    } else {
                        this.setState({
                            militaryServiceLength: 0,
                        })
                    }

                    this.setState({
                        loading: false
                    })
                })
                .catch();
        });
    };

    render() {
        // To render the Military Service Section
        let renderMilitaryServiceSection = () => (
            <div>
                {
                    this.state.editing ? (
                        <div>
                            <div className="row">
                                <div className="col-6">
                                    <span className="primary"> Branch</span>
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
                                        maxLength="50"
                                        minLength="3"
                                    />
                                    <span className="check-icon"/>
                                </div>
                                <div className="col-6">
                                    <span className="primary"> Rank at Discharge</span>
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
                                        maxLength="50"
                                        minLength="3"
                                    />
                                    <span className="check-icon"/>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-3">
                                    <span className="primary"> Dates</span>
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
                                        maxLength="50"
                                        minLength="3"
                                    />
                                </div>
                                <div className="col-3">
                                    <span className="primary">To: </span>
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
                                        maxLength="50"
                                        minLength="3"
                                    />
                                </div>
                                <div className="col-6">
                                    <span className="primary"> Type of Discharge</span>
                                    <select
                                        onChange={(e) => {
                                            this.setState({
                                                typeOfDischarge: e.target.value
                                            });
                                        }}
                                        value={this.state.typeOfDischarge}
                                        name="dischargeType"
                                        id="dischargeType"
                                        className="form-control"
                                    >
                                        <option value="">Select an option</option>
                                        <option value="1">Honorable discharge</option>
                                        <option value="2">General discharge</option>
                                        <option value="3">Other than honorable (OTH) discharge</option>
                                        <option value="4">Bad conduct discharge</option>
                                        <option value="5">Dishonorable discharge</option>
                                        <option value="6">Entry-level separation.</option>
                                    </select>
                                    <span className="check-icon"/>
                                </div>
                            </div>
                        </div>
                    ) : ''
                }
            </div>
        );

        return (
            <div className="Apply-container--application">
                <div className="row">
                    <div className="col-12">
                        <div className="applicant-card">
                            <div className="applicant-card__header">
                                <span className="applicant-card__title">Military Service</span>
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
                                                    <span> Edit <i className="far fa-edit"></i></span>
                                                ) : (
                                                    <span> Add <i className="fas fa-plus"/></span>
                                                )
                                            }
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
                                                    this.setState({
                                                        editing: false
                                                    });
                                                }
                                            }
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => {
                                                this.insertMilitaryServicesApplication();
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

export default withApollo(MilitaryService);
import React, {Component} from 'react';
import withApollo from "react-apollo/withApollo";
import studyTypes from "../../data/studyTypes";
import Button from "@material-ui/core/Button/Button";
import {GET_APPLICATION_EDUCATION_BY_ID, GET_APPLICATION_LANGUAGES_BY_ID} from "../../Queries";
import {ADD_APLICANT_EDUCATION} from "../../Mutations";

const uuidv4 = require('uuid/v4');

class Education extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // Editing state properties - To edit general info
            editing: false,
            schools: []
        }
    }

    // To get a list of languages saved from API
    getEducationList = (id) => {
        this.props.client
            .query({
                query: GET_APPLICATION_EDUCATION_BY_ID,
                variables: {
                    id: id
                }
            })
            .then(({data}) => {
                this.setState({
                    schools: data.applications[0].educations
                }, () => {
                    // console.table(this.state.schools);
                    // this.state.schools.map(item => (item.uuid = uuidv4()));
                })
            })
            .catch();
    };

    // To insert education
    insertEducationApplication = () => {
        if (this.state.schools.length > 0) {
            // to remove all the uuid properties in the object
            this.state.schools.forEach((item) => {
                delete item.uuid;
            });

            this.state.schools.forEach((item) => {
                item.ApplicationId = this.state.applicationId;
            });

            this.setState((prevState) => ({
                schools: this.state.schools.filter((_, i) => {
                    return _.id === null;
                })
            }));

            // Then insert education list
            this.props.client
                .mutate({
                    mutation: ADD_APLICANT_EDUCATION,
                    variables: {
                        application: this.state.schools
                    }
                })
                .then(() => {
                    this.setState({
                        editing: false
                    });

                    this.getEducationList();
                })
                .catch((error) => {
                    // Replace this alert with a Snackbar message error
                    alert('Error');
                });
        } else {
            this.handleNext();
        }
    };

    componentWillMount() {
        this.setState({
            applicationId: this.props.applicationId
        }, () => {
            this.getEducationList();
        });
    }

    render() {
        console.table(this.state.schools);

        // To render the Education Service Section
        let renderEducationSection = () => (
            <form
                id="education-form"
                onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    let item = {
                        uuid: uuidv4(),
                        schoolType: document.getElementById('studyType').value,
                        educationName: document.getElementById('institutionName').value,
                        educationAddress: document.getElementById('addressInstitution').value,
                        startDate: document.getElementById('startPeriod').value,
                        endDate: document.getElementById('endPeriod').value,
                        graduated: document.getElementById('graduated').checked,
                        degree: parseInt(document.getElementById('degree').value),
                        ApplicationId: 1 // Static application id
                    };

                    console.log(item);
                    this.setState(
                        (prevState) => ({
                            open: false,
                            schools: [...prevState.schools, item]
                        }),
                        () => {
                            document.getElementById('education-form').reset();
                            document.getElementById('studyType').classList.remove('invalid-apply-form');
                            document.getElementById('institutionName').classList.remove('invalid-apply-form');
                            document.getElementById('addressInstitution').classList.remove('invalid-apply-form');
                            document.getElementById('startPeriod').classList.remove('invalid-apply-form');
                            document.getElementById('endPeriod').classList.remove('invalid-apply-form');
                            document.getElementById('graduated').classList.remove('invalid-apply-form');
                            document.getElementById('graduated').checked = false;
                            document.getElementById('degree').classList.remove('invalid-apply-form');

                            this.setState({
                                graduated: false
                            });
                        }
                    );
                }}
            >
                {this.state.schools.length > 0 ? (
                    <div key={uuidv4()} className="skills-container skills-container--header font-size-table">
                        <div className="row">
                            <div className="col-1">
                                <span>Field of Study</span>
                            </div>
                            <div className="col-2">
                                <span>Institution</span>
                            </div>
                            <div className="col-2">
                                <span>Address</span>
                            </div>
                            <div className="col-2">
                                <span>Start Date</span>
                            </div>
                            <div className="col-2">
                                <span>End Date</span>
                            </div>
                            <div className="col-1">
                                <span>Graduated</span>
                            </div>
                            <div className="col-1">
                                <span>Degree</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    ''
                )}
                {this.state.schools.map((schoolItem) => (
                    <div key={uuidv4()} className="skills-container">
                        <div className="row">
                            <div className="col-1">
                                <span>{schoolItem.schoolType}</span>
                            </div>
                            <div className="col-2">
                                <span>{schoolItem.educationName}</span>
                            </div>
                            <div className="col-2">
                                <span>{schoolItem.educationAddress}</span>
                            </div>
                            <div className="col-2">
                                <span>{schoolItem.startDate.substring(0,10)}</span>
                            </div>
                            <div className="col-2">
                                <span>{schoolItem.endDate.substring(0,10)}</span>
                            </div>
                            <div className="col-1">
                                <span>{schoolItem.graduated ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="col-1">
								<span>
									{studyTypes.map((item) => {
                                        if (item.Id == schoolItem.degree) {
                                            return item.Name + '';
                                        }
                                    })}
								</span>
                            </div>
                            {
                                this.state.editing ? (<div className="col-1">
                                <span
                                    className="delete-school-button"
                                    onClick={() => {
                                        this.setState((prevState) => ({
                                            schools: this.state.schools.filter((_, i) => {
                                                return _.uuid !== schoolItem.uuid;
                                            })
                                        }));
                                    }}
                                >
                                    <i className="fas fa-trash-alt"></i>
                                </span>
                                </div>) : ''
                            }
                        </div>
                    </div>
                ))}
                <br/><br/>
                <div className="col-2"></div>
                {
                    this.state.editing ? (
                        <div className="col-8 form-section-1">
                            <div className="row">
                                <div className="col-3">
                                    <label className="primary">Field of Study</label>
                                    <div className="input-container--validated">
                                        <input
                                            id="studyType"
                                            form="education-form"
                                            name="studyType"
                                            type="text"
                                            className="form-control"
                                            required
                                            min="0"
                                            maxLength="50"
                                            minLength="2"
                                        />
                                        <span className="check-icon"/>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <label className="primary">Name (Institution)</label>
                                    <div className="input-container--validated">
                                        <input
                                            form="education-form"
                                            name="institutionName"
                                            id="institutionName"
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
                                <div className="col-6">
                                    <label className="primary">Address</label>
                                    <div className="input-container--validated">
                                        <input
                                            form="education-form"
                                            name="addressInstitution"
                                            id="addressInstitution"
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
                            </div>
                            <div className="row">
                                <div className="col-3">
                                    <span className="primary"> Time Period</span>
                                    <div className="input-container--validated">
                                        <input
                                            form="education-form"
                                            name="startPeriod"
                                            id="startPeriod"
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
                                    <span className="primary">To</span>
                                    <div className="input-container--validated">
                                        <input
                                            form="education-form"
                                            name="endPeriod"
                                            id="endPeriod"
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
                                <div className="col-2">
                                    <label className="primary">Graduated</label> <br/>
                                    <label className="switch">
                                        <input
                                            onChange={(e) => {
                                                this.setState({
                                                    graduated: document.getElementById('graduated').checked
                                                });
                                            }}
                                            form="education-form"
                                            type="checkbox"
                                            value="graduated"
                                            name="graduated"
                                            id="graduated"
                                        />
                                        <p className="slider round"/>
                                    </label>
                                </div>
                                <div className="col-4">
                                    <label className="primary">Degree</label>
                                    {this.state.graduated ? (
                                        <div className="input-container--validated">
                                            <select form="education-form" name="degree" id="degree" className="form-control">
                                                <option value="">Select an option</option>
                                                {studyTypes.map((item) => <option value={item.Id}>{item.Name}</option>)}
                                            </select>
                                        </div>
                                    ) : (
                                        <div className="input-container--validated">
                                            <select
                                                form="education-form"
                                                name="degree"
                                                id="degree"
                                                disabled
                                                className="form-control"
                                            >
                                                <option value="">Select an option</option>
                                                {studyTypes.map((item) => <option value={item.Id}>{item.Name}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <Button type="submit" form="education-form" className="save-skill-button">
                                        Add
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        ''
                    )
                }
            </form>
        );

        return (
            <div>
                <div className="Apply-container--application">
                    <div className="row">
                        <div className="col-12">
                            <div className="applicant-card">
                                <div className="applicant-card__header">
                                    <span className="applicant-card__title">Education</span>
                                    {
                                        this.state.editing ? (
                                            ''
                                        ) : (
                                            <button className="applicant-card__edit-button" onClick={() => {
                                                this.setState({
                                                    editing: true
                                                })
                                            }}>Edit <i className="far fa-edit"></i>
                                            </button>
                                        )
                                    }
                                </div>
                                <div className="row">
                                    {
                                        renderEducationSection()
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
                                                        })
                                                    }
                                                }
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => {
                                                    this.insertEducationApplication();
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
            </div>
        );
    }
}

Education.propTypes = {};

export default withApollo(Education);
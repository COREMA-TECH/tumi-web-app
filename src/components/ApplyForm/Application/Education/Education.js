import React, {Component} from 'react';
import withApollo from "react-apollo/withApollo";
import studyTypes from "../../data/studyTypes";
import {GET_APPLICATION_EDUCATION_BY_ID} from "../../Queries";
import {ADD_APLICANT_EDUCATION, REMOVE_APPLICANT_EDUCATION} from "../../Mutations";
import CircularProgressLoading from "../../../material-ui/CircularProgressLoading";
import withGlobalContent from "../../../Generic/Global";
import EducationCard from "../../../ui-components/EducationCard/EducationCard";
import Dialog from "@material-ui/core/Dialog/Dialog";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import DialogActions from "@material-ui/core/DialogActions/DialogActions";

const menuSpanish = require(`../languagesJSON/${localStorage.getItem('languageForm')}/menuSpanish`);
const spanishActions = require(`../languagesJSON/${localStorage.getItem('languageForm')}/spanishActions`);
const educationFormLanguage = require(`../languagesJSON/${localStorage.getItem('languageForm')}/education/educationForm`);

const uuidv4 = require('uuid/v4');

class Education extends Component {
    constructor(props) {
        super(props);

        this.state = {
            // Editing state properties - To edit general info
            editing: false,
            schools: [],
            newSchools: [],
            applicationId: null,
            loading: false,
            open: false
        }
    }

    // To open the skill dialog
    handleClickOpen = () => {
        this.setState({open: true});
    };

    // To close the skill dialog
    handleClose = () => {
        this.setState({
            open: false,
            editing: false
        });
    };

    // To get a list of languages saved from API
    getEducationList = (id) => {
        this.setState({
            loading: true
        }, () => {
            this.props.client
                .query({
                    query: GET_APPLICATION_EDUCATION_BY_ID,
                    variables: {
                        id: id
                    },
                    fetchPolicy: 'no-cache'
                })
                .then(({data}) => {
                    this.setState({
                        schools: data.applications[0].educations,
                        loading: false
                    }, () => {
                        // console.table(this.state.schools);
                        // this.state.schools.map(item => (item.uuid = uuidv4()));
                    })
                })
                .catch(error => {
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to show education list. Please, try again!',
                        'bottom',
                        'right'
                    );
                });
        });
    };

    // To get a list of languages saved from API
    removeEducationById = (id) => {
        this.props.client
            .mutate({
                mutation: REMOVE_APPLICANT_EDUCATION,
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

                this.getEducationList(this.state.applicationId);
            })
            .catch(error => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error: error to remove. Please, try again!',
                    'bottom',
                    'right'
                );
            });
    };

    // To insert education
    insertEducationApplication = (item) => {
        delete item.uuid;

        this.props.client
            .mutate({
                mutation: ADD_APLICANT_EDUCATION,
                variables: {
                    application: item
                }
            })
            .then(() => {
                this.handleClose();

                this.props.handleOpenSnackbar(
                    'success',
                    'Successfully created',
                    'bottom',
                    'right'
                );

                this.getEducationList(this.state.applicationId);
            })
            .catch((error) => {
                // Replace this alert with a Snackbar message error
                this.props.handleOpenSnackbar(
                    'error',
                    'Error: error to save education. Please try again!',
                    'bottom',
                    'right'
                );
            });
    };

    componentWillMount() {
        this.setState({
            applicationId: this.props.applicationId
        }, () => {
            this.getEducationList(this.state.applicationId);
        });
    }

    render() {
        console.table(this.state.schools);


        // To render the Skills Dialog
        let renderEducationDialog = () => (
            <Dialog fullWidth open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                <form
                    autoComplete="off"
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
                            ApplicationId: this.state.applicationId
                        };

                        this.insertEducationApplication(item);

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
                    }}
                    className="apply-form"
                >
                    <br/>
                    <DialogContent>
                        <div className="col-12 form-section-1">
                            <div className="row">
                                <div className="col-6">
                                    <label className="primary">{educationFormLanguage[0].label}</label>
                                    <input
                                        id="studyType"
                                        form="education-form"
                                        name="studyType"
                                        type="text"
                                        className="form-control"
                                        required
                                        min="0"
                                        pattern=".*[^ ].*"
                                        maxLength="50"
                                        minLength="2"
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="primary">{educationFormLanguage[1].label}</label>
                                    <input
                                        form="education-form"
                                        name="institutionName"
                                        id="institutionName"
                                        type="text"
                                        pattern=".*[^ ].*"
                                        className="form-control"
                                        required
                                        min="0"
                                        maxLength="50"
                                        minLength="3"
                                    />
                                </div>
                                <div className="col-12">
                                    <label className="primary">{educationFormLanguage[2].label}</label>
                                    <input
                                        form="education-form"
                                        name="addressInstitution"
                                        id="addressInstitution"
                                        type="text"
                                        pattern=".*[^ ].*"
                                        className="form-control"
                                        required
                                        min="0"
                                        maxLength="50"
                                        minLength="3"
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <span className="primary">{educationFormLanguage[3].label}</span>
                                    <input
                                        form="education-form"
                                        name="startPeriod"
                                        id="startPeriod"
                                        onChange={event => {
                                            this.setState({
                                                startPeriod: event.target.value
                                            })
                                        }}
                                        type="date"
                                        pattern=".*[^ ].*"
                                        className="form-control"
                                        required
                                        min="0"
                                        maxLength="50"
                                        minLength="3"
                                    />
                                </div>
                                <div className="col-6">
                                    <span className="primary">{educationFormLanguage[4].label}</span>
                                    <input
                                        form="education-form"
                                        name="endPeriod"
                                        id="endPeriod"
                                        type="date"
                                        pattern=".*[^ ].*"
                                        className="form-control"
                                        required
                                        min={this.state.startPeriod}
                                        maxLength="50"
                                        minLength="3"
                                    />
                                </div>
                                <div className="col-6">
                                    <label className="primary">{educationFormLanguage[5].label}</label> <br/>
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
                                            pattern=".*[^ ].*"
                                            id="graduated"
                                        />
                                        <p className="slider round"/>
                                    </label>
                                </div>
                                <div className="col-6">
                                    <label className="primary">{educationFormLanguage[6].label}</label>
                                    {this.state.graduated ? (
                                        <div className="input-container--validated">
                                            <select form="education-form" name="degree" id="degree"
                                                    className="form-control">
                                                <option value="">{spanishActions[5].label}</option>
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
                                                <option value="">{spanishActions[5].label}</option>
                                                {studyTypes.map((item) => <option value={item.Id}>{item.Name}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div className="applicant-card__footer">
                            <button className="applicant-card__cancel-button" type="reset" onClick={this.handleClose}>
                                {spanishActions[2].label}
                            </button>
                            <button className="applicant-card__save-button" type="submit" form="education-form">
                                {spanishActions[0].label}
                            </button>
                        </div>
                    </DialogActions>
                </form>
            </Dialog>
        );

        // To render the Education Service Section
        let renderEducationSection = () => (
            <div className="row">
                {this.state.schools.map((schoolItem) => (
                    <div className="col-xs-12 col-md-3">
                        <EducationCard
                            type={schoolItem.schoolType}
                            educationName={schoolItem.educationName}
                            address={schoolItem.educationAddress}
                            startDate={schoolItem.startDate}
                            endDate={schoolItem.endDate}
                            graduated={schoolItem.graduated}
                            degree={
                                studyTypes.map((item) => {
                                    if (item.Id == schoolItem.degree) {
                                        return item.Name + '';
                                    }
                                })}
                            remove={() => {
                                this.setState((prevState) => ({
                                    schools: this.state.schools.filter((_, i) => {
                                        return _.uuid !== schoolItem.uuid;
                                    })
                                }), () => {
                                    if (schoolItem.id !== undefined) {
                                        this.removeEducationById(schoolItem.id)
                                    }
                                });
                            }}/>
                    </div>
                ))}
            </div>
        );

        return (
            <div>
                <div className="Apply-container--application">
                    <div className="">
                        <div className="">
                            <div className="applicant-card">
                                <div className="applicant-card__header">
                                    <span className="applicant-card__title">{menuSpanish[2].label}</span>
                                    {
                                        this.state.editing ? (
                                            ''
                                        ) : (
                                            <button className="applicant-card__edit-button" onClick={() => {
                                                this.setState({
                                                    editing: true,
                                                    open: true
                                                })
                                            }}>{spanishActions[0].label} <i className="fas fa-plus"></i>
                                            </button>
                                        )
                                    }
                                </div>
                                <div>
                                    {
                                        this.state.loading ? (
                                            <div className="form-section-1 form-section--center">
                                                <CircularProgressLoading/>
                                            </div>
                                        ) : (
                                            renderEducationSection()
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {
                    renderEducationDialog()
                }
            </div>
        );
    }
}

Education.propTypes = {};

export default withApollo(withGlobalContent(Education));
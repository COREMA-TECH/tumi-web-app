import React, {Component} from 'react';
import {CREATE_APPLICATION} from './Mutations';
import LinearProgress from '@material-ui/core/es/LinearProgress/LinearProgress';
import SelectNothingToDisplay from '../ui-components/NothingToDisplay/SelectNothingToDisplay/SelectNothingToDisplay';
import Query from 'react-apollo/Query';
import {GET_POSITIONS_QUERY, GET_STATES_QUERY} from './Queries';
import './index.css';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import InputRange from './ui/InputRange/InputRange';
import InputRangeDisabled from './ui/InputRange/InputRangeDisabled';
import withApollo from 'react-apollo/withApollo';
import studyTypes from './data/studyTypes';
import languageLevelsJSON from './data/languagesLevels';
import CircularProgress from "../material-ui/CircularProgress";
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import CircularProgressLoading from "../material-ui/CircularProgressLoading";

const uuidv4 = require('uuid/v4');

class ApplyForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            firstName: '',
            middleName: '',
            lastName: '',
            date: '',
            streetAddress: '',
            aptNumber: '',
            city: '',
            state: '',
            zipCode: '',
            homePhone: '',
            cellPhone: '',
            socialSecurityNumber: '',
            birthDay: '',
            car: '',
            typeOfId: '',
            expireDateId: '',
            emailAddress: '',
            positionApplyingFor: 1,
            idealJob: '',
            dateAvailable: '',
            scheduleRestrictions: '',
            scheduleExplain: '',
            convicted: '',
            convictedExplain: '',
            socialNetwork: '',
            comment: '',

            // Languages array
            languages: [],

            // Skills array
            skills: [],

            // Schools array
            schools: [],

            // Military Service state fields
            branch: '',
            startDateMilitaryService: '',
            endDateMilitaryService: '',
            rankAtDischarge: '',
            typeOfDischarge: '',

            // Previous Employment
            previousEmployment: [],
            companyName: '',
            companyPhone: '',
            companyAddress: '',
            companySupervisor: '',
            companyJobTitle: '',
            companyPayRate: '',
            companyStartDate: '',
            companyEndDate: '',
            companyReasonForLeaving: '',

            percent: 50,
            insertDialogLoading: false
        };
    }

    handleClickOpen = () => {
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    // To validate all the inputs and set a red border when the input is invalid
    validateInvalidInput = () => {
        if (document.addEventListener) {
            document.addEventListener(
                'invalid',
                (e) => {
                    e.target.className += ' invalid-apply-form';
                },
                true
            );
        }
    };

    insertApplicationInformation = () => {
        this.props.client.mutate({
            mutation: CREATE_APPLICATION,
            variables: {
                application: {
                    firstName: this.state.firstName,
                    middleName: this.state.middleName,
                    lastName: this.state.lastName,
                    date: this.state.date,
                    streetAddress: this.state.streetAddress,
                    aptNumber: this.state.aptNumber,
                    city: this.state.city,
                    state: this.state.state,
                    zipCode: this.state.zipCode,
                    homePhone: this.state.homePhone,
                    cellPhone: this.state.cellPhone,
                    socialSecurityNumber: this.state.socialSecurityNumber,
                    birthDay: this.state.birthDay,
                    car: this.state.car,
                    typeOfId: parseInt(this.state.typeOfId),
                    expireDateId: this.state.expireDateId,
                    emailAddress: this.state.emailAddress,
                    positionApplyingFor: parseInt(this.state.positionApplyingFor),
                    dateAvailable: this.state.dateAvailable,
                    scheduleRestrictions: this.state.scheduleRestrictions,
                    scheduleExplain: this.state.scheduleExplain,
                    convicted: this.state.convicted,
                    convictedExplain: this.state.convictedExplain,
                    comment: this.state.comment
                }
            }
        });
    };

    render() {
        this.validateInvalidInput();

        let renderInsertDialogLoading = () => (
            <Dialog
                open={this.state.insertDialogLoading}
                onClose={this.handleClose}
                aria-labelledby="responsive-dialog-title"
            >
                <DialogTitle id="responsive-dialog-title">Sending Application</DialogTitle>
                <DialogContent>
                    <div className="center-progress-dialog">
                        <CircularProgressLoading />
                    </div>
                </DialogContent>
            </Dialog>
        );

        // To render the Skills Dialog
        let renderSkillsDialog = () => (
            <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
                <form
                    autoComplete="off"
                    id="skill-form"
                    onSubmit={() => {
                        let item = {
                            uuid: uuidv4(),
                            description: document.getElementById('description').value,
                            level: this.state.percent
                        };

                        this.setState(
                            (prevState) => ({
                                open: false,
                                skills: [...prevState.skills, item]
                            }),
                            () => {
                                this.setState({
                                    percent: 50
                                });
                            }
                        );
                    }}
                    className="apply-form"
                >
                    <h1 className="title-skill-dialog" id="form-dialog-title" style={{textAlign: 'center'}}>
                        New Skill
                    </h1>
                    <br/>
                    <DialogContent style={{width: '450px'}}>
                        <div className="row">
                            <div className="col-12">
                                <span className="primary">Skill Name</span>
                                <br/>
                                <input
                                    id="description"
                                    name="description"
                                    type="text"
                                    className="form-control"
                                    required
                                    min="0"
                                    maxLength="20"
                                    minLength="3"
                                    form="skill-form"
                                />
                            </div>
                        </div>
                        <br/>
                        <div className="row">
                            <div className="col-12">
                                <span className="primary">Skill Level</span>
                                <br/>
                                <InputRange
                                    getPercentSkill={(percent) => {
                                        // update the percent skill
                                        this.setState({
                                            percent: percent
                                        });
                                    }}
                                />
                            </div>
                        </div>
                        <br/>
                        <br/>
                    </DialogContent>
                    <DialogActions>
                        <Button className="cancel-skill-button" onClick={this.handleClose} color="default">
                            Cancel
                        </Button>
                        <Button className="save-skill-button" type="submit" form="skill-form" color="primary">
                            Add
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        );

        // To render the Applicant Information Section
        let renderApplicantInformationSection = () => (
            <div className="ApplyBlock">
                <h4 className="ApplyBlock-title">Applicant Information</h4>
                <div className="row">
                    <div className="col-3">
                        <span className="primary"> First Name</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    firstName: event.target.value
                                });
                            }}
                            value={this.state.firstName}
                            name="firstName"
                            type="text"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                        />
                        <span className="Apply-okCheck"/>
                    </div>

                    <div className="col-3">
                        <div className="row">
                            <span className="primary">Middle Name</span>
                            <input
                                onChange={(event) => {
                                    this.setState({
                                        middleName: event.target.value
                                    });
                                }}
                                value={this.state.middleName}
                                name="midleName"
                                type="text"
                                className="form-control"
                                min="0"
                                maxLength="50"
                                minLength="3"
                            />
                            <span className="Apply-okCheck"/>
                            <i className="optional"/>
                        </div>
                    </div>

                    <div className="col-3">
                        <span className="primary"> Last Name</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    lastName: event.target.value
                                });
                            }}
                            value={this.state.lastName}
                            name="lastName"
                            type="text"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                        />
                        <span className="Apply-okCheck"/>
                    </div>

                    <div className="col-3">
                        <span className="primary"> Date</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    date: event.target.value
                                });
                            }}
                            value={this.state.date}
                            name="date"
                            type="date"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                        />
                        <span className="Apply-okCheck"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-8">
                        <span className="primary"> Street Address</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    streetAddress: event.target.value
                                });
                            }}
                            value={this.state.streetAddress}
                            name="streetAddress"
                            type="text"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                            minLength="5"
                        />
                        <span className="Apply-okCheck"/>
                    </div>
                    <div className="col-4">
                        <span className="primary">Apt Number</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    aptNumber: event.target.value
                                });
                            }}
                            value={this.state.aptNumber}
                            name="aptNumber"
                            type="number"
                            className="form-control"
                            min="0"
                            maxLength="50"
                            minLength="5"
                        />
                        <span className="Apply-okCheck"/>
                        <i className="optional"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <span className="primary"> State</span>
                        <Query query={GET_STATES_QUERY} variables={{parent: 6}}>
                            {({loading, error, data, refetch, networkStatus}) => {
                                //if (networkStatus === 4) return <LinearProgress />;
                                if (loading) return <LinearProgress/>;
                                if (error) return <p>Error </p>;
                                if (data.getcatalogitem != null && data.getcatalogitem.length > 0) {
                                    return (
                                        <select name="state" id="state" required className="form-control">
                                            <option value="">Select a state</option>
                                            {data.getcatalogitem.map((item) => (
                                                <option value={item.Id}>{item.Name}</option>
                                            ))}
                                        </select>
                                    );
                                }
                                return <SelectNothingToDisplay/>;
                            }}
                        </Query>
                    </div>
                    <div className="col-4">
                        <span className="primary"> City</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    city: event.target.value
                                });
                            }}
                            value={this.state.city}
                            name="city"
                            type="text"
                            className="form-control"
                            required
                            min="0"
                            maxLength="10"
                            minLength="3"
                        />
                        <span className="Apply-okCheck"/>
                    </div>
                    <div className="col-4">
                        <span className="primary"> Zip Code</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    zipCode: event.target.value
                                });
                            }}
                            value={this.state.zipCode}
                            name="zipCode"
                            type="number"
                            className="form-control"
                            required
                            maxLength="5"
                            minLength="4"
                            min="10000"
                            max="99999"
                        />
                        <span className="Apply-okCheck"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <span className="primary"> Home Phone</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    homePhone: event.target.value
                                });
                            }}
                            value={this.state.homePhone}
                            name="homePhone"
                            type="tel"
                            className="form-control"
                            min="999"
                            maxLength="10"
                            minLength="10"
                        />
                        <span className="Apply-okCheck"/>
                        <i className="optional"/>
                    </div>

                    <div className="col-4">
                        <span className="primary"> Cell Phone</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    cellPhone: event.target.value
                                });
                            }}
                            value={this.state.cellPhone}
                            name="cellPhone"
                            type="tel"
                            className="form-control"
                            required
                            min="0"
                            maxLength="10"
                            minLength="10"
                        />
                        <span className="Apply-okCheck"/>
                    </div>

                    <div className="col-4">
                        <span className="primary"> Social Security Number</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    socialSecurityNumber: event.target.value
                                });
                            }}
                            value={this.state.socialSecurityNumber}
                            name="socialSecurityNumber"
                            type="number"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                            minLength="10"
                        />
                        <span className="Apply-okCheck"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <span className="primary"> Birth Day</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    birthDay: event.target.value
                                });
                            }}
                            value={this.state.birthDay}
                            name="birthDay"
                            type="date"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                            minLength="10"
                        />
                        <span className="Apply-okCheck"/>
                    </div>
                    <div className="col-3">
                        <span className="primary"> Car</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    car: event.target.value
                                });
                            }}
                            value={this.state.car}
                            name="car"
                            type="checkbox"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                            minLength="10"
                        />
                    </div>
                    <div className="col-3">
                        <span className="primary"> Type Of ID</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    typeOfId: event.target.value
                                });
                            }}
                            value={this.state.typeOfId}
                            name="typeOfID"
                            type="number"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                            minLength="10"
                        />
                        <span className="Apply-okCheck"/>
                    </div>
                    <div className="col-3">
                        <span className="primary"> Expire Date ID</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    expireDateId: event.target.value
                                });
                            }}
                            value={this.state.expireDateId}
                            name="expireDateId"
                            type="date"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                            minLength="10"
                        />
                        <span className="Apply-okCheck"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <span className="primary"> Email Address</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    emailAddress: event.target.value
                                });
                            }}
                            value={this.state.emailAddress}
                            name="emailAddress"
                            type="email"
                            className="form-control"
                            required
                            min="0"
                            pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$"
                            maxLength="50"
                            minLength="8"
                        />
                        <span className="Apply-okCheck"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <span className="primary"> Position Applying for</span>
                        <Query query={GET_POSITIONS_QUERY}>
                            {({loading, error, data, refetch, networkStatus}) => {
                                //if (networkStatus === 4) return <LinearProgress />;
                                if (loading) return <LinearProgress/>;
                                if (error) return <p>Error </p>;
                                if (data.getposition != null && data.getposition.length > 0) {
                                    return (
                                        <select
                                            name="city"
                                            id="city"
                                            onChange={(event) => {
                                                this.setState({
                                                    positionApplyingFor: event.target.value
                                                });
                                            }}
                                            className="form-control"
                                        >
                                            <option value="">Select a position</option>
                                            <option value="0">Open Position</option>
                                            {data.getposition.map((item) => (
                                                <option value={item.Id}>{item.Position}</option>
                                            ))}
                                        </select>
                                    );
                                }
                                return <SelectNothingToDisplay/>;
                            }}
                        </Query>
                        <i className="optional"/>
                    </div>
                    <div className="col-4">
                        <span className="primary"> Ideal Job</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    idealJob: event.target.value
                                });
                            }}
                            value={this.state.idealJob}
                            name="idealJob"
                            type="text"
                            className="form-control"
                            required
                            min="0"
                            minLength="3"
                            maxLength="50"
                        />
                        <span className="Apply-okCheck"/>
                    </div>
                    <div className="col-4">
                        <span className="primary"> Date Available</span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    dateAvailable: event.target.value
                                });
                            }}
                            value={this.state.dateAvailable}
                            name="dateAvailable"
                            type="date"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                        />
                        <span className="Apply-okCheck"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <span className="primary"> Do you have any schedule restrictions? </span>
                        <div className="col-12">
                            <input
                                onChange={(event) => {
                                    this.setState({
                                        scheduleRestrictions: event.target.value
                                    });
                                }}
                                value="1"
                                type="radio"
                                name="scheduleRestrictions"
                                className=""
                            />
                            <label className="radio-label"> Yes</label>
                            <input
                                onChange={(event) => {
                                    this.setState({
                                        scheduleRestrictions: event.target.value
                                    });
                                }}
                                value="0"
                                type="radio"
                                name="scheduleRestrictions"
                                className=""
                            />
                            <label className="radio-label"> No</label>
                        </div>
                        <span className="Apply-okCheck"/>
                    </div>
                    <div className="col-8">
                        <span className="primary"> If yes, please explain </span>
                        <textarea
                            onChange={(event) => {
                                this.setState({
                                    scheduleExplain: event.target.value
                                });
                            }}
                            value={this.state.scheduleExplain}
                            name="form-control"
                            cols="30"
                            rows="3"
                            required
                            className="form-control textarea-apply-form"
                        />
                        <span className="Apply-okCheck"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-4">
                        <span className="primary"> Have you ever been convicted of a felony? </span>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    convicted: event.target.value
                                });
                            }}
                            value="1"
                            type="radio"
                            name="convicted"
                            className=""
                        />
                        <label className="radio-label"> Yes</label>
                        <input
                            onChange={(event) => {
                                this.setState({
                                    convicted: event.target.value
                                });
                            }}
                            value="0"
                            type="radio"
                            name="convicted"
                            className=""
                        />
                        <label className="radio-label"> No</label>
                        <span className="Apply-okCheck"/>
                    </div>
                    <div className="col-8">
                        <span className="primary"> If yes, please explain </span>
                        <textarea
                            onChange={(event) => {
                                this.setState({
                                    convictedExplain: event.target.value
                                });
                            }}
                            value={this.state.convictedExplain}
                            name="form-control"
                            cols="30"
                            required
                            rows="3"
                            className="form-control textarea-apply-form"
                        />
                        <span className="Apply-okCheck"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <span className="primary"> How did you hear about Tumi Staffing </span>
                    </div>
                    <div className="col-10">
                        <div className="row">
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-2">
                                        <label className="radio-label"> Facebook</label>
                                    </div>
                                    <div className="col-1">
                                        <input
                                            onChange={(event) => {
                                                this.setState({
                                                    socialNetwork: event.target.value
                                                });
                                            }}
                                            name="socialNetworks"
                                            type="radio"
                                            className="form-control"
                                            required
                                            value="facebook"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-2">
                                        <label className="radio-label"> Linkedin</label>
                                    </div>
                                    <div className="col-1">
                                        <input
                                            onChange={(event) => {
                                                this.setState({
                                                    socialNetwork: event.target.value
                                                });
                                            }}
                                            name="socialNetworks"
                                            type="radio"
                                            className="form-control"
                                            required
                                            value="linkedin"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-2">
                                        <label className="radio-label"> Instagram</label>
                                    </div>
                                    <div className="col-1">
                                        <input
                                            onChange={(event) => {
                                                this.setState({
                                                    socialNetwork: event.target.value
                                                });
                                            }}
                                            name="socialNetworks"
                                            type="radio"
                                            className="form-control"
                                            required
                                            value="instagram"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-2">
                                        <label className="radio-label"> News Paper</label>
                                    </div>
                                    <div className="col-1">
                                        <input
                                            onChange={(event) => {
                                                this.setState({
                                                    socialNetwork: event.target.value
                                                });
                                            }}
                                            name="socialNetworks"
                                            type="radio"
                                            className="form-control"
                                            required
                                            value="newspaper"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-2">
                                        <label className="radio-label"> Journals</label>
                                    </div>
                                    <div className="col-1">
                                        <input
                                            onChange={(event) => {
                                                this.setState({
                                                    socialNetwork: event.target.value
                                                });
                                            }}
                                            name="socialNetworks"
                                            type="radio"
                                            className="form-control"
                                            required
                                            value="journals"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col-12">
                                <div className="row">
                                    <div className="col-2">
                                        <label className="radio-label"> Other</label>
                                    </div>
                                    <div className="col-1">
                                        <input
                                            onChange={(event) => {
                                                this.setState({
                                                    socialNetwork: event.target.value
                                                });
                                            }}
                                            name="socialNetworks"
                                            type="radio"
                                            className="form-control"
                                            required
                                            value="others"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-12">
                                {this.state.socialNetwork === 'others' ? (
                                    <textarea
                                        onChange={(event) => {
                                            this.setState({
                                                comment: event.target.value
                                            });
                                        }}
                                        placeholder="Explain how did you hear about Tumi Staffing"
                                        value={this.state.comment}
                                        required
                                        name="comment"
                                        cols="20"
                                        rows="10"
                                        className="form-control textarea-apply-form"
                                    />
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );

        // To render the Education Service Section
        let renderEducationSection = () => (
            <form
                id="education-form"
                className="ApplyBlock"
                onSubmit={(e) => {
                    e.preventDefault();

                    let item = {
                        uuid: uuidv4(),
                        schoolType: parseInt(document.getElementById('studyType').value),
                        educationName: document.getElementById('institutionName').value,
                        educationAddress: document.getElementById('addressInstitution').value,
                        startDate: document.getElementById('startPeriod').value,
                        endDate: document.getElementById('endPeriod').value,
                        graduated: document.getElementById('graduated').checked,
                        degree: document.getElementById('degree').value,
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
                            document.getElementById('degree').classList.remove('invalid-apply-form');
                        }
                    );
                }}
            >
                <h4 className="ApplyBlock-title">Education</h4>
                {this.state.schools.length > 0 ? (
                    <div key={uuidv4()} className="skills-container skills-container--header">
                        <div className="row">
                            <div className="col-2">
                                <span>Study</span>
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
                        </div>
                    </div>
                ) : (
                    ''
                )}
                {this.state.schools.map((schoolItem) => (
                    <div key={uuidv4()} className="skills-container">
                        <div className="row">
                            <div className="col-2">
                                <span>{schoolItem.schoolType}</span>
                            </div>
                            <div className="col-2">
                                <span>{schoolItem.educationName}</span>
                            </div>
                            <div className="col-2">
                                <span>{schoolItem.educationAddress}</span>
                            </div>
                            <div className="col-2">
                                <span>{schoolItem.startDate}</span>
                            </div>
                            <div className="col-2">
                                <span>{schoolItem.endDate}</span>
                            </div>
                            <div className="col-1">
                                <span>{schoolItem.graduated ? 'Yes' : 'No'}</span>
                            </div>
                            <div className="col-1">
                                <Button
                                    className="deleteSkillSection"
                                    onClick={() => {
                                        this.setState((prevState) => ({
                                            schools: this.state.schools.filter((_, i) => {
                                                console.log(this.state.languages);
                                                return _.uuid !== schoolItem.uuid;
                                            })
                                        }));
                                    }}
                                >
                                    x
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                <hr className="separator"/>
                <div className="row">
                    <div className="col-3">
                        <label className="primary">Study</label>
                        <select form="education-form" name="studyType" id="studyType" required className="form-control">
                            <option value="">Select an option</option>
                            {studyTypes.map((item) => <option value={item.Id}>{item.Name}</option>)}
                        </select>
                    </div>
                    <div className="col-3">
                        <label className="primary">Name (Institution)</label>
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
                    </div>
                    <div className="col-6">
                        <label className="primary">Address</label>
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
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <span className="primary"> Time Period</span>
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
                    </div>
                    <div className="col-3">
                        <span className="primary">To</span>
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
                    </div>
                    <div className="col-2">
                        <label className="primary">Graduated</label> <br/>
                        <input form="education-form" type="checkbox" name="graduated" id="graduated" className=""/>
                    </div>
                    <div className="col-4">
                        <label className="primary">Degree</label>
                        <input
                            form="education-form"
                            name="degree"
                            id="degree"
                            type="text"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <Button type="submit" form="education-form" className="save-skill-button">
                            Add
                        </Button>
                    </div>
                </div>
            </form>
        );

        // To render the Military Service Section
        let renderMilitaryServiceSection = () => (
            <div className="ApplyBlock">
                <h4 className="ApplyBlock-title">Military Service</h4>
                <div className="row">
                    <div className="col-6">
                        <span className="primary"> Branch</span>
                        <input
                            name="militaryBranch"
                            type="text"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                        />
                        <span className="Apply-okCheck"/>
                    </div>
                    <div className="col-6">
                        <span className="primary"> Rank at Discharge</span>
                        <input
                            name="militaryRankDischarge"
                            type="text"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                        />
                        <span className="Apply-okCheck"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-3">
                        <span className="primary"> Dates</span>
                        <input
                            name="militaryStartDate"
                            type="date"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                        />
                    </div>
                    <div className="col-3">
                        <span className="primary">To: </span>
                        <input
                            name="militaryEndDate"
                            type="date"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                        />
                    </div>
                    <div className="col-6">
                        <span className="primary"> Type of Discharge</span>
                        <select name="dischargeType" id="dischargeType" required className="form-control">
                            <option value="">Select a type</option>
                            <option value="typeOne">Example</option>
                        </select>
                        <span className="Apply-okCheck"/>
                    </div>
                </div>
            </div>
        );

        let renderPreviousEmploymentSection = () => (
            <form
                id="form-previous-employment"
                className="ApplyBlock"
                onSubmit={(e) => {
                    e.preventDefault();

                    let item = {
                        uuid: uuidv4(),
                        companyName: document.getElementById('companyNameEmployment').value,
                        phone: document.getElementById('companyPhoneEmployment').value,
                        address: document.getElementById('companyAddressEmployment').value,
                        supervisor: document.getElementById('companySupervisor').value,
                        jobTitle: document.getElementById('companyJobTitle').value,
                        payRate: document.getElementById('companyPayRate').value,
                        startDate: document.getElementById('companyStartDate').value,
                        endDate: document.getElementById('companyEndDate').value,
                        reasonForLeaving: document.getElementById('companyReasonForLeaving').value
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
                        }
                    );
                }}
            >
                <h4 className="ApplyBlock-title">Previous Employment</h4>
                <div className="row">
                    {this.state.previousEmployment.length > 0 ? (
                        <div key={uuidv4()} className="skills-container skills-container--header">
                            <div className="row">
                                <div className="col-2">
                                    <span>Company</span>
                                </div>
                                <div className="col-2">
                                    <span>Address</span>
                                </div>
                                <div className="col-2">
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
                                <div className="col-1">
                                    <span>Start Date</span>
                                </div>
                                <div className="col-1">
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
                                <div className="col-2">
                                    <span>{employmentItem.companyName}</span>
                                </div>
                                <div className="col-2">
                                    <span>{employmentItem.address}</span>
                                </div>
                                <div className="col-2">
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
                                <div className="col-1">
                                    <span>{employmentItem.startDate}</span>
                                </div>
                                <div className="col-1">
                                    <span>{employmentItem.endDate}</span>
                                </div>

                                <div className="col-1">
                                    <Button
                                        className="deleteSkillSection"
                                        onClick={() => {
                                            this.setState((prevState) => ({
                                                previousEmployment: this.state.previousEmployment.filter((_, i) => {
                                                    return _.uuid !== employmentItem.uuid;
                                                })
                                            }));
                                        }}
                                    >
                                        x
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <hr className="separator"/>
                </div>
                <div className="row">
                    <div className="col-8">
                        <span className="primary"> Company</span>
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
                        <span className="Apply-okCheck"/>
                    </div>
                    <div className="col-4">
                        <span className="primary"> Phone</span>
                        <input
                            id="companyPhoneEmployment"
                            form="form-previous-employment"
                            name="phoneEmployment"
                            type="number"
                            className="form-control"
                            required
                            min="0"
                            maxLength="10"
                            minLength="10"
                        />
                        <span className="Apply-okCheck"/>
                    </div>
                    <div className="col-8">
                        <span className="primary"> Address</span>
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
                        <span className="Apply-okCheck"/>
                    </div>
                    <div className="col-4">
                        <span className="primary"> Supervisor</span>
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
                        <span className="Apply-okCheck"/>
                    </div>
                    <div className="col-8">
                        <span className="primary"> Job Title</span>
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
                        <span className="Apply-okCheck"/>
                    </div>
                    <div className="col-4">
                        <span className="primary"> Pay Rate</span>
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
                        <span className="Apply-okCheck"/>
                    </div>
                    <div className="col-3">
                        <span className="primary"> Dates</span>
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
                        <span className="Apply-okCheck"/>
                    </div>
                    <div className="col-3">
                        <span className="primary">To: </span>
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
                        <span className="Apply-okCheck"/>
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
            </form>
        );

        let renderlanguagesSection = () => (
            <div className="ApplyBlock">
                <h4 className="ApplyBlock-title">Languages</h4>
                {this.state.languages.length > 0 ? (
                    <div className="skills-container skills-container--header">
                        <div className="row">
                            <div className="col-3">
                                <span>Language Name</span>
                            </div>
                            <div className="col-4">
                                <span>Conversation %</span>
                            </div>
                            <div className="col-4">
                                <span>Writing %</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    ''
                )}
                {this.state.languages.map((languageItem) => (
                    <div key={uuidv4()} className="skills-container">
                        <div className="row">
                            <div className="col-3">
                                <span>{languageItem.idLanguage}</span>
                            </div>
                            <div className="col-4">
                                <span>{languageItem.conversation}</span>
                            </div>
                            <div className="col-4">
                                <span>{languageItem.writing}</span>
                            </div>
                            <div className="col-1">
                                <Button
                                    className="deleteSkillSection"
                                    onClick={() => {
                                        this.setState((prevState) => ({
                                            languages: this.state.languages.filter((_, i) => {
                                                console.log(this.state.languages);
                                                return _.uuid !== languageItem.uuid;
                                            })
                                        }));
                                    }}
                                >
                                    x
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
                <br/>
                <br/>
                {this.state.languages.length > 0 ? <hr/> : ''}
                <form
                    className="row"
                    id="form-language"
                    autoComplete="off"
                    onSubmit={(e) => {
                        e.preventDefault();

                        let item = {
                            uuid: uuidv4(),
                            ApplicationId: 1,
                            idLanguage: document.getElementById('nameLanguage').value,
                            writing: document.getElementById('writingLanguage').value,
                            conversation: document.getElementById('conversationLanguage').value
                        };

                        this.setState(
                            (prevState) => ({
                                open: false,
                                languages: [...prevState.languages, item]
                            }),
                            () => {
                                document.getElementById('form-language').reset();
                                document.getElementById('writingLanguage').classList.remove('invalid-apply-form');
                                document.getElementById('conversationLanguage').classList.remove('invalid-apply-form');
                                document.getElementById('nameLanguage').classList.remove('invalid-apply-form');
                            }
                        );
                    }}
                >
                    <div className="col-3">
                        <span className="primary"> Language</span>
                        <input
                            id="nameLanguage"
                            form="form-language"
                            name="languageName"
                            type="text"
                            className="form-control"
                            required
                            min="0"
                            maxLength="50"
                            minLength="3"
                        />
                        <span className="Apply-okCheck"/>
                    </div>
                    <div className="col-3">
                        <span className="primary"> Conversation</span>
                        <select
                            required
                            id="conversationLanguage"
                            form="form-language"
                            name="conversationLanguage"
                            className="form-control"
                        >
                            <option value="">Select an option</option>
                            {languageLevelsJSON.map((item) => <option value={item.Id}>{item.Name}</option>)}
                        </select>
                        <span className="Apply-okCheck"/>
                    </div>
                    <div className="col-3">
                        <span className="primary"> Writing</span>
                        <select
                            required
                            id="writingLanguage"
                            form="form-language"
                            name="writingLanguage"
                            className="form-control"
                        >
                            <option value="">Select an option</option>
                            {languageLevelsJSON.map((item) => <option value={item.Id}>{item.Name}</option>)}
                        </select>
                        <span className="Apply-okCheck"/>
                    </div>
                    <div className="col-3">
                        <br/>
                        <Button type="submit" form="form-language" className="save-skill-button">
                            Add
                        </Button>
                    </div>
                </form>
            </div>
        );

        let renderSkillsSection = () => (
            <div className="ApplyBlock">
                <h4 className="ApplyBlock-title">Skills</h4>
                <div className="row">
                    <div className="col-9"/>
                    <div className="col-3">
                        <Button onClick={this.handleClickOpen} className="save-skill-button">
                            New Skill
                        </Button>
                        {renderSkillsDialog()}
                    </div>
                    <div className="col-12">
                        {this.state.skills.length > 0 ? (
                            <div className="skills-container skills-container--header">
                                <div className="row">
                                    <div className="col-6">
                                        <span>Skill Name</span>
                                    </div>
                                    <div className="col-6">
                                        <span>Skill Level</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            ''
                        )}
                        {this.state.skills.map((skillItem) => (
                            <div key={uuidv4()} className="skills-container">
                                <div className="row">
                                    <div className="col-6">
                                        <span>{skillItem.description}</span>
                                    </div>
                                    <div className="col-5">
                                        <InputRangeDisabled percent={skillItem.level}/>
                                    </div>
                                    <div className="col-1">
                                        <Button
                                            className="deleteSkillSection"
                                            onClick={() => {
                                                this.setState((prevState) => ({
                                                    skills: this.state.skills.filter((_, i) => {
                                                        console.log(this.state.skills);
                                                        return _.uuid !== skillItem.uuid;
                                                    })
                                                }));
                                            }}
                                        >
                                            x
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );

        return (
            <div>
                <header className="Header">Application Form</header>
                <form
                    className="ApplyForm apply-form"
                    onSubmit={(e) => {
                        // To cancel the default submit event
                        e.preventDefault();

                        // Call mutation to create a application
                        //this.insertApplicationInformation();

                        // Set interval and show dialog
                        this.setState({
                            insertDialogLoading: true
                        }, () => {
                            setTimeout(() => {
                                this.setState({
                                    insertDialogLoading: false
                                });
                            }, 3000);
                        });
                    }}
                >
                    {renderApplicantInformationSection()}
                    {/*{renderlanguagesSection()}*/}
					{/*{renderEducationSection()}*/}
					{/*{renderMilitaryServiceSection()}*/}
					{/*{renderPreviousEmploymentSection()}*/}
					{/*{renderSkillsSection()}*/}
                    { renderInsertDialogLoading() }
                    <div className="Apply-container">
                        <div className="row">
                            <div className="col-12 buttons-group-right">
                                <button type="reset" className="btn-circle btn-lg red">
                                    <i className="fas fa-eraser"/>
                                </button>
                                <button type="submit" className="btn-circle btn-lg">
                                    <i className="fas fa-save"/>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

export default withApollo(ApplyForm);

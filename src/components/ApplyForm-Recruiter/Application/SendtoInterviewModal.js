import React, {Component, Fragment} from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import { withStyles } from '@material-ui/core/styles';
import moment from 'moment';
import DatePicker from "react-datepicker";
import withApollo from 'react-apollo/withApollo';
import { ADD_TASK } from '../Mutations';
import withGlobalContent from '../../Generic/Global';

const styles = () => ({
    overflowVisible:{
        overflow: 'visible'
    }
});

class SendtoInterviewModal extends Component {

    state = {
        sendEmail: false,
        sendSMS: false,
        description: '',
        recruiterSelected: {},
        location: null,
        date: null,
        hour: null
    }

    handleChangeSendEmail = (event) => {
        this.setState({
            sendEmail: event.target.checked
        });
    }

    handleChangeSendSMS = (event) => {
        this.setState({
            sendSMS: event.target.checked
        });
    }

    handleChangeLocation = (e) => {
        this.setState({
            location: e.currentTarget.value
        });
    }

    handleChangeDescription = (e) => {
        this.setState({
            description: e.currentTarget.value
        });
    }

    handleChangeRecruiter = ({value}) => {
        this.setState({
            recruiterSelected: value
        });
    }

    handleChangeDate = (value) => {
		this.setState(() => ({
			date: value
		}));
    }
    
    handleChangeHour = (value) => {
		this.setState(() => ({
			hour: value
		}));
    }
    
    handleTaskSave = () => {
        const {userId, email, phoneNumber} = this.props;
        const {sendEmail, sendSMS, description, location, date, hour} = this.state;

        let tasktoSave = {
            email: sendEmail ? email : null,
            phoneNumber: sendSMS ? phoneNumber : null,
            description: description,
            location: location,
            date: moment(date).format('L'), // MM/dd/YYYY
            hour: moment(hour).format('LT'), // hh:mm AM/PM
            typeTaskId: 1,
            userId,
            userCreated: userId,
            userUpdated: userId
        }

        this.props.client
            .mutate({
                mutation: ADD_TASK,
                variables: {
                    task: { ...tasktoSave },
                    applicationId: this.props.applicationId
                }
            })
            .then(({ data }) => {
                this.props.confirmSendtoInterview();
            })
            .catch((error) => {
                this.setState(() => ({ insertDialogLoading: false }));
                this.props.handleOpenSnackbar(
                    'error',
                    'Error to save Schedule',
                    'bottom',
                    'right'
                );
            });
    }

    componentWillMount() {
        const currentDate = new Date();
        this.setState({
            date: currentDate,
            hour: currentDate 
        });
    }

    render() {
        const { open, email, phoneNumber, recruitersOpt, classes } = this.props;

        return <Fragment>
            <Dialog maxWidth="xl" open={open} classes={{paperScrollPaper: classes.overflowVisible }} >
                <DialogTitle id="responsive-dialog-title" style={{ padding: '0px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">
                            Schedule Interview
                        </h5>
                    </div>
                </DialogTitle>
                <DialogContent className={classes.overflowVisible} >
                    {/* <div className="row">
                        <div className="col-md-12">
                            <span className="primary applicant-card__label">
                                Recruiter
                            </span>
                            <Select
                                options={recruitersOpt}
                                value={this.state.recruiterSelected}
                                onChange={this.handleChangeRecruiter}
                                closeMenuOnSelect={false}
                                components={makeAnimated()}
                            />
                        </div>
                    </div> */}

                    <div className="row">
                        <div className="col-md-6">
                            <div class="input-group flex-nowrap">
                                <DatePicker
                                    selected={this.state.date}
                                    onChange={this.handleChangeDate}
                                    placeholderText="Date"
                                    id="date"
                                />
                                <div class="input-group-append">
                                    <label class="input-group-text" id="addon-wrapping" for="date">
                                        <i class="far fa-calendar"></i>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div class="input-group flex-nowrap">
                                <DatePicker
                                    selected={this.state.hour}
                                    onChange={this.handleChangeHour}
                                    placeholderText="Hour"
                                    id="hour"
                                    showTimeSelect
                                    showTimeSelectOnly
                                    timeIntervals={15}
                                    timeCaption="Time"
                                    dateFormat="h:mm aa"
                                />
                                <div class="input-group-append">
                                    <label class="input-group-text" id="addon-wrapping" for="hour">
                                        <i class="far fa-clock"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <span className="primary">Address</span>
                            <textarea
                                onChange={this.handleChangeLocation}
                                name="location"
                                className="form-control"
                                id="location"
                                cols="30"
                                rows="3"
                                value={this.state.location}
                                placeholder="Address"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-12">
                            <span className="primary">Description</span>
                            <textarea
                                onChange={this.handleChangeDescription}
                                name="description"
                                className="form-control"
                                id="description"
                                cols="30"
                                rows="3"
                                value={this.state.description}
                                placeholder="Description"
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6">
                            <span className="primary applicant-card__label ">
                                Send by email
                            </span>
                            <div className="d-flex align-items-end">
                                <div className="onoffswitch">
                                    <input
                                        id="sendEmail"
                                        className="onoffswitch-checkbox"
                                        onChange={this.handleChangeSendEmail}
                                        checked={this.state.sendEmail}
                                        value={this.state.sendEmail}
                                        name="sendEmail"
                                        type="checkbox"
                                        disabled={!email}
                                        min="0"
                                        maxLength="50"
                                        minLength="10"
                                    />
                                    <label className="onoffswitch-label" htmlFor="sendEmail">
                                        <span className="onoffswitch-inner" />
                                        <span className="onoffswitch-switch" />
                                    </label>
                                </div>
                                <span className="ml-2 text-muted small">{email}</span>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <span className="primary applicant-card__label ">
                                Send by SMS
                            </span>
                            <div className="d-flex align-items-end">
                                <div className="onoffswitch">
                                    <input
                                        id="sendSMS"
                                        className="onoffswitch-checkbox"
                                        onChange={this.handleChangeSendSMS}
                                        checked={this.state.sendSMS}
                                        value={this.state.sendSMS}
                                        name="sendSMS"
                                        type="checkbox"
                                        disabled={!phoneNumber}
                                        min="0"
                                        maxLength="50"
                                        minLength="10"
                                    />
                                    <label className="onoffswitch-label" htmlFor="sendSMS">
                                        <span className="onoffswitch-inner" />
                                        <span className="onoffswitch-switch" />
                                    </label>
                                </div>
                                <span className="ml-2 text-muted small">{phoneNumber}</span>
                            </div>
                        </div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <button className="btn btn-success  btn-not-rounded mr-1 ml-2 mb-2" type="button" onClick={this.handleTaskSave}>
                        Save
                    </button>
                    <button className="btn btn-info  btn-not-rounded mb-2" type="button" onClick={this.props.handleCloseSendtoInterviewModal}>
                        Cancel
                    </button>
                </DialogActions>
            </Dialog>
        </Fragment>
    }
}

export default withApollo(withStyles(styles)(withGlobalContent(SendtoInterviewModal)));
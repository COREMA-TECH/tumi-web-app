import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withApollo } from 'react-apollo';
import { GET_HOTEL_QUERY, GET_POSITION_BY_QUERY, GET_RECRUITER, GET_CONTACT_BY_QUERY } from './queries';
import { CREATE_WORKORDER, UPDATE_WORKORDER, CONVERT_TO_OPENING } from './mutations';
import ShiftsData from '../../data/shitfsWorkOrder.json';
//import ShiftsData from '../../data/shitfs.json';
import { parse } from 'path';
import { bool } from 'prop-types';
import AutosuggestInput from 'ui-components/AutosuggestInput/AutosuggestInput';
import TimeField from 'react-simple-timefield';

class WorkOrdersForm extends Component {
    _states = {
        id: null,
        hotel: 0,
        IdEntity: null,
        date: new Date().toISOString().substring(0, 10),
        quantity: 0,
        status: 1,
        shift: '',
        endShift: '',
        startDate: '',
        endDate: '',
        needExperience: false,
        needEnglish: false,
        comment: '',
        EspecialComment: '',
        position: 0,
        PositionRateId: null,
        RecruiterId: null,
        contactId: null,
        userId: localStorage.getItem('LoginId'),
        ShiftsData: ShiftsData,
        saving: false,
        isAdmin: Boolean(localStorage.getItem('IsAdmin'))

    };

    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            hotels: [],
            positions: [],
            recruiters: [],
            contacts: [],
            ...this._states
        };
    }

    ReceiveStatus = false;

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.item && !this.state.openModal) {
            this.setState(
                {
                    id: nextProps.item.id,
                    contactId: nextProps.item.contactId,
                    IdEntity: nextProps.item.IdEntity,
                    date: nextProps.item.date,
                    quantity: nextProps.item.quantity,
                    status: nextProps.item.status,
                    shift: nextProps.item.shift,
                    endShift: nextProps.item.endShift,
                    startDate: nextProps.item.startDate,
                    endDate: nextProps.item.endDate,
                    needExperience: nextProps.item.needExperience,
                    needEnglish: nextProps.item.needEnglish,
                    comment: nextProps.item.comment,
                    userId: localStorage.getItem('LoginId'),
                    openModal: nextProps.openModal,
                    EspecialComment: nextProps.item.EspecialComment
                    //isAdmin: Boolean(localStorage.getItem('IsAdmin'))
                },
                () => {
                    this.getPositions(nextProps.item.IdEntity, nextProps.item.PositionRateId);
                    this.getContacts(nextProps.item.IdEntity);
                    this.getRecruiter();

                    this.ReceiveStatus = true;
                }
            );
        } else if (!this.state.openModal) {
            this.setState({
                IdEntity: 0,
                date: new Date().toISOString().substring(0, 10),
                quantity: 0,
                status: 0,
                shift: '',
                endShift: '',
                startDate: '',
                endDate: '',
                needExperience: false,
                needEnglish: false,
                comment: '',
                EspecialComment: '',
                PositionRateId: 0,
                contactId: 0,
                userId: localStorage.getItem('LoginId'),
                isAdmin: Boolean(localStorage.getItem('IsAdmin'))
            });
        }
        this.setState({
            openModal: nextProps.openModal
        });
    }

    UNSAFE_componentWillMount() {

        this.props.client
            .query({
                query: GET_HOTEL_QUERY
            })
            .then(({ data }) => {
                this.setState({
                    hotels: data.getbusinesscompanies
                });
            })
            .catch();

        this.setState({
            openModal: this.props.openModal

        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        if (
            this.state.IdEntity == 0 ||
            this.state.PositionRateId == 0 ||
            this.state.quantity == '' ||
            this.state.quantity == 0 ||
            this.state.date == '' ||
            this.state.startDate == '' ||
            this.state.endDate == '' ||
            this.state.shift == '' ||
            this.state.shift == 0 ||
            this.state.endShift == '' ||
            this.state.endShift == 0 ||
            this.state.contactId == ''
        ) {

            this.props.handleOpenSnackbar('error', 'Error all fields are required');
        } else {
            this.setState({ saving: true });
            if (this.state.id == null) this.add();
            else this.update();
        }
    };

    add = () => {
        this.props.client
            .mutate({
                mutation: CREATE_WORKORDER,
                variables: {
                    workOrder: {
                        IdEntity: this.state.IdEntity,
                        //contactId: this.state.contactId
                        date: this.state.date,
                        quantity: this.state.quantity,
                        status: 1,
                        shift: this.state.shift,
                        endShift: this.state.endShift,
                        startDate: this.state.startDate,
                        endDate: this.state.endDate,
                        needExperience: this.state.needExperience,
                        needEnglish: this.state.needEnglish,
                        comment: this.state.comment,
                        EspecialComment: this.state.EspecialComment,
                        PositionRateId: this.state.PositionRateId,
                        contactId: this.state.contactId,
                        userId: this.state.userId
                    }
                }
            })
            .then((data) => {
                this.props.handleOpenSnackbar('success', 'Record Inserted!');
                this.setState({ openModal: false, saving: false });
                window.location.reload();
            })
            .catch((error) => {
                this.setState({ saving: true });
                this.props.handleOpenSnackbar('error', 'Error: ' + error);
            });
    };

    update = (status = 1) => {
        this.props.client
            .mutate({
                mutation: UPDATE_WORKORDER,
                variables: {
                    workOrder: {
                        id: this.state.id,
                        IdEntity: this.state.IdEntity,
                        date: this.state.date,
                        quantity: this.state.quantity,
                        status: status,
                        shift: this.state.shift,
                        endShift: this.state.endShift,
                        startDate: this.state.startDate,
                        endDate: this.state.endDate,
                        needExperience: this.state.needExperience,
                        needEnglish: this.state.needEnglish,
                        comment: this.state.comment,
                        EspecialComment: this.state.EspecialComment,
                        PositionRateId: this.state.PositionRateId,
                        userId: this.state.userId,
                        contactId: this.state.contactId
                    }
                }
            })
            .then((data) => {
                this.props.handleOpenSnackbar('success', 'Record Updated!');
                this.setState({ openModal: false, saving: false, converting: false });
                window.location.reload();
            })
            .catch((error) => {
                this.setState({ saving: true, converting: false });
                this.props.handleOpenSnackbar('error', 'Error: ' + error);
            });
    };

    getContacts = (id) => {
        this.props.client
            .query({
                query: GET_CONTACT_BY_QUERY,
                variables: { id: id }
            })
            .then(({ data }) => {
                this.setState({
                    contacts: data.getcontacts
                });
            })
            .catch();
    };

    handleChangeState = (event) => {
        event.preventDefault();
        if (
            this.state.IdEntity == 0 ||
            this.state.PositionRateId == 0 ||
            this.state.contactId == 0 ||
            this.state.quantity == '' ||
            this.state.quantity == 0 ||
            this.state.date == '' ||
            this.state.startDate == '' ||
            this.state.endDate == '' ||
            this.state.shift == '' ||
            this.state.shift == 0 ||
            this.state.endShift == '' ||
            this.state.endShift == 0
        ) {
            this.props.handleOpenSnackbar('error', 'Error all fields are required');
        } else {
            this.setState({ converting: true });
            // this.update(2);
            this.CONVERT_TO_OPENING();
        }
    };

    CONVERT_TO_OPENING = () => {
        this.props.client
            .mutate({
                mutation: CONVERT_TO_OPENING,
                variables: {
                    id: this.state.id,
                    userId: this.state.userId,
                }
            })
            .then((data) => {
                this.props.handleOpenSnackbar('success', 'Record Updated!');
                this.setState({ openModal: false, saving: false, converting: false });
                window.location.reload();
            })
            .catch((error) => {
                this.setState({ saving: true, converting: false });
                this.props.handleOpenSnackbar('error', 'Error: ' + error);
            });
    };

    handleChange = (event) => {
        console.log("veamos el evento ", event);
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let comments = '';

        // console.log("veamos el evento target ", target, " value ", value, " name ", name);
        this.setState({
            [name]: value
        });

        if (name === 'PositionRateId') {
            comments = this.state.positions.find((item) => { return item.Id == value })
            this.setState({
                EspecialComment: comments != null ? comments.Comment : ''
            });
        }

        if (name === 'IdEntity') {
            this.getPositions(value);
            this.getContacts(value);
        }
    };

    getPositions = (id, PositionId = null) => {
        this.props.client
            .query({
                query: GET_POSITION_BY_QUERY,
                variables: { id: id }
            })
            .then(({ data }) => {
                console.log("positions ", data.getposition)
                this.setState({
                    positions: data.getposition,
                    PositionRateId: PositionId
                    //EspecialComment: data.getposition[0].Comment
                });
            })
            .catch();
    };

    getRecruiter = () => {
        this.props.client
            .query({
                query: GET_RECRUITER,
                variables: {}
            })
            .then(({ data }) => {
                this.setState({
                    recruiters: data.getusers

                });
            })
            .catch();
    };

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

    handleTimeChange = (name) => (text) => {
        this.setState({ [name]: text })
    }

    handleValidate = (event) => {
        let selfHtml = event.currentTarget;
        if (selfHtml.value == "" || selfHtml.value == 0)
            selfHtml.classList.add("is-invalid");
        else
            selfHtml.classList.remove("is-invalid");

    }

    render() {

        const isAdmin = localStorage.getItem('IsAdmin') == "true"

        return (

            <div>
                <Dialog maxWidth="md" open={this.state.openModal} onClose={this.props.handleCloseModal}>
                    <DialogTitle style={{ padding: '0px' }}>
                        <div className="modal-header">
                            <h5 className="modal-title">Work Order</h5>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <form action="" onSubmit={this.handleSubmit}>
                            <div className="row pl-0 pr-0">
                                <div className="col-md-7 col-7">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <label htmlFor="">Hotel</label>
                                            <select
                                                required
                                                name="IdEntity"
                                                className="form-control"
                                                id=""
                                                onChange={this.handleChange}
                                                value={this.state.IdEntity}
                                                disabled={!isAdmin}
                                                onBlur={this.handleValidate}
                                            >
                                                <option value={0}>Select a Hotel</option>
                                                {this.state.hotels.map((hotel) => (
                                                    <option value={hotel.Id}>{hotel.Name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="">Requested by</label>
                                            <select
                                                required
                                                name="contactId"
                                                className="form-control"
                                                id=""
                                                onChange={this.handleChange}
                                                value={this.state.contactId}
                                                disabled={!isAdmin}
                                                onBlur={this.handleValidate}
                                            >
                                                <option value={0}>Select a Contact</option>
                                                {this.state.contacts.map((contact) => (
                                                    <option value={contact.Id}>{contact.First_Name + contact.Last_Name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="">Position</label>
                                            <select
                                                required
                                                name="PositionRateId"
                                                className="form-control"
                                                id=""
                                                onChange={this.handleChange}
                                                value={this.state.PositionRateId}
                                                onBlur={this.handleValidate}
                                            >
                                                <option value="0">Select a Position</option>
                                                {this.state.positions.map((position) => (
                                                    <option value={position.Id}>{position.Position}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="">Requested on Date</label>
                                            <input
                                                required
                                                type="date"
                                                className="form-control"
                                                name="date"
                                                disabled={true}
                                                onChange={this.handleChange}
                                                value={this.state.date.substring(0, 10)}
                                                onBlur={this.handleValidate}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="">Shift Start</label>
                                            <TimeField name="shift" style={{ width: '100%' }} className="form-control" value={this.state.shift} onChange={this.handleTimeChange('shift')} />
                                            {/* 
                                            <select
                                                required
                                                className="form-control"
                                                name="shift"
                                                onChange={this.handleChange}
                                                value={this.state.shift}
                                                onBlur={this.handleValidate}
                                            >
                                                <option value="0">Select a Shift</option>
                                                {this.state.ShiftsData.map((shift) => (
                                                    <option value={shift.Id}>{shift.Name}</option>
                                                ))}
                                            </select>
                                            */}

                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="">Shift End</label>
                                            <TimeField name="endShift" style={{ width: '100%' }} className="form-control" value={this.state.endShift} onChange={this.handleTimeChange('endShift')} />
                                            {/*
                                        <select
                                                required
                                                className="form-control"
                                                name="endShift"
                                                onChange={this.handleChange}
                                                value={this.state.endShift}
                                                onBlur={this.handleValidate}
                                            >
                                                <option value="0">Select a Shift End</option>
                                                {this.state.ShiftsData.map((shift) => (
                                                    <option value={shift.Id}>{shift.Name}</option>
                                                ))}
                                            </select>
                                        */}

                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="">From Date</label>
                                            <input
                                                required
                                                type="date"
                                                className="form-control"
                                                name="startDate"
                                                onChange={this.handleChange}
                                                value={this.state.startDate.substring(0, 10)}
                                                onBlur={this.handleValidate}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="">To Date</label>
                                            <input
                                                required
                                                type="date"
                                                className="form-control"
                                                name="endDate"
                                                onChange={this.handleChange}
                                                value={this.state.endDate.substring(0, 10)}
                                                onBlur={this.handleValidate}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label htmlFor="">Quantity</label>
                                            <input
                                                required
                                                type="number"
                                                maxLength="10"
                                                min={0}
                                                className="form-control"
                                                name="quantity"
                                                onChange={this.handleChange}
                                                value={this.state.quantity}
                                                onBlur={this.handleValidate}
                                            />
                                        </div>
                                        {this.state.id && (
                                            <div className="col-md-6">
                                                <label htmlFor="">Assign to</label>
                                                <select
                                                    required
                                                    name="RecruiterId"
                                                    className="form-control"
                                                    id=""
                                                    onChange={this.handleChange}
                                                    value={this.state.RecruiterId}
                                                    onBlur={this.handleValidate}
                                                >
                                                    <option value="0">Select a Recruiter</option>
                                                    {this.state.recruiters.map((recruiter) => (
                                                        < option value={recruiter.Id} > {recruiter.Full_Name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-5 col-5">
                                    <div className="row">
                                        <div className="col-md-5">
                                            <label>Needs Experience?</label>
                                            <div className="onoffswitch">
                                                <input
                                                    type="checkbox"
                                                    name="needExperience"
                                                    onClick={this.toggleState}
                                                    onChange={this.handleChange}
                                                    className="onoffswitch-checkbox"
                                                    id="myonoffswitch"
                                                    checked={this.state.needExperience}
                                                />
                                                <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                                    <span className="onoffswitch-inner" />
                                                    <span className="onoffswitch-switch" />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-7">
                                            <label>Needs to Speak English?</label>
                                            <div className="onoffswitch">
                                                <input
                                                    type="checkbox"
                                                    name="needEnglish"
                                                    onClick={this.toggleState}
                                                    onChange={this.handleChange}
                                                    className="onoffswitch-checkbox"
                                                    id="myonoffswitchSpeak"
                                                    checked={this.state.needEnglish}
                                                />
                                                <label className="onoffswitch-label" htmlFor="myonoffswitchSpeak">
                                                    <span className="onoffswitch-inner" />
                                                    <span className="onoffswitch-switch" />
                                                </label>
                                            </div>
                                        </div>

                                        <div className="col-md-12">
                                            <label htmlFor="">Comments</label>
                                            <textarea
                                                onChange={this.handleChange}
                                                name="comment"
                                                className="form-control"
                                                id=""
                                                cols="30"
                                                rows="3"
                                                value={this.state.comment}
                                            />
                                        </div>
                                        <div className="col-md-12">
                                            <label htmlFor="">Special Comments</label>
                                            <textarea
                                                onChange={this.handleChange}
                                                name="EspecialComment"
                                                className="form-control"
                                                id=""
                                                cols="30"
                                                rows="3 "
                                                disabled={true}
                                                value={this.state.EspecialComment}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="col-md-6">
                                            {/*this.state.id && (
                                                <div class="input-group">
                                                    <select
                                                        required
                                                        name="RecruiterId"
                                                        className="form-control"
                                                        id=""
                                                        onChange={this.handleChange}
                                                        value={this.state.RecruiterId}
                                                        onBlur={this.handleValidate}
                                                    >
                                                        <option value="0">Select a Recruiter</option>
                                                        {this.state.recruiters.map((recruiter) => (
                                                            < option value={recruiter.Id} > {recruiter.Full_Name}</option>
                                                        ))}
                                                    </select>

                                                    <div class="input-group-append">
                                                        <button
                                                            className="btn btn-info float-right"
                                                            type="button"
                                                            onClick={this.handleChangeState}
                                                        >
                                                            Create Opening
														</button>
                                                    </div>
                                                </div>
                                                        )*/}
                                        </div>
                                        <div className="col-md-12">
                                            <button
                                                className="btn btn-danger ml-1 float-right"
                                                onClick={this.props.handleCloseModal}
                                            >
                                                Cancel<i class="fas fa-ban ml-2" />
                                            </button>
                                            <button className="btn btn-success ml-1 float-right" type="submit">
                                                Save {!this.state.saving && <i class="fas fa-save ml2" />}
                                                {this.state.saving && <i class="fas fa-spinner fa-spin  ml2" />}
                                            </button>
                                            {this.state.id && (
                                                /*<button className="btn btn-info ml-1 float-right" type="submit">
                                                    Convert to Opening {!this.state.saving && <i class="fas fa-sync-alt"></i>}
                                                    {this.state.saving && <i class="fas fa-spinner fa-spin  ml2" />}
                                                </button>*/

                                                <button
                                                    className="btn btn-info float-right"
                                                    type="button"
                                                    onClick={this.handleChangeState}
                                                >
                                                    Convert to Opening {!this.state.converting && <i class="fas fa-sync-alt"></i>}
                                                    {this.state.converting && <i class="fas fa-spinner fa-spin  ml2" />}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div >
        );
    }
}

export default (withMobileDialog()(withApollo(WorkOrdersForm)));

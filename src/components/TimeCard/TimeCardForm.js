import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { withApollo } from 'react-apollo';
import { FETCH_SINGLE_MARK, GET_HOTEL_QUERY, GET_EMPLOYEES, GET_POSITION_BY_QUERY, GET_CONTACT_BY_QUERY, GET_PREVIOUS_MARK } from './queries';
import { ADD_MARCKED, UPDATE_MARK, CREATE_NEW_MARK } from './mutations';
import PropTypes from 'prop-types';
import moment from 'moment';
import Datetime from 'react-datetime';
import DatePicker from "react-datepicker";

import makeAnimated from "react-select/lib/animated";
import Select from 'react-select';

const styles = (theme) => ({
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative'
    },
    buttonSuccess: {},
    buttonProgress: {
        //color: ,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default
        },
        '&:hover': {
            cursor: 'pointer'
        }
    }

});


class TimeCardForm extends Component {
    DEFAULT_STATE = {
        id: null,
        clockInId: null,
        clockOutId: null,
        entityId: null,
        EmployeeId: null,
        startDate: '',
        endDate: '',
        employees: [],
        positions: [],
        positionId: 0,
        newMark: false,
        readOnly: false,

        inboundMarkTypeId: 30570, //Shift Start
        inboundMarkTime: moment('08:00', "HH:mm").format("HH:mm"),
        outboundMarkTypeId: 30571, //Shift End
        outboundMarkTime: moment('16:00', "HH:mm").format("HH:mm"),

        notes: '',
        currentlyWorking: false,
    };

    constructor(props) {
        super(props);
        this.state = {

            hotels: [],
            positions: [],
            recruiters: [],
            contacts: [],
            Shift: [],

            ...this.DEFAULT_STATE
        };

    }

    ReceiveStatus = false;

    componentWillReceiveProps(nextProps) {
        const {markId} = nextProps.item;        
        
        if(markId && nextProps.markId !== this.state.id && nextProps.openModal){
            this.props.client.query({
                query: FETCH_SINGLE_MARK,
                fetchPolicy: 'no-cache',
                variables: {
                    id: markId
                }
            })
            .then(({data: {mark}}) => {
                const {id, entityId, markedDate, inboundMarkTypeId, inboundMarkTime, outboundMarkTypeId, outboundMarkTime, positionId, EmployeeId, notes} = mark;                
                this.setState({
                    id,                    
                    entityId,
                    positionId: !positionId ? -1 : positionId,
                    EmployeeId,
                    startDate: markedDate,
                    endDate: markedDate,
                    
                    inboundMarkTypeId,
                    inboundMarkTime,
                    outboundMarkTypeId,
                    outboundMarkTime,
                    
                    notes,
                    currentlyWorking: !!!outboundMarkTypeId,
                    newMark: (outboundMarkTime === 'Now' || outboundMarkTime === "24:00") ? true : false,
                    readOnly: false,
                }, _ => {
                    this.calculateHours();
                    this.getPositions(this.state.entityId);
                    this.getHotels();
                    this.getEmployees();
                });
            })
            .catch(error => {
                this.props.handleOpenSnackbar('error', 'Failed to fetch mark info.');       
                console.log(error);
            })
        } if (!nextProps.openModal) {
            this.setState({
                ...this.DEFAULT_STATE
            });
        } else {
            this.getHotels();
            this.getEmployees();
        }       
        
    }

    componentWillMount() {
        this.getHotels();
        this.getEmployees();
    }

    handleCloseModal = (event) => {
        this.setState({
            ...this.DEFAULT_STATE
        });
        this.props.handleCloseModal(event);
    }    

    handleSubmit = async (event) => {
        event.preventDefault();
        if (this.state.entityId == null || this.state.positionId === null || this.state.startDate == '') {
            this.props.handleOpenSnackbar('error', 'Error all fields are required');
            return;
        } 
        
        this.setState({ saving: true });
        const { entityId, positionId, startDate, EmployeeId, notes, inboundMarkTypeId, inboundMarkTime, outboundMarkTypeId, outboundMarkTime } = this.state;         

        let mark = {
            entityId: entityId === 0 ? 180 : entityId,
            markedDate: startDate,
            inboundMarkTypeId: inboundMarkTypeId,
            inboundMarkTime: inboundMarkTime,
            outboundMarkTypeId: outboundMarkTypeId,
            outboundMarkTime: outboundMarkTime,
            EmployeeId: EmployeeId,
            notes: notes,
            positionId: positionId === -1 ? null : positionId,
        }
        
        if (this.state.id === null) {
            this.saveMark(mark);
        } else {
            const editMark = {...mark, id: this.state.id};
            this.updateMark(editMark);
        }
    };

    saveMark = async mark => {
        const isLunchBreak = this.state.positionId === -1;
        let markToEdit = null, fetchError = '';

        if(isLunchBreak){
            const {error, data: {previousMark: previousMark}} = await this.props.client.query({
                query: GET_PREVIOUS_MARK,
                variables: {
                    entityId: mark.entityId,
                    EmployeeId: mark.EmployeeId,
                    markedDate: mark.markedDate
                },
                fetchPolicy: "no-cache"
            });

            markToEdit = {...previousMark};
            fetchError = error;
        }

        this.props.client.mutate({
            mutation: CREATE_NEW_MARK,
            variables: {
                input: mark
            }
        }).then(() => {            
            this.props.handleOpenSnackbar('success', 'Record Inserted!');
            
            if(isLunchBreak){
                if(fetchError){
                    this.setState({ saving: false });
                    this.props.handleOpenSnackbar('error', 'Something went wrong.');
                    return;
                }

                if(!markToEdit){
                    //Saved new mark, but there was no need to update a previous mark
                    this.props.toggleRefresh();
                    this.setState({ saving: false }, () => {
                        this.handleCloseModal();                                        
                    });   
                    
                    return;
                }

                const updatedMark = {...markToEdit, outboundMarkTime: mark.inboundMarkTime, outboundMarkTypeId: mark.inboundMarkTypeId};
                delete updatedMark.__typename;

                this.updateMark(updatedMark);
            } 
            
            else {
                this.props.toggleRefresh();
                this.setState({ saving: false }, () => {
                    this.handleCloseModal();                                        
                });    
            }            
        })

        .catch(() => {
            this.setState({ saving: false });
            this.props.handleOpenSnackbar('error', 'Something went wrong.');
        });
    }

    updateMark = (mark) => {
        if (!mark) return;
        
        this.props.client
            .mutate({
                mutation: UPDATE_MARK,
                variables: {
                    MarkedEmployees: mark
                }
            })
            .then(() => {
                this.props.handleOpenSnackbar('success', 'Record Updated!');
                this.props.toggleRefresh();
                this.setState({ saving: false }, () => {
                    this.handleCloseModal();                                        
                });                
            })
            .catch((error) => {
                this.setState({ saving: false });
                this.props.handleOpenSnackbar('error', 'Error: ' + error);
            });
    }        

    getContacts = (id) => {
        this.props.client
            .query({
                query: GET_CONTACT_BY_QUERY,
                variables: { id: id }
            })
            .then(({ data }) => {
                var request = data.getcontacts.find((item) => { return item.Id == this.state.contactId })
                this.setState({
                    contacts: data.getcontacts,
                    Electronic_Address: request != null ? request.Electronic_Address : '',
                    departmentId: request != null ? request.Id_Deparment : 0
                });

            })
            .catch();
    };

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;       

        this.setState({
            [name]: value
        });

        if (name === 'entityId') {
            this.getPositions(value);
            this.getContacts(value);
        }
    };

    getPositions = (id) => {
        this.props.client
            .query({
                query: GET_POSITION_BY_QUERY,
                variables: { id: id }
            })
            .then(({ data }) => {
                this.setState({
                    positions: data.getposition
                }, _ => {
                    
                });
            })
            .catch();
    };   

    getEmployees = () => {
        this.props.client
            .query({
                query: GET_EMPLOYEES
            })
            .then(({ data }) => {
                this.setState({ employees: data.employees })
            })
            .catch();
    };


    getHotels = () => {
        this.props.client
            .query({
                query: GET_HOTEL_QUERY,
                variables: { Id: localStorage.getItem('LoginId') }
            })
            .then(({ data }) => {
                this.setState({
                    hotels: data.companiesByUser
                });
            })
            .catch();
    };

    handleTimeChange = (name) => (text) => {
        this.setState({
            [name]: moment(text, "HH:mm:ss").format("HH:mm")
        }, () => {
            this.calculateHours()
        })
    }

    handleValidate = (event) => {
        let selfHtml = event.currentTarget;
        if (selfHtml.value == "" || selfHtml.value == 0 || selfHtml.value == null)
            selfHtml.classList.add("is-invalid");
        else
            selfHtml.classList.remove("is-invalid");

    }

    handleCalculatedByDuration = (event) => {
        const target = event.target;
        const value = target.value;
        const startHour = this.state.inboundMarkTime;

        var endHour = moment(new Date("01/01/1990 " + startHour), "HH:mm:ss").add(parseFloat(value), 'hours').format('HH:mm');
        var _moment = moment(new Date("01/01/1990 " + startHour), "HH:mm:ss").add(8, 'hours').format('HH:mm');
        var _endHour = (value == 0) ? _moment : endHour;

        this.setState({
            outboundMarkTime: _endHour,
            duration: value
        });
    }

    calculateHours = () => {
        let startHour = this.state.inboundMarkTime;
        let endHour = this.state.outboundMarkTime;

        var duration = moment.duration(moment.utc(moment(endHour, "HH:mm:ss").diff(moment(startHour, "HH:mm:ss"))).format("HH:mm")).asHours();
        duration = parseFloat(duration).toFixed(2);

        this.setState({
            duration: duration
        });
    }    

    DisabledTimeOut = ({ target: { checked } }) => {
        if (checked) {
            this.setState({
                currentlyWorking: true,
                endDate: "",
                outboundMarkTime: null,
                inboundMarkTypeId: 30570, /* Shift Start */
                outboundMarkTypeId: 30571 /* Shift End */
            });
        } else {
            this.setState({
                currentlyWorking: false,
                outboundMarkTime: '16:00'
            }, _ => { this.calculateHours() });
        }
    }

    handleChangeDate = (date) => {
        let endDate = date; //moment(date).add(7, "days").format();

        this.setState({
            startDate: date,
            endDate: endDate
        });
    }

    handleChangeEndDate = (date) => {
        let endDate = date;

        this.setState({
            endDate: endDate
        });
    }

    //#region Filters
    getPropertyFilterList = _ => {
        const propertyList = this.state.hotels.map(item => {
            return { value: item.Id, label: item.Name }
        });

        const options = [{ value: 0, label: "Select a Property" }, ...propertyList];
        return options;
    }

    getEmployeeFilterList = _ => {
        const employeeList = this.state.employees.map(item => {
            return { value: item.id, label: item.firstName + " " + item.lastName }
        });

        const options = [{ value: 0, label: "Select a Property" }, ...employeeList];
        return options;
    }

    getPositionFilterList = _ => {
        const positionList = this.state.positions.map(item => {
            return { value: item.Id, label: item.Position }
        });

        const options = [{ value: 0, label: "Select a Position" }, { value: -1, label: "Lunch Break" }, ...positionList];
        return options;
    }

    handlePropertySelectChange = ({ value }) => {
        this.setState(() => {
            let hotel = this.state.hotels.find(_ => {
                return _.Id === parseInt(value)
            })
            return { entityId: value, propertyStartWeek: hotel ? hotel.Start_Week : null }
        }, _ => {
            this.getPositions(parseInt(value));
        });
    }

    handleEmployeeSelectChange = ({ value }) => {
        this.setState(() => {
            return { EmployeeId: value }
        });
    }

    handlePositionChange = ({ value }) => {
        this.setState(() => {
            return { positionId: value }
        }, _ => {
            if(value === -1){
                this.setState(_ => {
                    return { inboundMarkTypeId: 30572 /* break in */, outboundMarkTypeId: 30573 /* break out */ }
                })
            }
        });
    }

    findSelectedProperty = propertyId => {
        const defValue = { value: 0, label: "Select a Property" };

        if (propertyId === 'null' || propertyId === 0)
            return defValue;

        const found = this.state.hotels.find(item => {
            return parseInt(item.Id) === parseInt(propertyId);
        });

        return found ? { value: found.Id, label: found.Name.trim() } : defValue;
    }

    findSelectedEmployee = EmployeeId => {
        const defValue = { value: 0, label: "Select a Employee" };

        if (EmployeeId === 'null' || EmployeeId === 0)
            return defValue;

        const found = this.state.employees.find(item => {
            return item.id === EmployeeId;
        });

        return found ? { value: found.id, label: found.firstName.trim() + " " + found.lastName.trim() } : defValue;
    }

    findSelectedPosition = positionId => {
        const defValue = { value: 0, label: "Select a Position" };
        const lunch = { value: -1, label: "Lunch Break" };

        if (positionId === 'null' || positionId === 0)
            return defValue;

        if(positionId === -1)
            return lunch;

        const found = this.state.positions.find(item => {
            return item.Id === positionId;
        });

        return found ? { value: found.Id, label: found.Position.trim() } : defValue;
    }
    //#endregion   

    render() {
        const propertyList = this.getPropertyFilterList();
        const employeeList = this.getEmployeeFilterList();
        const positionList = this.getPositionFilterList();

        const { readOnly } = this.state;

        return (
            <div>
                <Dialog fullScreen={false} maxWidth='sm' open={this.props.openModal} >
                    <form action="" onSubmit={this.handleSubmit}>
                        <DialogTitle style={{ padding: '0px' }}>
                            <div className="modal-header">
                                {
                                    readOnly
                                        ? <p className="modal-title alert alert-success d-flex flex-row">
                                            <i class="fas fa-fw fa-exclamation-circle mr-3 align-self-center"></i>
                                            <div>
                                                This timesheet has been approved and cannot be edited. A manager must unapprove the day or week this timesheet falls in before it can be edited.
                                                </div>
                                        </p>
                                        : <h5 className="modal-title">Add Time +</h5>
                                }
                            </div>
                            <div className="container">
                                <div className="row">
                                    <div className="col-md-6">
                                        <Select
                                            options={propertyList}
                                            value={this.findSelectedProperty(this.state.entityId)}
                                            onChange={this.handlePropertySelectChange}
                                            closeMenuOnSelect={true}
                                            components={makeAnimated()}
                                            isMulti={false}
                                            onBlur={this.handleValidate}
                                            className="WorkOrders-dropdown"
                                            isDisabled={readOnly}
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <Select
                                            options={employeeList}
                                            value={this.findSelectedEmployee(this.state.EmployeeId)}
                                            onChange={this.handleEmployeeSelectChange}
                                            closeMenuOnSelect={true}
                                            components={makeAnimated()}
                                            isMulti={false}
                                            onBlur={this.handleValidate}
                                            className="WorkOrders-dropdown"
                                            isDisabled={readOnly}
                                        />
                                    </div>
                                </div>
                            </div>
                        </DialogTitle>
                        <DialogContent style={{ backgroundColor: "#f5f5f5" }}>
                            <div className="card">
                                <div className="container">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <div class="input-group flex-nowrap">
                                                <DatePicker
                                                    selected={this.state.startDate}
                                                    onChange={this.handleChangeDate}
                                                    placeholderText="Date In"
                                                    id="datepickerIn"
                                                    disabled={readOnly}
                                                />
                                                <div class="input-group-append">
                                                    <label class="input-group-text" id="addon-wrapping" for="datepickerIn">
                                                        <i class="far fa-calendar"></i>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div class="input-group flex-nowrap">
                                                <DatePicker
                                                    selected={this.state.endDate}
                                                    onChange={this.handleChangeEndDate}
                                                    placeholderText="Date Out"
                                                    id="datepickerOut"
                                                    disabled={readOnly || this.state.currentlyWorking}
                                                />
                                                <div class="input-group-append">
                                                    <label class="input-group-text" id="addon-wrapping" for="datepickerOut">
                                                        <i class="far fa-calendar"></i>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <span className="float-left">
                                                <input type="checkbox" id="disabledTimeOut" name="disabledTimeOut" onChange={this.DisabledTimeOut} checked={this.state.currentlyWorking} disabled={readOnly} />
                                                <label htmlFor="">&nbsp; Currently working</label>
                                            </span>
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="">* Time In</label>
                                            <Datetime dateFormat={false} value={this.state.inboundMarkTime ? moment(this.state.inboundMarkTime, "HH:mm").format("hh:mm A") : ''} inputProps={{ name: "inboundMarkTime", required: true }} onChange={this.handleTimeChange('inboundMarkTime')} inputProps={{ disabled: readOnly }} />
                                        </div>
                                        <div className="col-md-4">
                                            <label htmlFor="">{!this.state.currentlyWorking ? "*" : ""} Time Out</label>
                                            <Datetime 
                                                dateFormat={false} 
                                                value={!this.state.currentlyWorking && this.state.outboundMarkTime ? moment(this.state.outboundMarkTime, "HH:mm").format("hh:mm A") : ''} 
                                                inputProps={{ name: "outboundMarkTime", required: !this.state.currentlyWorking, disabled: this.state.currentlyWorking }} 
                                                onChange={this.handleTimeChange('outboundMarkTime')} 
                                                inputProps={{ disabled: readOnly || this.state.currentlyWorking }}
                                             />
                                        </div>
                                        <div className="col-md-4">
                                            <input placeholder="Total Hours" type="text" className="MasterShiftForm-hour form-control" name="duration" value={this.state.duration} onChange={this.handleCalculatedByDuration} disabled={readOnly || this.state.currentlyWorking} />
                                        </div>
                                        <div className="col-md-12 mt-2">
                                            <Select
                                                options={positionList}
                                                value={this.findSelectedPosition(this.state.positionId)}
                                                onChange={this.handlePositionChange}
                                                closeMenuOnSelect={true}
                                                components={makeAnimated()}
                                                isMulti={false}
                                                className="WorkOrders-dropdown"
                                                isDisabled={readOnly}
                                            />
                                        </div>
                                        <div className="col-md-12 mt-2">
                                            <textarea
                                                onChange={this.handleChange}
                                                name="notes"
                                                className="form-control"
                                                id=""
                                                cols="30"
                                                rows="3"
                                                value={this.state.notes}
                                                placeholder="Notes"
                                                disabled={readOnly}
                                            />
                                        </div>
                                        <div className="col-md-12 text-right">
                                            <button
                                                type="button"
                                                className="btn btn-danger mr-1"
                                                onClick={this.handleCloseModal}
                                            >
                                                Cancel<i className="fas fa-ban ml-2" />
                                            </button>

                                            <button className="btn btn-success" type="submit" disabled={readOnly}>
                                                Save {!this.state.saving && <i className="fas fa-save ml2" />}
                                                {this.state.saving && <i className="fas fa-spinner fa-spin  ml2" />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent >
                    </form >
                </Dialog >
            </div >
        );
    }
}

TimeCardForm.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(withApollo(TimeCardForm));


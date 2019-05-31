import React, {Component} from 'react';

import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Dialog from "@material-ui/core/Dialog/Dialog";

import makeAnimated from "react-select/lib/animated";
import Select from 'react-select';

import Datetime from 'react-datetime';
import moment from 'moment';

const MONDAY = "MO", TUESDAY = "TU", WEDNESDAY = "WE", THURSDAY = "TH", FRIDAY = "FR", SATURDAY = "SA", SUNDAY = "SU"

class BreakRulesModal extends Component {
    INITIAL_STATE = {
        ruleName: '',
        code: '',
        
        lenght: 0,
        lenghtUnit: 'Hours',
        lenghtInHours: 0,
        
        selectedEmployees: [],
        employeeSelectOptions: [],
        
        placeBreakOptions: [
            { value: 'middle', label: 'Middle of Shift' },
            { value: 'specific', label: 'Specific Time' },
        ],

        lenghtOptions: [
            { value: 'Minutes', label: 'Minutes' },
            { value: 'Hours', label: 'Hours' },
        ],   
        
        isAutomaticBreak: true,
        isManualBreak: false,
        
        shiftReached: 0,
        shiftReachedUnit: 'Hours',
        shiftReachedInHours: 0,
        repeatBreak: false,
        
        selectedDays: 'MO,TU,WE,TH,FR,SA,SU',
        
        breakPlacement: 'middle',
        breakStartTime: '12:00',
    }

    constructor(props) {
        super(props);

        this.state = {
            ...this.INITIAL_STATE
        }
    }

    componentWillReceiveProps(nextProps) {
        let employeeSelectOptions = nextProps.employeeList.map(employee => {
            return { value: employee.id, key: employee.id, label: `${employee.firstName} ${employee.lastName}` }
        });

        this.setState({
            employeeSelectOptions
        })
    }

    //#region Day box control
    getWeekDayStyle = (dayName) => {
        return `btn btn-secondary RowForm-day ${this.state.selectedDays.includes(dayName) ? 'btn-success' : ''}`;
    }

    selectWeekDay = (dayName) => {
        if (this.state.selectedDays.includes(dayName))
            this.setState((prevState) => {
                return { selectedDays: prevState.selectedDays.replace(dayName, '') }
            })
        else
            this.setState((prevState) => {
                return { selectedDays: prevState.selectedDays.concat(dayName) }
            })
    }
    //#endregion

    //#region Handle Events
    handleClose = _ => {
        this.setState(_ => {
            return { ...this.INITIAL_STATE }
        }, _ => this.props.handleClose());
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        }, _ => {

            if(name === 'isAutomaticBreak' && value){
                this.setState({ isManualBreak: false })
            }

            if(name === 'isManualBreak' && value){
                this.setState({ isAutomaticBreak: false })
            }

            if(name === "shiftReached") {
                this.setShiftReachedHours(this.state.shiftReachedUnit);
            }

            if(name === "lenght") {
                this.setBreakLenghtHours(this.state.lenghtUnit);
            }
        });
    }

    handleTimeChange = text => {
        this.setState({
            breakStartTime: moment(text, "HH:mm:ss").format("HH:mm")
        });
    }

    handlePlaceBreakChange = ({value}) => {
        this.setState(_ => {
            return { breakPlacement: value }
        })
    }

    handleLenghtChange = ({value}) => {
        this.setState(_ => {
            return { lenghtUnit: value }
        }, this.setBreakLenghtHours(value))
    }

    handleShiftReachedChange = ({value}) => {
        this.setState(_ => {
            return { shiftReachedUnit: value }
        }, this.setShiftReachedHours(value))
    }

    handleChangeEmployeesSelect = (selectedEmployees) => {
        this.setState({ selectedEmployees });
    }    

    handleSubmit = e => {
        e.preventDefault();
        console.log(this.state);
    }
    //#endregion
    
    setShiftReachedHours = unit => {            
        //Lenght will be saved in hours, for ease of conversion            
        let shiftReachedInHours = 0;
        
        switch (unit) {
            case 'Minutes':
                shiftReachedInHours = this.state.shiftReached / 60;
                break;
        
            case 'Hours':
                shiftReachedInHours = this.state.shiftReached;
                break;
            default:
                shiftReachedInHours = 0;
                break;
        }

        this.setState(_ => {
            return { shiftReachedInHours }
        });
    }

    setBreakLenghtHours = unit => {
            
        //Break lenght will be saved in hours, for ease of conversion            
        let lenghtInHours = 0;
        
        switch (unit) {
            case 'Minutes':
                lenghtInHours = this.state.lenght / 60;
                break;
        
            case 'Hours':
                lenghtInHours = this.state.lenght;
                break;

            default:
                lenghtInHours = 0;
                break;
        }

        this.setState(_ => {
            return { lenghtInHours }
        });
    }

    findSelectedLenght = option => {
        const found = this.state.lenghtOptions.find(item => {
            return item.value === option;
        });

        return found;
    }

    findSelectedBreakPlacement = option => {
        const found = this.state.placeBreakOptions.find(item => {
            return item.value === option;
        });

        return found;
    }   

    renderTimePicker = _ => {        
        return this.state.breakPlacement === 'specific' ? <Datetime dateFormat={false} value={moment(this.state.breakStartTime, "HH:mm").format("hh:mm A")} inputProps={{ name: "breakStartTime", required: true }} onChange={this.handleTimeChange} /> : '';
    }

    renderAutoBreakConfig = _ => {
        if(this.state.isAutomaticBreak){
            return(
                <React.Fragment>
                    <div className="AutoBreak">
                        <span className="AutoBreak-title d-block">When</span>
                        <label className="AutoBreak-reached"><span className="tumi-text-blue">Shift</span> has Reached</label>
                        
                        <div class="form-group form-row tumi-row-vert-center">
                            <div className="col-md-2">
                                <input value={this.state.shiftReached} min="1" step="1" pattern="[0-9]" name="shiftReached" onChange={this.handleChange} type="number" className="form-control" />
                            </div>
                            <div className="col-md-4">
                                <Select
                                    options={this.state.lenghtOptions}
                                    value={this.findSelectedLenght(this.state.shiftReachedUnit)}
                                    onChange={this.handleShiftReachedChange}
                                    closeMenuOnSelect={true}
                                    components={makeAnimated()}
                                    isMulti={false}                                                                          
                                />
                            </div>
                            <div className="col-md-6">
                                <div class="form-check">
                                    <input type="checkbox" value={this.state.repeatBreak} onChange={this.handleChange} checked={this.state.repeatBreak} name="repeatBreak" class="form-check-input" id="repeatBreak" />
                                    <label class="form-check-label" for="repeatBreak">{`Repeat Every ${this.state.shiftReached} ${this.state.shiftReachedUnit}`}</label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group form-row">
                            <div className="col-md-12">
                                <label className="AutoBreak-weekDays mb-2">Days of the Week</label>                                
                            </div>
                            <div className="col-md-12">
                                <div className="btn-group RowForm-days" role="group" aria-label="Basic example">
                                    <button type="button" className={this.getWeekDayStyle(MONDAY)} onClick={() => this.selectWeekDay(MONDAY)}>{MONDAY}</button>
                                    <button type="button" className={this.getWeekDayStyle(TUESDAY)} onClick={() => this.selectWeekDay(TUESDAY)}>{TUESDAY}</button>
                                    <button type="button" className={this.getWeekDayStyle(WEDNESDAY)} onClick={() => this.selectWeekDay(WEDNESDAY)}>{WEDNESDAY}</button>
                                    <button type="button" className={this.getWeekDayStyle(THURSDAY)} onClick={() => this.selectWeekDay(THURSDAY)}>{THURSDAY}</button>
                                    <button type="button" className={this.getWeekDayStyle(FRIDAY)} onClick={() => this.selectWeekDay(FRIDAY)}>{FRIDAY}</button>
                                    <button type="button" className={this.getWeekDayStyle(SATURDAY)} onClick={() => this.selectWeekDay(SATURDAY)}>{SATURDAY}</button>
                                    <button type="button" className={this.getWeekDayStyle(SUNDAY)} onClick={() => this.selectWeekDay(SUNDAY)}>{SUNDAY}</button>
                                </div>
                            </div>
                        </div>
                        <div className="AutoBreak-insert">
                            <span className="AutoBreak-title d-block">Insert Break</span>
                            <label className="AutoBreak-reached">Place Break at</label>
                            
                            <div className="form-group form-row">
                                <div className="col-md-6">
                                    <Select
                                        options={this.state.placeBreakOptions}
                                        value={this.findSelectedBreakPlacement(this.state.breakPlacement)}
                                        onChange={this.handlePlaceBreakChange}
                                        closeMenuOnSelect={true}
                                        components={makeAnimated()}
                                        isMulti={false}
                                    />
                                </div>   
                                <div className="col-md-6">
                                    { this.renderTimePicker() }
                                </div>                          
                            </div>                            
                        </div>
                    </div>
                </React.Fragment>
            );
        }
    }

    render() {
        return(
            <Dialog className="BreaksModal" fullWidth maxWidth="sm" open={this.props.openModal} onClose={this.handleClose}>
                <DialogTitle style={{ padding: '0px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Break Rule</h5>
                    </div>
                </DialogTitle>
                <DialogContent>
                   <form onSubmit={this.handleSubmit}>
                        <div className="form-row">
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label for="ruleName">Name</label>
                                    <input value={this.state.ruleName} onChange={this.handleChange} name="ruleName" type="text" className="form-control" id="ruleName"/>
                                </div>                            
                            </div>    
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label for="code">Code</label>
                                    <input value={this.state.code} onChange={this.handleChange} name="code" type="text" className="form-control" id="code"/>
                                </div>                            
                            </div>    
                        </div>
                        <div className="form-row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label for="lenght">Lenght</label>
                                    <input value={this.state.lenght} onChange={this.handleChange} name="lenght" type="number" min='1' step="1" pattern="[0-9]" className="form-control" id="lenght"/>
                                </div>                            
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <Select
                                        options={this.state.lenghtOptions}
                                        value={this.findSelectedLenght(this.state.lenghtUnit)}
                                        onChange={this.handleLenghtChange}
                                        closeMenuOnSelect={true}
                                        components={makeAnimated()}
                                        isMulti={false}
                                        className='BreaksModal-timeOpt'                                        
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group mb-0">
                                    <label className="d-block" for="">Type</label>
                                    <div className="BreaksModal-radioWrap">
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" onChange={this.handleChange} name="isPaid" id="isPaid" value="true" />
                                            <label className="form-check-label" for="isPaid">
                                                Paid
                                            </label>
                                        </div>

                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" onChange={this.handleChange} name="isPaid" id="isUnpaid" value="false" />
                                            <label className="form-check-label" for="isUnpaid">
                                                Unpaid
                                            </label>
                                        </div>
                                    </div>
                                </div>  
                            </div>
                        </div> 
                        {/* End Form Row */}
                        <div class="form-group row">
                            <label for="employeeSelect" class="col-md-2 col-form-label mt-0">Employees:</label>
                            <div class="col-md-10">
                                <div className="ScheduleWrapper">
                                    <Select
                                        className="EmployeeFilter"
                                        options={this.state.employeeSelectOptions}
                                        value={this.state.selectedEmployees}
                                        onChange={this.handleChangeEmployeesSelect}
                                        closeMenuOnSelect={false}    
                                        isMulti                                                                     
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="col-md-12 BreaksModal-checkWrapper">
                                <div class="form-check">
                                    <input type="checkbox" onChange={this.handleChange} name="isAutomaticBreak" checked={this.state.isAutomaticBreak} value={this.state.isAutomaticBreak} class="form-check-input" id="automaticBreak" />
                                    <label class="form-check-label" for="automaticBreak">Automatic Break</label>
                                </div>
                            </div>
                        </div>
                        {this.renderAutoBreakConfig()}
                        <div className="form-group form-row mt-2">
                            <div className="col-md-12 BreaksModal-checkWrapper">
                                <div class="form-check">
                                    <input type="checkbox" name="isManualBreak" onChange={this.handleChange} checked={this.state.isManualBreak} value={this.state.isManualBreak} class="form-check-input" id="manualBreak" />
                                    <label class="form-check-label" for="manualBreak">Manual Break - Employee can Start/Stop a Break</label>
                                </div>
                            </div>
                        </div>
                        <div className="BreaksModal-buttons">
                            <button type="submit" className="btn btn-success mr-2">Save</button>
                            <button type="reset" onClick={this.handleClose} className="btn btn-default BreaksModal-cancel">Cancel</button>                                                        
                        </div>
                   </form>
                </DialogContent>
            </Dialog>
        );
    }
}

export default BreakRulesModal;
import React, {Component, Fragment} from 'react';

const MONDAY = "MO", TUESDAY = "TU", WEDNESDAY = "WE", THURSDAY = "TH", FRIDAY = "FR", SATURDAY = "SA", SUNDAY = "SU";

class OvertimeRules extends Component{
    INITIAL_STATE = {
        days: '',
        multiplier: 1.00,
        startAfterHours: 8.0,
        type: "day"
    }

    constructor(props){
        super(props);
        this.state = {...this.INITIAL_STATE, ...props } 
    }    

    //#region Day box control
    getWeekDayStyle = (dayName) => {
        return `btn btn-secondary RowForm-day ${this.state.days.includes(dayName) ? 'btn-success' : ''}`;
    }

    selectWeekDay = (dayName) => {
        if (this.state.days.includes(dayName))
            this.setState((prevState) => {
                return { days: prevState.days.replace(dayName, '') }
            }, _ => {
                const {days, multiplier, startAfterHours, type} = this.state;
                this.props.setData(days, type, multiplier, startAfterHours);
            })
        else
            this.setState((prevState) => {
                return { days: prevState.days.concat(dayName) }
            }, _ => {
                const {days, multiplier, startAfterHours, type} = this.state;
                this.props.setData(days, type, multiplier, startAfterHours);
            })
    }
    //#endregion

    handleChange = ({target: {name, value, type, checked}}) => {
        this.setState(_ => ({
            [name]: type === "checkbox" ? checked : value
        }), _ => {
            const {days, multiplier, startAfterHours, type} = this.state;
            this.props.setData(days, type, multiplier, startAfterHours);
        });
    }

    render(){
        return(
            <Fragment>
                <div className="BRModal-section">
                    <div className="form-group form-row">
                        <div className="col-md-12 mb-1">
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
                    <div className="form-group form-row">
                        <div className="col-sm-2">
                            Type:
                        </div>
                        <div className="col-sm-10">
                            <div className="form-row">
                                <div className="d-inline-block mr-4">
                                    <div className="input-group" >
                                        <input type="radio" name="type" onChange={this.handleChange} id="typeday" value="day" checked={this.state.type === "day" ? true : false}/>
                                        <span className="pl-1">Day</span>                                        
                                    </div>  
                                </div>
                                <div className="d-inline-block mr-4">
                                    <div className="input-group" >
                                        <input type="radio" name="type" onChange={this.handleChange} id="typeweek" value="week" checked={this.state.type === "week" ? true : false}/>
                                        <span className="pl-1">Week</span>                                        
                                    </div>  
                                </div>
                                <div className="d-inline-block mr-4">
                                    <div className="input-group" >
                                        <input type="radio" name="type" onChange={this.handleChange} id="typeholiday" value="holiday" checked={this.state.type === "holiday" ? true : false}/>
                                        <span className="pl-1">Holiday</span>                                        
                                    </div>  
                                </div>                                  
                            </div>
                        </div>
                    </div>
                    <div className="form-group form-row tumi-row-vert-center">
                        <label className="col-sm-2">Pay Rate</label>
                        <div className="col-sm-10">
                            <div className="form-row">
                                <input className="form-control col-sm-2 text-center" value={this.state.multiplier} onChange={this.handleChange} name="multiplier" type="number" min='1' step="0.01" id="multiplier"/>
                            </div>
                        </div>                                
                    </div>
                    <div className="form-group form-row tumi-row-vert-center">
                        <label className="col-sm-2">Start After</label>
                        <div className="col-sm-10">
                            <div className="form-row">
                                <input className="form-control col-sm-2 text-center" value={this.state.startAfterHours} onChange={this.handleChange} name="startAfterHours" type="number" min='1' step="0.1" id="startAfterHours"/>
                                <label className="pl-2 col-sm-4" htmlFor="startAfterHours">hours/day</label>
                            </div>
                        </div>                                
                    </div>
                </div>                
            </Fragment>
        )
    }
}

export default OvertimeRules;
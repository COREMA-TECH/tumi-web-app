import React, {Component, Fragment} from 'react';
import Datetime from 'react-datetime';
import moment from 'moment';

const MONDAY = "MO", TUESDAY = "TU", WEDNESDAY = "WE", THURSDAY = "TH", FRIDAY = "FR", SATURDAY = "SA", SUNDAY = "SU";

class TimeOfDayRules extends Component{
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
                                    <div class="input-group" style={{marginTop: "0.5rem"}}>
                                        <input type="radio" name="type" id="typeday" value="day" checked={this.state.type === "day" ? true : false}/>
                                        <span className="pl-1">Day</span>                                        
                                    </div>  
                                </div>
                                <div className="d-inline-block mr-4">
                                    <div class="input-group" style={{marginTop: "0.5rem"}}>
                                        <input type="radio" name="week" id="typeweek" value="week" checked={this.state.type === "week" ? true : false}/>
                                        <span className="pl-1">Week</span>                                        
                                    </div>  
                                </div>
                                <div className="d-inline-block mr-4">
                                    <div class="input-group" style={{marginTop: "0.5rem"}}>
                                        <input type="radio" name="holiday" id="typeholiday" value="holiday" checked={this.state.type === "holiday" ? true : false}/>
                                        <span className="pl-1">Holiday</span>                                        
                                    </div>  
                                </div>                                  
                            </div>
                        </div>
                    </div>
                </div>
                <div className="BRModal-section no-border">
                    <div className="form-group form-row tumi-row-vert-center">
                        <label className="col-sm-2">Between:</label>
                        <div className="col-sm-10">
                            <div className="form-row">
                                <div className="col-sm-3 pl-0 pr-0">
                                    <Datetime dateFormat={false} value={moment(this.state.start, "HH:mm").format("hh:mm A")} inputProps={{ name: "start", required: true }} onChange={this.handleStartTimeChange} />
                                </div>
                                <div className="col-sm-1 pl-0 pr-0">
                                    <label className="d-block text-center">To</label>
                                </div>
                                <div className="col-sm-3 pl-0 pr-0">
                                    <Datetime dateFormat={false} value={moment(this.state.end, "HH:mm").format("hh:mm A")} inputProps={{ name: "start", required: true }} onChange={this.handleEndTimeChange} />
                                </div>
                            </div>
                        </div>
                    </div>    
                    <div className="form-group form-row tumi-row-vert-center">
                        <label className="col-sm-2">Multiplier</label>
                        <div className="col-sm-10">
                            <div className="form-row">
                                <input className="form-control col-sm-2 text-center" value={this.state.multiplier} onChange={this.handleChange} name="multiplier" type="number" min='1' step="1" pattern="[0-9]" id="multiplier"/>
                                <label className="pl-2 col-sm-4" htmlFor="multiplier">x base pay</label>
                            </div>
                        </div>                                
                    </div>
                    <div className="form-group form-row justify-content-end">
                        <div className="col-sm-3 pr-0 text-right">
                            <a type="submit" style={{color: "#FFFFFF"}} className="btn btn-success mr-2">+ Add</a>
                        </div>
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default TimeOfDayRules;
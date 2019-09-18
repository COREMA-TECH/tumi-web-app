import React, {Fragment, Component} from 'react';

const MONDAY = "MO", TUESDAY = "TU", WEDNESDAY = "WE", THURSDAY = "TH", FRIDAY = "FR", SATURDAY = "SA", SUNDAY = "SU";

class OvertimeRules extends Component{
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
                </div>  
            </Fragment>
        )
    }
}

export default OvertimeRules;
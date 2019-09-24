import React, {Fragment, Component} from 'react';

import Datetime from 'react-datetime';
import moment from 'moment';

const MONDAY = "MO", TUESDAY = "TU", WEDNESDAY = "WE", THURSDAY = "TH", FRIDAY = "FR", SATURDAY = "SA", SUNDAY = "SU";

class TimeOfDayRules extends Component{
    INITIAL_STATE = {
        startTime: "00:00",
        endTime: "00:00",
        days: '',
        multiplier: 1.00,
        holdOpen: false
    }

    constructor(props){
        super(props);
        this.state = { ...this.INITIAL_STATE }
    }
    
    //#region Day box control
    getWeekDayStyle = (dayName) => {
        return `btn btn-secondary RowForm-day ${this.state.days.includes(dayName) ? 'btn-success' : ''}`;
    }

    selectWeekDay = (dayName) => {
        if (this.state.days.includes(dayName))
            this.setState((prevState) => {
                return { days: prevState.days.replace(dayName, '') }
            })
        else
            this.setState((prevState) => {
                return { days: prevState.days.concat(dayName) }
            })
    }
    //#endregion
    
    handleStartTimeChange = text => {
        this.setState({
            startTime: moment(text, "HH:mm:ss").format("HH:mm"),
        }, _ => {
            const {startTime, endTime, multiplier, days} = this.state;
            this.props.setData(startTime, endTime, multiplier, days);
        });
    }

    handleEndTimeChange = text => {
        this.setState({
            endTime: moment(text, "HH:mm:ss").format("HH:mm"),
        }, _ => {
            const {startTime, endTime, multiplier, days} = this.state;
            this.props.setData(startTime, endTime, multiplier, days);
        });
    }


    handleChange = ({target: {name, value, type, checked}}) => {
        this.setState(_ => ({
            [name]: type === "checkbox" ? checked : value
        }), _ => {
            const {startTime, endTime, multiplier, days} = this.state;
            this.props.setData(startTime, endTime, multiplier, days);
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
                    <div className="form-group form-row tumi-row-vert-center">
                        <label className="col-sm-2">Between:</label>
                        <div className="col-sm-10">
                            <div className="form-row">
                                <div className="col-sm-3 pl-0 pr-0">
                                    <Datetime dateFormat={false} value={moment(this.state.startTime, "HH:mm").format("hh:mm A")} inputProps={{ name: "startTime", required: true }} onChange={this.handleStartTimeChange} />
                                </div>
                                <div className="col-sm-1 pl-0 pr-0">
                                    <label className="d-block text-center">To</label>
                                </div>
                                <div className="col-sm-3 pl-0 pr-0">
                                    <Datetime dateFormat={false} value={moment(this.state.endTime, "HH:mm").format("hh:mm A")} inputProps={{ name: "endTime", required: true }} onChange={this.handleEndTimeChange} />
                                </div>
                            </div>
                        </div>
                    </div>    
                    <div className="form-group form-row tumi-row-vert-center">
                        <label className="col-sm-2">Multiplier</label>
                        <div className="col-sm-10">
                            <div className="form-row">
                                <input className="form-control col-sm-2 text-center" value={this.state.multiplier} onChange={this.handleChange} name="multiplier" type="number" min='1' step="0.01" id="multiplier"/>
                                <label className="pl-2 col-sm-4" htmlFor="multiplier">x base pay</label>
                            </div>
                        </div>                                
                    </div>
                    <div className="form-group form-row justify-content-end">
                        <div className="col-sm-4 pr-0 text-right">
                            <input type="checkbox" name="holdOpen" checked={this.state.holdOpen} onChange={this.handleChange} id="holdOpen"/>&nbsp;Keep this window open.
                        </div> 
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default TimeOfDayRules;
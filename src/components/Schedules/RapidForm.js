import React, { Component } from 'react';
import moment from 'moment';
import Datetime from 'react-datetime';

const WEEK_DAYS = [
    { day: 1, code: "MO" },
    { day: 2, code: "TU" },
    { day: 3, code: "WE" },
    { day: 4, code: "TH" },
    { day: 5, code: "FR" },
    { day: 6, code: "SA" },
    { day: 7, code: "SU" }
]

class RapidForm extends Component {

    DEFAULT_STATE = {
        startDate: '7/29/2019',
        endDate: '7/29/2019',
        startHour: '08:00',
        endHour: '16:00',
        duration: '8',
        dayWeeks: '',
        dayAndHour: {}
    };

    constructor(props) {
        super(props);
        this.state = {
            ...this.DEFAULT_STATE
        }
    }

    getWeekDayStyle = (dayName) => {
        return `btn btn-secondary RowForm-day ${this.state.dayWeeks.includes(dayName) ? 'btn-success' : ''}`;
    }

    setDay = (dayCode) => {

        let day = {};
        let dayValue = 0;

        if (dayCode === 1)
            day = {firstDay: this.state.startHour};
        else if (dayCode === 2)
            day = {secondDay: this.state.startHour};
        else if (dayCode === 3)
            day = {thirdDay: this.state.startHour};
        else if (dayCode === 4)
            day = {fourthDay: this.state.startHour};
        else if (dayCode === 5)
            day = {fifthDay: this.state.startHour};
        else if (dayCode === 6)
            day = {sixthDay: this.state.startHour};
        else if (dayCode === 7)
            day = {seventhDay: this.state.startHour};
        
        return day;

    }  

    selectWeekDay = (dayName) => {
        // let dayValue = WEEK_DAYS.find(_ => {
        //     return _.code === dayName;
        // });

        // let day = this.setDay(this.props.propertyStartWeek, dayValue.day);

        if (this.state.dayWeeks.includes(dayName))
            this.setState((prevState) => {
                return { 
                    dayWeeks: prevState.dayWeeks.replace("," + dayName, ''),
                }
            })
        else
            this.setState((prevState) => {
                return { 
                    dayWeeks: prevState.dayWeeks.concat(',' + dayName),
                }
            })
    }

    orderDays = () => {
        let weekDaysInit = WEEK_DAYS.filter(_ => _.day >= this.props.propertyStartWeek);
        let weekDaysEnd = WEEK_DAYS.filter(_ => _.day < this.props.propertyStartWeek);
        return [...weekDaysInit, ...weekDaysEnd];
    }

    save = () => {
        let days = {};
        
        this.state.dayWeeks.replace(',','').split(',').map(value => {

            let daysOrdered = this.orderDays();
            let index = daysOrdered.map((e) => { return e.code; }).indexOf(value);

            days = {...this.setDay(index + 1), ...days};
        });

        let obj = {
            id: this.props.currentRow.id,
            ...days
        }
        this.props.setRow(obj);
    }

    render() {
        let weekDaysFinal = this.orderDays();
        return(
            <React.Fragment>
                <div className={`MasterShiftForm ${this.props.open ? 'active' : ''}`}>
                    <header className="MasterShiftForm-header">
                        <div className="row">
                            <div className="col-md-10">
                                <h3 className="MasterShiftForm-title">From {moment(this.state.startDate).format('ddd D')} to {moment(this.state.endDate).format('ddd D')}</h3>
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-link MasterShiftForm-close"
                                    onClick={() => this.props.handleCloseForm()}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </header>
                    <div className="row">
                        <div className="col-md-4">
                            <label htmlFor="">* Start Time</label>
                            <Datetime dateFormat={false} value={moment(this.state.startHour, "h:mm:ss A").format("hh:mm A")} inputProps={{ name: "startHour", required: true }} onChange={this.handleTimeChangeStart} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="">* End Time</label>
                            <Datetime dateFormat={false} value={moment(this.state.endHour, "h:mm:ss A").format("hh:mm A")} inputProps={{ name: "endHour", disabled: true }} />
                        </div>
                        <div className="col-md-4">
                            <label htmlFor="">Duration</label>
                            <input type="text" className="form-control" disabled value={this.state.duration}/>
                        </div>
                        <div className="col-md-12 mt-2">
                            <label htmlFor="">Days Off</label>
                            <div className="btn-group RowForm-days" role="group" aria-label="Basic example">
                                {weekDaysFinal.map(_ => {
                                    return <button key={_.day} type="button" className={this.getWeekDayStyle(_.code)} onClick={() => this.selectWeekDay(_.code)}>{_.code}</button>
                                })}
                            </div>
                        </div>
                    </div>
                    <footer className="MasterShiftForm-footer">
                        <div className="row">
                            <div className="col-md-6">
                                <button className="btn btn-success float-left btn-not-rounded" type="button" onClick={this.save}>Save</button>
                            </div>
                            <div className="col-md-6">
                                <button type="button" className="btn btn-default float-right btn-not-rounded" onClick={_ => this.props.handleCloseForm()}>Cancel</button>
                            </div>
                        </div>
                    </footer>
                </div>
                <div className="MasterShiftForm-overlay" onClick={() => this.props.handleCloseForm()}></div>
            </React.Fragment>
        );
    }

}

export default RapidForm;
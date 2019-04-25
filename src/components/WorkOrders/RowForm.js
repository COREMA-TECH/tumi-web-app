import React, { Component } from 'react';
import moment from 'moment';
import Datetime from 'react-datetime';

const MONDAY = "MO", TUESDAY = "TU", WEDNESDAY = "WE", THURSDAY = "TH", FRIDAY = "FR", SATURDAY = "SA", SUNDAY = "SU"

class RowForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contactId: 0,
            departmentId: 0,
            quantity: 0,
            PositionRateId: 0,
            contacts: [],
            positions: [],
            dayWeeks: '',
            shift: moment('08:00', "HH:mm").format("HH:mm"),
            endShift: moment('16:00', "HH:mm").format("HH:mm"),
            duration: '8',
            form: [],
            comment: "",
            userId: localStorage.getItem('LoginId'),
            date: new Date().toISOString().substring(0, 10),
            contactId: null,
            needExperience: false,
            needEnglish: false,
        };

    }

    handleTimeChange = (name) => (text) => {
        this.setState({
            [name]: moment(text, "HH:mm:ss").format("HH:mm")
        }, () => {
            this.calculateHours()
        })
    }

    calculateHours = () => {
        let startHour = this.state.shift;
        let endHour = this.state.endShift;

        var duration = moment.duration(moment.utc(moment(endHour, "HH:mm:ss").diff(moment(startHour, "HH:mm:ss"))).format("HH:mm")).asHours();
        duration = parseFloat(duration).toFixed(2);

        this.setState({
            duration: duration
        });
    }

    selectWeekDay = (dayName) => {
        if (this.state.dayWeeks.includes(dayName))
            this.setState((prevState) => {
                return { dayWeeks: prevState.dayWeeks.replace(dayName, '') }
            }, () => this.sendPostData())
        else
            this.setState((prevState) => {
                return { dayWeeks: prevState.dayWeeks.concat(dayName) }
            }, () => this.sendPostData())
    }


    getWeekDayStyle = (dayName) => {
        return `btn btn-secondary RowForm-day ${this.state.dayWeeks.includes(dayName) ? 'btn-success' : ''}`;
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        }, () => {
            this.sendPostData();
        });

    }

    sendPostData = () => {
        let form = [];
        var { quantity, PositionRateId, shift, endShift, comment, dayWeeks, userId, date, contactId, dayWeeks, needExperience, needEnglish } = this.state;
        form = {
            id: this.props.form.id,
            IdEntity: this.props.IdEntity,
            departmentId: this.props.departmentId,
            quantity,
            PositionRateId,
            shift,
            endShift,
            comment,
            dayWeek: dayWeeks,
            userId,
            date,
            contactId,
            startDate: this.props.startDate,
            endDate: this.props.endDate,
            status: 1,
            needExperience,
            needEnglish
        };
        this.props.handleChangePostData(form);
    }

    componentWillMount() {
        this.setState({
            quantity: this.props.dataToEdit.quantity,
            shift: this.props.dataToEdit.shift,
            endShift: this.props.dataToEdit.endShift,
            comment: this.props.dataToEdit.comment,
            dayWeeks: this.props.dataToEdit.dayWeeks,
            PositionRateId: this.props.dataToEdit.PositionRateId,
            departmentId: this.props.dataToEdit.departmentId,
            duration: this.props.dataToEdit.duration
        }, () => {
            this.calculateHours();
        })
    }

    handleCalculatedByDuration = (event) => {
        const target = event.target;
        const value = target.value;
        const startHour = this.state.shift;

        var endHour = moment(new Date("01/01/1990 " + startHour), "HH:mm:ss").add(parseFloat(value), 'hours').format('HH:mm');
        var _moment = moment(new Date("01/01/1990 " + startHour), "HH:mm:ss").add(8, 'hours').format('HH:mm');
        var _endHour = (value == 0) ? _moment : endHour;

        this.setState({
            endShift: _endHour,
            duration: value
        });
    }

    render() {
        const isAdmin = localStorage.getItem('IsAdmin') == "true";
        return (
            <div className="card">
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-4 mb-2">
                            <input
                                required
                                type="number"
                                maxLength="10"
                                min={0}
                                className="form-control"
                                name="quantity"
                                placeholder="Qty"
                                onChange={this.handleChange}
                                value={this.state.quantity == 0 ? '' : this.state.quantity}
                                onBlur={this.handleValidate}
                            />
                        </div>
                        <div className="col-md-4 mb-2">
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
                                {this.props.positions.map((position) => (
                                    <option value={position.Id}>{position.Position} </option>

                                ))}
                            </select>
                        </div>
                        <div className="col-md-4 mb-2">
                            <Datetime dateFormat={false} value={moment(this.state.shift, "HH:mm").format("hh:mm A")} inputProps={{ name: "shift", required: true }} onChange={this.handleTimeChange('shift')} />
                        </div>
                        <div className="col-md-4 mb-2">
                            <input type="text" className="form-control" name="duration" value={this.state.duration} onChange={this.handleCalculatedByDuration} />
                        </div>
                        <div className="col-md-4 mb-2">
                            <Datetime dateFormat={false} value={moment(this.state.endShift, "HH:mm").format("hh:mm A")} inputProps={{ name: "endShift", required: true }} onChange={this.handleTimeChange('endShift')} />
                        </div>
                        <div className="col-md-4 mb-2">
                            <button className="btn btn-link tumi-buttonCentered" type="button">
                                Advanced
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-7">
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
                        <div className="col-md-5">
                            <input
                                type="text"
                                onChange={this.handleChange}
                                name="comment"
                                className="form-control"
                                value={this.state.comment}
                                placeholder="Comment"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }


}

export default RowForm;
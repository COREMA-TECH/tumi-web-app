import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Datetime from 'react-datetime';
import moment from 'moment';

const MONDAY = "MO", TUESDAY = "TU", WEDNESDAY = "WE", THURSDAY = "TH", FRIDAY = "FR", SATURDAY = "SA", SUNDAY = "SU";

class ApplicationRestrictionModal extends Component{
    constructor(props){
        super(props);

        this.state = {
            dayWeeks: '',
            startTime: '12:00:00',
            endTime: '12:00:00' 
        }
    }

    selectWeekDay = (dayName) => {
        if (this.state.dayWeeks.includes(dayName))
            this.setState((prevState) => {
                return { dayWeeks: prevState.dayWeeks.replace(dayName, '') }
            })
        else
            this.setState((prevState) => {
                return { dayWeeks: prevState.dayWeeks.concat(dayName) }
            })
    }

    getWeekDayStyle = (dayName) => {
        return `btn btn-secondary RowForm-day ${this.state.dayWeeks.includes(dayName) ? 'btn-success' : ''}`;
    }

    handleTimeChange = (name) => (text) => {
        this.setState({
            [name]: moment(text, "HH:mm:ss").format("HH:mm")
        })
    }

    render(){
        return(
            <Dialog maxWidth="sm" open={this.props.openModal} onClose={this.props.handleCloseModal}>
                <DialogContent className="" style={{ backgroundColor: "#ffffff" }}>                    
                    <div className="row">
                        <div className="col-12 mb-2">
                            <div className="btn-group RowForm-days in-modal" role="group" aria-label="Basic example">
                                <button type="button" className={this.getWeekDayStyle(MONDAY)} onClick={() => this.selectWeekDay(MONDAY)}>{MONDAY}</button>
                                <button type="button" className={this.getWeekDayStyle(TUESDAY)} onClick={() => this.selectWeekDay(TUESDAY)}>{TUESDAY}</button>
                                <button type="button" className={this.getWeekDayStyle(WEDNESDAY)} onClick={() => this.selectWeekDay(WEDNESDAY)}>{WEDNESDAY}</button>
                                <button type="button" className={this.getWeekDayStyle(THURSDAY)} onClick={() => this.selectWeekDay(THURSDAY)}>{THURSDAY}</button>
                                <button type="button" className={this.getWeekDayStyle(FRIDAY)} onClick={() => this.selectWeekDay(FRIDAY)}>{FRIDAY}</button>
                                <button type="button" className={this.getWeekDayStyle(SATURDAY)} onClick={() => this.selectWeekDay(SATURDAY)}>{SATURDAY}</button>
                                <button type="button" className={this.getWeekDayStyle(SUNDAY)} onClick={() => this.selectWeekDay(SUNDAY)}>{SUNDAY}</button>
                            </div>
                        </div>
                        <div className="col-12 col-md-6 mb-2">
                            <Datetime dateFormat={false} value={moment(this.state.startTime, "HH:mm").format("hh:mm A")} inputProps={{ name: "From", required: true }} onChange={this.handleTimeChange('startTime')} />
                        </div>
                        <div className="col-12 col-md-6 mb-2">
                            <Datetime dateFormat={false} value={moment(this.state.endTime, "HH:mm").format("hh:mm A")} inputProps={{ name: "To", required: true }} onChange={this.handleTimeChange('endTime')} />
                        </div>
                        <div className="col-12">
                            <div className="tumi-buttonRow">
                                <button className="btn btn-success tumi-button" type="submit">
                                    Add Restriction <i className="fas fa-save ml-2" />
                                    {/* Save {!this.state.saving && <i className="fas fa-save ml2" />}
                                    {this.state.saving && <i className="fas fa-spinner fa-spin  ml2" />} */}
                                </button>
                                <button type="button" className="btn btn-danger tumi-button float-right" onClick={this.props.handleCloseModal}>
                                    Cancel<i className="fas fa-ban ml-2" /> 
                                </button>                            
                            </div>
                        </div>
                    </div>                                          
                </DialogContent>
            </Dialog>
        );
    }
}

export default ApplicationRestrictionModal;
import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Datetime from 'react-datetime';
import moment from 'moment';
import { withStyles } from '@material-ui/core/styles';

const MONDAY = "MO", TUESDAY = "TU", WEDNESDAY = "WE", THURSDAY = "TH", FRIDAY = "FR", SATURDAY = "SA", SUNDAY = "SU";

const styles = () => ({
    overflowVisible:{
        overflow: 'visible'
    }
});

class ApplicationRestrictionModal extends Component{
    constructor(props){
        super(props);

        this.state = {
            startTime: '12:00:00',
            endTime: '12:00:00',
            weekDays: []
        }
    }

    selectWeekDay = (dayName) => {
        this.setState((prevState) => {
            let weekDays = this.state.weekDays.includes(dayName)
                            ? prevState.weekDays.filter(d => d !== dayName)
                            : [...prevState.weekDays, dayName]
            return {
                weekDays: weekDays
            }
        });
    }

    getWeekDayStyle = (dayName) => {
        return `btn btn-secondary RowForm-day ${this.state.weekDays.includes(dayName) ? 'btn-success' : ''}`;
    }

    handleTimeChange = (name) => (text) => {
        this.setState({
            [name]: moment(text, "HH:mm:ss").format("HH:mm")
        })
    }

    handleAddRestriction = (e) => {
        e.preventDefault();
        let {weekDays, startTime, endTime} = this.state;
        let rest = {
            weekDays: weekDays,
            startTime: startTime,
            endTime: endTime
        }
        this.props.handleScheduleExplain(rest);
    }

    render(){
        let {classes} = this.props;
        return(
            <Dialog maxWidth="sm" open={this.props.openModal} onClose={this.props.handleCloseModal} classes={{paperScrollPaper: classes.overflowVisible }}>
                <DialogContent className={classes.overflowVisible} style={{ backgroundColor: "#ffffff" }}>                    
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
                                <button 
                                    className="btn btn-success tumi-button" 
                                    type="button"
                                    onClick={this.handleAddRestriction}
                                >
                                    Add Restriction 
                                    <i className="fas fa-save ml-2" />
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

export default withStyles(styles)(ApplicationRestrictionModal);
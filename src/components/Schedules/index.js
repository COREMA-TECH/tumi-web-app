import FilterForm from './FilterForm.js';
import Filters from './Filters.js';
import React, { Component } from 'react';
import Scheduler, { SchedulerData, ViewTypes, DATE_FORMAT, DemoData } from 'react-big-scheduler';
import 'react-big-scheduler/lib/css/style.css';
import moment from 'moment';
import Shifts from './Shifts.js';

class Schedules extends Component {

    INITIAL_STATE = {
        cityId: null,
        positionId: null,
        shiftId: null
    };

    constructor() {
        super();
        this.state = {
            ...this.INITIAL_STATE
        }
    }

    handleChange = (event) => {
        console.log(this.state);
        const target = event.target;
        const value = target.value;
        const name = target.name;

        // console.log("veamos el evento target ", target, " value ", value, " name ", name);
        this.setState({
            [name]: value
        });
    }

    handleReset = () => {
        this.setState({
            ...this.INITIAL_STATE
        });
    }

    getSelectedValue = (item) => {
        console.log("This is my item:::", item)
    }

    render() {
        return (
            <div className="MasterShift">
                <div className="row">
                    <div className="col-md-2">
                        <div className="MasterShift-formWrapper">
                            <FilterForm />
                        </div>
                    </div>
                    <div className="col-md-10">
                        <div className="MasterShift-schedules">
                            <div className="MasterShift-schedulesHeader">
                                <Filters handleReset={this.handleReset} handleChange={this.handleChange} cityId={this.state.cityId} positionId={this.state.positionId} shiftId={this.state.shiftId} />
                            </div>
                            <div className="MasterShift-schedulesBody" id="divToPrint">
                                <Shifts getSelectedValue={this.getSelectedValue} cityId={this.state.cityId} positionId={this.state.positionId} shiftId={this.state.shiftId} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Schedules;
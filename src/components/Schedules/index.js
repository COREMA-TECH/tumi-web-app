import FilterForm from './FilterForm.js';
import React, { Component } from 'react';
import Scheduler, { SchedulerData, ViewTypes, DATE_FORMAT, DemoData } from 'react-big-scheduler';
import 'react-big-scheduler/lib/css/style.css';
import moment from 'moment';
import Shifts from './Shifts.js';

class Schedules extends Component {

    render() {
        return (
            <div className="MasterShift">
                <div className="row">
                    <div className="col-md-2">
                        <div className="MasterShift-formWrapper">
                            <div className="MasterShift-options">
                                <div className="row">
                                    <div className="col-md-4">
                                        <div className="onoffswitch">
                                            <input type="checkbox" checked="" name="charge"
                                                onClick="" onChange={this.handleChange}
                                                className="onoffswitch-checkbox" id="myonoffswitch" />
                                            <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                                <span className="onoffswitch-inner"></span>
                                                <span className="onoffswitch-switch"></span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <FilterForm />
                        </div>
                    </div>
                    <div className="col-md-10">
                        <div className="MasterShift-schedules">
                            <div className="MasterShift-schedulesHeader">
                                <form action="">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <select name="state" id="" className="form-control">
                                                <option value="">Select a Option</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <select name="position" id="" className="form-control">
                                                <option value="">Select a Option</option>
                                            </select>
                                        </div>
                                        <div className="col-md-3">
                                            <select name="shifts" id="" className="form-control">
                                                <option value="">Select a Option</option>
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="MasterShift-schedulesBody">
                                <Shifts />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Schedules;
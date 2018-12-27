import FilterForm from './FilterForm.js';
import Filters from './Filters.js';
import React, { Component } from 'react';
import Scheduler, { SchedulerData, ViewTypes, DATE_FORMAT, DemoData } from 'react-big-scheduler';
import 'react-big-scheduler/lib/css/style.css';
import moment from 'moment';
import Shifts from './Shifts.js';

class Schedules extends Component {
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
                                <Filters />
                            </div>
                            <div className="MasterShift-schedulesBody" id="divToPrint">
                                <Shifts getSelectedValue={this.getSelectedValue} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Schedules;
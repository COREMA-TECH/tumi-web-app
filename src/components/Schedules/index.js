import FilterForm from './FilterForm.js';
import Filters from './Filters.js';
import React, { Component } from 'react';
import Shifts from './Shifts.js';

import withGlobalContent from 'Generic/Global';

class Schedules extends Component {

    INITIAL_STATE = {
        cityId: 0,
        positionId: 0,
        shiftId: 0,
        selectedShiftId: 0
    }

    constructor() {
        super();
        this.state = {
            ...this.INITIAL_STATE
        }
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        // console.log("veamos el evento target ", target, " value ", value, " name ", name);
        this.setState({
            [name]: value
        });
    }

    handleReset = (e) => {
        this.setState({
            ...this.INITIAL_STATE
        });
    }

    getSelectedValue = (item) => {
        this.setState({ selectedShiftId: item.id })
    }

    render() {
        return (
            <div className="MasterShift">
                <div className="row">
                    <div className="col-md-2">
                        <div className="MasterShift-formWrapper">
                            <FilterForm id={this.state.selectedShiftId} />
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
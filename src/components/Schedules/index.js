import FilterForm from './FilterForm.js';
import Filters from './Filters.js';
import React, { Component } from 'react';
import Shifts from './Shifts.js';
import PreFilter from './PreFilter';

import withGlobalContent from 'Generic/Global';

class Schedules extends Component {

    INITIAL_STATE = {
        cityId: null,
        positionId: null,
        shiftId: null,
        selectedShiftId: 0,
        refresh: true,
        isSerie: false
    };

    constructor() {
        super();
        this.state = {
            ...this.INITIAL_STATE,
            closedForm: true,
            openPreFilter: false,
            location: null,
            position: null,
            openPreFilter: true,
            requested: null,
            editConfirmOpened: false,
            filtered: false
        }
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleReset = (e) => {
        this.setState({
            ...this.INITIAL_STATE
        });
    }

    getSelectedValue = (item, type) => {
        this.setState({
            selectedShiftId: item.id,
            isSerie: type,
            editConfirmOpened: false,
            closedForm: false
        })
    }

    toggleRefresh = () => {
        this.setState({ refresh: !this.state.refresh })
    }

    handleCloseForm = () => {
        this.setState({
            closedForm: true
        });
    }

    handleClosePreFilter = (event) => {
        event.preventDefault();
        this.setState({
            openPreFilter: true
        });
    }

    handleOpenForm = (event) => {
        event.preventDefault();
        this.setState({
            closedForm: false
        });
    }

    handleApplyFilters = (position, location, requested) => {
        this.setState((prevState) => {
            return { position, location, requested, openPreFilter: false, positionId: position, filtered: true }
        })
    }

    handleGetTextofFilters = (position, location, requested) => {
        this.setState((prevState) => {
            return { positionName: position, locationName: location, requestedName: requested }
        })
    }

    openEditConfirm = () => {
        this.setState(() => {
            return { editConfirmOpened: true }
        });
    }

    render() {
        return (
            <div className="MasterShift">
                <PreFilter
                    openPreFilter={this.state.openPreFilter}
                    handleApplyFilters={this.handleApplyFilters}
                    openPreFilter={this.state.openPreFilter}
                    handleGetTextofFilters={this.handleGetTextofFilters}
                />
                <Filters
                    handleClosePreFilter={this.handleClosePreFilter}
                    handleOpenForm={this.handleOpenForm}
                    handleReset={this.handleReset}
                    handleChange={this.handleChange}
                    cityId={this.state.cityId}
                    positionId={this.state.positionId}
                    shiftId={this.state.shiftId}
                    positionName={this.state.positionName}
                    locationName={this.state.locationName}
                    requestedName={this.state.requestedName}
                />
                <FilterForm isSerie={this.state.isSerie} location={this.state.location} position={this.state.position} requestedBy={this.state.requested} handleCloseForm={this.handleCloseForm} closedForm={this.state.closedForm} id={this.state.selectedShiftId} toggleRefresh={this.toggleRefresh} hotelManager={this.props.hotelManager} />
                <div className="row">
                    <div className="col-md-12">
                        <div className="MasterShift-schedules">
                            <div className="MasterShift-schedulesBody" id="divToPrint">
                                {
                                    this.state.filtered == true ? (
                                        <Shifts
                                            editConfirmOpened={this.state.editConfirmOpened}
                                            openEditConfirm={this.openEditConfirm}
                                            refresh={this.state.refresh}
                                            getSelectedValue={this.getSelectedValue}
                                            cityId={this.state.cityId}
                                            positionId={this.state.positionId}
                                            shiftId={this.state.shiftId}
                                        />
                                    ) : ('')
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default Schedules;
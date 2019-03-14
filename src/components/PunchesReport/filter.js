import React, { Component } from 'react';
import TimeCardForm from '../TimeCard/TimeCardForm'
import withGlobalContent from 'Generic/Global';

class PunchesReportFilter extends Component {

    DEFAULT_STATE = {
        endDateDisabled: true,
        openModal: false,
    }

    constructor(props) {
        super(props);
        var { property, deparment, employee, startDate, endDate } = props;
        this.state = { property, deparment, employee, startDate, endDate, ...this.DEFAULT_STATE };
    }

    renderProperties = () => {
        return this.props.properties.map(item => {
            return <option key={item.Id} value={item.Id}>{item.Name}</option>
        });
    }

    renderDepartments = () => {
        return this.props.departments.map(item => {
            return <option key={item.Id} value={item.Id}>{item.DisplayLabel}</option>
        });
    }

    updateFilter = (event) => {
        let object = event.target;
        this.setState(() => ({ [object.name]: object.value }),
            () => {
                if (this.props.updateFilter)
                    this.props.updateFilter(this.state)
            })
    }

    toggleRefresh = () => {
        this.setState((prevState) => { return { refresh: !prevState.refresh } })
    }

    handleChangeDate = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState(() => ({
            [name]: value,
            endDateDisabled: false
        }),
            () => {
                if (this.props.updateFilter)
                    this.props.updateFilter(this.state)
            });
    }

    handleClickOpenModal = () => {
        this.setState({ openModal: true });
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.property != nextProps.property)
            this.setState(() => ({ property: nextProps.property }));
    }

    render() {
        return <div className="card-header bg-light">
            <div className="row">
                <div className="col-md-2 mt-1 pl-0">
                    <select name="property" className="form-control" onChange={this.updateFilter} value={this.state.property}>
                        <option value="">Property(All)</option>
                        {this.renderProperties()}
                    </select>
                </div>
                <div className="col-md-2 mt-1 pl-0">
                    <select name="department" className="form-control" onChange={this.updateFilter} value={this.state.deparment} disabled={this.props.loadingDepartments}>
                        <option value="">Department(All)</option>
                        {this.renderDepartments()}
                    </select>
                </div>
                <div className="col-md-2 mt-1 pl-0">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <i class="fas fa-search"></i>
                            </span>
                        </div>
                        <input name="employee" className="form-control" type="text" placeholder='Employee Search' onChange={this.updateFilter} value={this.state.employee} />
                    </div>
                </div>
                <div className="col-md-4 mt-1 pl-0">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">From</span>
                        </div>
                        <input type="date" className="form-control" placeholder="2018-10-30" value={this.state.startDate} name="startDate" onChange={this.handleChangeDate} />
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">To</span>
                        </div>
                        <input type="date" className="form-control" name="endDate" value={this.state.endDate} disabled={this.state.endDateDisabled} placeholder="2018-10-30" onChange={this.updateFilter} />
                    </div>
                </div>
                <div className="col-md-2 mt-1">
                    <button class="btn btn-success float-right" onClick={this.handleClickOpenModal}>Add Time<i class="fas fa-plus ml-1"></i></button>
                </div>
            </div>
            <div className="row">
                <div className="col-md-12">
                    <TimeCardForm
                        openModal={this.state.openModal}
                        handleOpenSnackbar={this.props.handleOpenSnackbar}
                        onEditHandler={this.onEditHandler}
                        toggleRefresh={this.toggleRefresh}
                        handleCloseModal={this.handleCloseModal}
                    />
                </div>
            </div>
        </div>
    }
}

//export default PunchesReportFilter;
export default withGlobalContent(PunchesReportFilter);
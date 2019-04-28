import React, { Component } from 'react';
import TimeCardForm from '../TimeCard/TimeCardForm'
import withGlobalContent from 'Generic/Global';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class PunchesReportFilter extends Component {

    DEFAULT_STATE = {
        endDateDisabled: true,
        openModal: false,
    }

    constructor(props) {
        super(props);
        var { property, department, employee, startDate, endDate } = props;
        this.state = { property, department, employee, startDate, endDate, ...this.DEFAULT_STATE };
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

    handlePropertyChange = (property) => {
        this.setState(() => ({ property }),
            () => {
                if (this.props.updateFilter)
                    this.props.updateFilter(this.state)
            });
    };

    handleDepartmentChange = (department) => {
        this.setState(() => ({ department }),
            () => {
                if (this.props.updateFilter)
                    this.props.updateFilter(this.state)
            });
    };


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

    handleCloseModal = (event) => {
        event.preventDefault();
        this.setState({
            openModal: false

        });
    };

    handleClickOpenModal = () => {
        this.setState({ openModal: true });
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.property.value != nextProps.property.value)
            this.setState(() => ({ property: nextProps.property }));
        if (this.props.department.value != nextProps.department.value)
            this.setState(() => ({ department: nextProps.department }));
    }

    render() {
        return <div className="card-header bg-light">
            <div className="row">
                {/*
            <div className="col-md-2 mt-1 pl-0">
                    <Select
                        name="property"
                        options={this.props.properties}
                        value={this.state.property}
                        onChange={this.handlePropertyChange}
                        components={makeAnimated()}
                        closeMenuOnSelect
                    />
                </div>
            */}
                <div className="col-md-4 col-xl-2 mb-2">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <i class="fas fa-search"></i>
                            </span>
                        </div>
                        <input name="employee" className="form-control" type="text" placeholder='Employee Search' onChange={this.updateFilter} value={this.state.employee} />
                    </div>
                </div>
                <div className="col-md-2 offset-md-4 col-xl-2 mb-2">
                    <div class="input-group flex-nowrap">
                        <DatePicker
                            selected={this.state.startDate}
                            onChange={this.handleChangeDate}
                            placeholderText="Start date"
                            id="datepicker"
                        />
                        <div class="input-group-append">
                            <label class="input-group-text" id="addon-wrapping" for="datepicker">
                                <i class="far fa-calendar"></i>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="col-md-2 col-xl-2 mb-2">
                    <div class="input-group flex-nowrap">
                        <DatePicker
                            selected={this.state.endDate}
                            onChange={this.handleChangeDate}
                            placeholderText="End date"
                            id="datepicker"
                        />
                        <div class="input-group-append">
                            <label class="input-group-text" id="addon-wrapping" for="datepicker">
                                <i class="far fa-calendar"></i>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

//export default PunchesReportFilter;
export default withGlobalContent(PunchesReportFilter);
import React, { Component } from 'react';
import TimeCardForm from '../TimeCard/TimeCardForm'
import withGlobalContent from 'Generic/Global';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import { GET_REPORT_CSV_QUERY } from "./queries";
import withApollo from "react-apollo/withApollo";
import PropTypes from 'prop-types';


class PunchesReportConsolidatedFilter extends Component {

    DEFAULT_STATE = {
        endDateDisabled: true,
        openModal: false,
        directDeposit: false
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
        this.setState((prevState) => {
            return { refresh: !prevState.refresh }
        })
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

    getReportCSV = () => {
        this.setState(() => ({ loadingReport: true }), () => {
            this.props.client
                .query({
                    query: GET_REPORT_CSV_QUERY,
                    fetchPolicy: 'no-cache',
                    variables: { ...this.props.getFilters(), directDeposit: this.state.directDeposit }
                })
                .then(({ data }) => {
                    // TODO: show a loading icon in download button
                    console.table("Data ----> ", data);

                    let url = this.context.baseUrl + data.punchesConsolidated;
                    window.open(url, '_blank');

                    this.setState(() => ({
                        loadingReport: false
                    }));
                })
                .catch(error => {
                    console.log("Error ----> ", error);
                    this.setState(() => ({ loadingReport: false }));
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to download CSV Report. Please, try again!',
                        'bottom',
                        'right'
                    );
                });
        })
    }

    onCheckedChange = (e) => {
        this.setState({ [e.target.name]: e.target.checked })
    }

    render() {
        return <div className="card-header bg-light">
            <div className="row">
                <div className="col-md-4 mb-2 pl-0">
                    <Select
                        name="property"
                        options={this.props.properties}
                        value={this.state.property}
                        onChange={this.handlePropertyChange}
                        components={makeAnimated()}
                        closeMenuOnSelect
                    />
                </div>
                <div className="col-md-4 mb-2 pl-0">
                    <Select
                        name="department"
                        options={this.props.departments}
                        value={this.state.department}
                        onChange={this.handleDepartmentChange}
                        components={makeAnimated()}
                        closeMenuOnSelect
                    />
                </div>
                <div className="col-md-4 mb-2 pl-0">
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <span className="input-group-text">
                                <i class="fas fa-search"></i>
                            </span>
                        </div>
                        <input name="employee" className="form-control" type="text" placeholder='Employee Search'
                            onChange={this.updateFilter} value={this.state.employee} />
                    </div>
                </div>
                <div className="col-md-8 mb-2 pl-0">
                    <div class="input-group">
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">From</span>
                        </div>
                        <input type="date" className="form-control" placeholder="2018-10-30"
                            value={this.state.startDate} name="startDate" onChange={this.handleChangeDate} />
                        <div class="input-group-prepend">
                            <span class="input-group-text" id="basic-addon1">To</span>
                        </div>
                        <input type="date" className="form-control" name="endDate" value={this.state.endDate}
                            disabled={this.state.endDateDisabled} placeholder="2018-10-30"
                            onChange={this.updateFilter} />
                    </div>
                </div>
                <div className="col-md-4 mb-2 pl-0">
                    {/* TODO: add download icon - call query to generate cvs with consolidated punches*/}
                    <div className="label-switch-container">
                        <label htmlFor="">Direct Deposit?</label>
                        <div className="float-right onoffswitch-container">
                            <div className="onoffswitch">
                                <input
                                    type="checkbox"
                                    checked={this.state.directDeposit}
                                    name="directDeposit"
                                    className="onoffswitch-checkbox"
                                    id="directDeposit"
                                    onChange={this.onCheckedChange}
                                />
                                <label className="onoffswitch-label" htmlFor="directDeposit">
                                    <span className="onoffswitch-inner" />
                                    <span className="onoffswitch-switch" />
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 mb-2">
                    <button className="btn btn-success ml-1 float-right"
                        onClick={this.getReportCSV}>CSV {this.state.loadingReport && <i className="fas fa-spinner fa-spin  ml2" />}
                        {!this.state.loadingReport && <i className="fas fa-download  ml2" />}
                    </button>
                    <button class="btn btn-success float-right" onClick={this.handleClickOpenModal}>Add Time<i
                        class="fas fa-plus ml-1"></i></button>
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

    static contextTypes = {
        baseUrl: PropTypes.string
    };
}

export default withGlobalContent(withApollo(PunchesReportConsolidatedFilter));
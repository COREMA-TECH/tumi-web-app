import React, { Component } from 'react';
import TimeCardForm from '../TimeCard/TimeCardForm'
import withGlobalContent from 'Generic/Global';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import { GET_REPORT_CSV_QUERY } from "./queries";
import withApollo from "react-apollo/withApollo";
import PropTypes from 'prop-types';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


class PunchesReportConsolidatedFilter extends Component {

    DEFAULT_STATE = {
        endDateDisabled: true,
        openModal: false,
        directDeposit: false,
        startDate: "",
        endDate: "",
        employee: "",
        property: { value: "", label: "Property (All)" },
        department: this.props.department,
        item: {}
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

    clearFilters = () => {
        this.setState(() => (
            { ...this.DEFAULT_STATE }
        ),

            () => {
                this.props.updateFilter(this.state)
            })
    }

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

    handleCloseModal = () => {
        this.setState({
            openModal: false
        });
    };

    handleClickOpenModal = () => {
        this.setState({ openModal: true, item: {} });
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.property.value != nextProps.property.value) {
            const propertyValue = nextProps.property ? nextProps.property : { value: "", label: "Property (All)" };
            this.setState(() => ({ property: propertyValue }));
        }
        if (this.props.department.value != nextProps.department.value)
            this.setState(() => ({ department: nextProps.department }));
        if (this.props.editModal != nextProps.editModal)
            this.setState(_ => ({ openModal: true }));
        if (this.props.item !== nextProps.item)
            this.setState(_ => { return { item: nextProps.item } });
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
                    let url = this.context.baseUrl + data.markedEmployeesConsolidatedForCSV;
                    window.open(url, '_blank');

                    this.setState(() => ({
                        loadingReport: false
                    }));
                })
                .catch(error => {
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
                <div className="col-md-4 col-xl-2 mb-2">
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
                <div className="col-md-4 col-xl-2 mb-2">
                    <Select
                        name="property"
                        options={this.props.properties}
                        value={this.state.property}
                        onChange={this.handlePropertyChange}
                        components={makeAnimated()}
                        closeMenuOnSelect
                    />
                </div>
                <div className="col-md-4 col-xl-2 mb-2">
                    <Select
                        name="department"
                        options={this.props.departments}
                        value={this.state.department}
                        onChange={this.handleDepartmentChange}
                        components={makeAnimated()}
                        closeMenuOnSelect
                    />
                </div>
                <div className="col-md-2 offset-md-4 col-xl-2 offset-xl-0 mb-2">
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
                <div className="col-md-4 col-xl-2 mb-2">
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
                <div className="col-md-12 mb-2 Filter-buttons">
                    <button class="btn btn-outline-secondary btn-not-rounded Filter-button" type="button" onClick={this.clearFilters}>
                        <i class="fas fa-filter"></i> Clear
                    </button>
                    <button className="btn btn-success Filter-button"
                        onClick={this.getReportCSV}>CSV {this.state.loadingReport && <i className="fas fa-spinner fa-spin ml2" />}
                        {!this.state.loadingReport && <i className="fas fa-download ml2" />}
                    </button>
                    <button class="btn btn-success Filter-button" onClick={this.handleClickOpenModal}>Add Time<i
                        class="fas fa-plus ml-1"></i>
                    </button>
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
                        item={this.state.item}
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
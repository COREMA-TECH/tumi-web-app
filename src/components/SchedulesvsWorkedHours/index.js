import React, { Component } from 'react'
import { GET_SHIFTVSWORKEDHOURS, GET_USERS_QUERY } from './Queries';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import LastPageIcon from '@material-ui/icons/LastPage';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import PropTypes from 'prop-types';
import withApollo from 'react-apollo/withApollo';
import TablePagination from '@material-ui/core/TablePagination';
import Select from 'react-select';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';
import filterTypes from './filterTypeData';
import makeAnimated from 'react-select/lib/animated';
import DatePicker from "react-datepicker";
import moment from 'moment';

const CustomTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

const DEFAULT_FILTER_TYPE = { value: "W", label: "By week" };
const DEFAULT_DATA_RANGE_APP = { value: null, label: 'select date range'};

class SchedulesvsWorkedHours extends Component { 

    DEFAULT_STATE = {
        schedules: [],
        loading: true,
        users: [],
        propertyId: 0,
        operation: 0,
        filterType: DEFAULT_FILTER_TYPE,
        typeDateFiltered: DEFAULT_FILTER_TYPE, // opcion seleccinada para filtro de fecha en indice
        dateRangeApp: DEFAULT_DATA_RANGE_APP,
        detail: [],
        startDateApp: '',
        endDateApp: ''
    }

    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 25,
            ...this.DEFAULT_STATE
        };
    }

    getDataFilters = () => {
        let variables;
        console.log()
        if (this.state.startDateApp !== '' && this.state.endDateApp !== '') {
            variables = {
                ...variables,
                startDate: this.state.startDateApp,
                endDate: this.state.endDateApp
            };
        } 
        return variables;
    }

    getSchedules = () => {
        this.props.client.query({
            query: GET_SHIFTVSWORKEDHOURS,
            variables: { ...this.getDataFilters() },
            fetchPolicy: 'no-cache'
        }).then(({ data }) => {
            this.setState(prevState => ({
                loading: true,
                schedules: data.shiftVsWorkedHours,
                detail: data.shiftVsWorkedHours.detail
            }), _ => {
                this.setState(prevState => ({loading: false}))
            });

        }).catch(error => {
            this.setState(() => ({ loadingProperties: false }));
        });
    }

    componentWillMount() {
        this.getSchedules();
    }

    handleTypeDateFiltered = (option) => {
		this.setState(() => {
			return { typeDateFiltered: option }
		});
	}

	handleDateRangeApp = (dateRangeApp) => {
		let dates = dateRangeApp.value.split('||');
		this.setState(() => ({ 
            dateRangeApp, startDateApp: new Date(dates[0]), endDateApp: new Date(dates[1]) 
        }), _ => {
            this.getSchedules();
        })
	}

	handleStartDateApp = (value) => {
		this.setState(() => ({
			startDateApp: value
		}));
	}

	handleEndDateApp = (value) => {
		this.setState(() => ({
			endDateApp: value
		}));
    }
    
    getDateRangeApp = (type) => {
		let today = new Date(), weeks = 4, months = 6, value, label, startDate, endDate, data = [], endDateValue, startDateValue;
		let { typeDateFiltered } = this.state;

		today = moment.utc(today).subtract(6 - moment.utc(today).day(), "days")._d;

		if (typeDateFiltered.value == "W") {
			while (weeks > 0) {
				endDate = moment.utc(today).format("MM/DD/YYYY"); //get Start Date
				today = moment.utc(today).subtract(1, "weeks")._d;//Substract a week
				startDate = moment.utc(today).format("MM/DD/YYYY");//get End Date
				today = moment.utc(today).subtract(1, "days")._d;//Substract a day to start new week
				data.push({ value: `${startDate}||${endDate}`, label: `${startDate} - ${endDate}` })
				weeks--;
			}
		}

		if (typeDateFiltered.value == "M") {
			while (months > 0) {
				endDate = moment.utc(today).format("MM/YYYY"); //get Start Date
				endDateValue = moment.utc(today).endOf("month").format("MM/DD/YYYY");
				startDateValue = moment.utc(today).startOf("month").format("MM/DD/YYYY");
				today = moment.utc(today).subtract(1, "months")._d;//Substract a month

				data.push({ value: `${startDateValue}||${endDateValue}`, label: `${endDate}` })
				months--;
			}
		}
		return data;
    }
    
    clearFilter = () => {
		this.setState(() => {
			return {
				startDateApp: null,
				endDateApp: null,
				dateRangeApp: DEFAULT_DATA_RANGE_APP
			}
		}, _ => {
            this.getSchedules();
        });
	}

    render() {
        let items = this.state.detail;
        const { rowsPerPage, page } = this.state;
        let {filterRecruiters, recruiterFiltered, typeDateFiltered, startDateApp, endDateApp, dateRangeApp } = this.state;
        return(
            <React.Fragment>
               <div className="col-md-10 col-xl-8 offset-xl-4 mb-2 mt-2">
					<div className="row p-0 d-flex justify-content-end">
						<div className="col-md">
							<div className="row p-0">
								<div className={typeDateFiltered.value != "C" ? 'offset-md-4 col-md-4 ' : 'col-md-4'}>
									<Select
										name="typeDateFiltered"
										options={filterTypes}
										value={typeDateFiltered}
										onChange={this.handleTypeDateFiltered}
										components={makeAnimated()}
										closeMenuOnSelect
									/>
								</div>
                                {typeDateFiltered.value != "C" ?
                                    <div className="col-md-4">
                                        <Select
                                            name="dateRangeApp"
                                            options={this.getDateRangeApp()}
                                            value={dateRangeApp}
                                            onChange={this.handleDateRangeApp}
                                            components={makeAnimated()}
                                            closeMenuOnSelect
                                        />
                                    </div> :
                                    <React.Fragment>
                                        <div className="col-md-4">
                                            <div class="input-group">
                                                <DatePicker
                                                    selected={this.state.startDateApp}
                                                    onChange={this.handleStartDateApp}
                                                    placeholderText="Start date"
                                                    id="startDateApp"
                                                />
                                                <div class="input-group-append">
                                                    <label class="input-group-text" id="addon-wrapping" for="startDateApp">
                                                        <i class="far fa-calendar"></i>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div class="input-group">
                                                <DatePicker
                                                    selected={this.state.endDateApp}
                                                    onChange={this.handleEndDateApp}
                                                    placeholderText="End date"
                                                    id="endDateApp"
                                                />
                                                <div class="input-group-append">
                                                    <label class="input-group-text" id="addon-wrapping" for="endDateApp">
                                                        <i class="far fa-calendar"></i>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    </React.Fragment>
                                }
							</div>
						</div>
						<div className="col-md-auto">
							<button class="btn btn-outline-secondary btn-not-rounded" type="button" onClick={this.clearFilter}>
								<i class="fas fa-filter"></i> Clear
							</button>
						</div>
					</div>
				</div>

				
                <div className="card">
                    <div className="card-header">
                        Schedules vs Worked Hours
                    </div>
                    <div className="card-body">
                        {this.state.loading ? <LinearProgress />: ""}
                        <Table>
                            <TableHead>
                                <TableRow className="text-center">
                                    <CustomTableCell className={"Table-head text-center"} style={{width: 'auto'}}>Employee</CustomTableCell>
                                    <CustomTableCell className={"Table-head text-center"}>Schedules Hours</CustomTableCell>
                                    <CustomTableCell className={"Table-head text-center"}>Worked Hours</CustomTableCell>
                                    <CustomTableCell className={"Table-head text-center"}>Difference</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    return (
                                        <TableRow className="text-center">
                                            <CustomTableCell>{row.name}</CustomTableCell>
                                            <CustomTableCell className="text-center">{row.schedulesHours}</CustomTableCell>
                                            <CustomTableCell className="text-center">{row.workedHours}</CustomTableCell>
                                            <CustomTableCell className="text-center">{row.difference}</CustomTableCell>
                                        </TableRow>
                                    );
                                })}
                                <TableRow className="text-center">
                                    <CustomTableCell className="text-center font-weight-bold">Total</CustomTableCell>
                                    <CustomTableCell className="text-center font-weight-bold">{this.state.schedules.schedulesHours}</CustomTableCell>
                                    <CustomTableCell className="text-center font-weight-bold">{this.state.schedules.workedHours}</CustomTableCell>
                                    <CustomTableCell className="text-center font-weight-bold">{this.state.schedules.difference}</CustomTableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

export default withApollo(SchedulesvsWorkedHours);


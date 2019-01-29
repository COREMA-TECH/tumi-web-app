import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withApollo } from 'react-apollo';
import { GET_HOTEL_QUERY, GET_POSITION_BY_QUERY, GET_RECRUITER, GET_EMPLOYEES_WITHOUT_ENTITY, GET_CONTACT_BY_QUERY, GET_SHIFTS, GET_DETAIL_SHIFT, GET_WORKORDERS_QUERY } from './queries';
import { CREATE_WORKORDER, UPDATE_WORKORDER, CONVERT_TO_OPENING, DELETE_EMPLOYEE } from './mutations';
import ShiftsData from '../../data/shitfsWorkOrder.json';
//import ShiftsData from '../../data/shitfs.json';
import { parse } from 'path';
import { bool } from 'prop-types';
import AutosuggestInput from 'ui-components/AutosuggestInput/AutosuggestInput';
import TimeField from 'react-simple-timefield';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import ConfirmDialog from 'material-ui/ConfirmDialog';
import moment from 'moment';
import Datetime from 'react-datetime';

const styles = (theme) => ({
    wrapper: {
        margin: theme.spacing.unit,
        position: 'relative'
    },
    buttonSuccess: {},
    buttonProgress: {
        //color: ,
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12
    },
    row: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default
        },
        '&:hover': {
            cursor: 'pointer'
        }
    }

});

class RegionForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            recruiters: [],
            employees: [],
            IdRegionalManager: 0,
            IdRegionalDirector: 0,
            IdRecruiter: 0
        };

    }

    componentWillMount() {
        this.getRecruiter();
        this.getEmployeesWithoutEntity();
    }

    getRecruiter = () => {
        this.props.client
            .query({
                query: GET_RECRUITER,
                variables: {}
            })
            .then(({ data }) => {
                this.setState({
                    recruiters: data.getusers

                });
            })
            .catch();
    };

    getEmployeesWithoutEntity = () => {
        this.props.client
            .query({
                query: GET_EMPLOYEES_WITHOUT_ENTITY,
                variables: {}
            })
            .then(({ data }) => {
                this.setState({
                    employees: data.employees

                });
            })
            .catch();
    };

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        // console.log("veamos el evento target ", target, " value ", value, " name ", name);
        this.setState({
            [name]: value
        });

    };

    render() {
        return (
            <form action="">
                <header className="RegionForm-header">
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-md-4">
                                <label htmlFor="">* Region's Name</label>
                                <input type="text" className="form-control" />
                            </div>
                            <div className="col-md-4">
                                <label htmlFor="">* Region's Code</label>
                                <input type="text" className="form-control" />
                            </div>
                        </div>
                    </div>
                </header>
                <div className="container-fluid">
                    <div className="card">
                        <div className="card-header">
                            <div className="row">
                                <div className="col-md-4">
                                    <label htmlFor="">Regional Manager</label>
                                    <select
                                        required
                                        name="IdRegionalManager"
                                        className="form-control"
                                        id=""
                                        onChange={this.handleChange}
                                        value={this.state.IdRegionalManager}
                                    >
                                        <option value={0}>Select a Regional Manager</option>
                                        {this.state.employees.map((recruiter) => (
                                            <option value={recruiter.id}>{recruiter.firstName} {recruiter.lastName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="">Regional Director</label>
                                    <select
                                        required
                                        name="IdRegionalDirector"
                                        className="form-control"
                                        id=""
                                        onChange={this.handleChange}
                                        value={this.state.IdRegionalDirector}
                                    >
                                        <option value={0}>Select a Regional Director</option>
                                        {this.state.employees.map((recruiter) => (
                                            <option value={recruiter.id}>{recruiter.firstName} - {recruiter.lastName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="">Regional Recruiter</label>
                                    <select
                                        required
                                        name="IdRecruiter"
                                        className="form-control"
                                        id=""
                                        onChange={this.handleChange}
                                        value={this.state.IdRecruiter}
                                    >
                                        <option value={0}>Select a Recruiter</option>
                                        {this.state.recruiters.map((recruiter) => (
                                            <option value={recruiter.Id}>{recruiter.Full_Name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4">
                                    <label htmlFor="">Property Name</label>
                                    <div class="input-group">
                                        <input type="text" className="form-control" placeholder="Enter Name/Code" aria-label="Recipient's username" aria-describedby="basic-addon2" />
                                        <div class="input-group-append">
                                            <span class="input-group-text" id="basic-addon2">
                                                <i className="fa fa-search"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="PropertiesTags">
                                <ul className="row">
                                    <li className="col-md-2 PropertiesTags-item">
                                        <div class="input-group">
                                            <span className="form-control">
                                                Este es el property
                                            </span>
                                            <div class="input-group-append">
                                                <button class="btn btn-outline-secondary" type="button">
                                                    <i className="fa fa-times"></i>
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="card-footer">
                            <button type="button" className="btn btn-danger float-right">Cancel</button>
                            <button type="submit" className="btn btn-success float-right mr-1">Save</button>
                        </div>
                    </div>
                </div>
            </form>
        );
    }

}

export default withStyles(styles)(withApollo(RegionForm));
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import { withStyles } from '@material-ui/core/styles';
import withApollo from 'react-apollo/withApollo';
import Tooltip from '@material-ui/core/Tooltip';

import {SET_BREAK_RULE_ACTIVE} from './mutations';

import React, { Component } from 'react';

const CustomTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

class BreaksTable extends Component {
    constructor(props) {
        super(props);

        this.state = {
            breakRules: [],
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.breakRules !== nextProps.breakRules){
            this.setState(_ => {
                return { breakRules: nextProps.breakRules }
            });
        }
    }

    setRuleActive = (id, isActive) => {
        this.props.client.mutate({
            mutation: SET_BREAK_RULE_ACTIVE,
            variables: {
                id,
                isActive
            }
        })
        .then(_ => { this.props.refresh(); })
        .catch( error => { console.log(error) });
    }

    renderTableRows = _ => {
        if(!this.state.breakRules || this.state.breakRules.length === 0) {
            return "No Break Rules have been set";
        }

        return (
            this.state.breakRules.map(rule => {
                return(
                    <TableRow>
                        <CustomTableCell>
                            <Tooltip title="Edit">
                                <button
                                    className="btn btn-success float-left"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        this.props.setRuleToEdit(rule);
                                    }}
                                >
                                    <i className="fas fa-pen"></i>
                                </button>
                            </Tooltip>
                        </CustomTableCell>
                        <CustomTableCell>{rule.name}</CustomTableCell>
                        <CustomTableCell>{rule.isPaid ? 'Paid' : 'Unpaid'}</CustomTableCell>
                        <CustomTableCell>{rule.employee_BreakRule.length === this.props.employeeCount ? 'All Employees' : 'Selected Employees'}</CustomTableCell>
                        <CustomTableCell>{rule.isAutomatic ? 'Automatic' : 'Manual'}</CustomTableCell>
                        <CustomTableCell>
                            <div className="onoffswitch">
                                <input
                                    type="checkbox"
                                    checked={rule.isActive}
                                    name="IsActive"
                                    className="onoffswitch-checkbox"
                                    id="IsActive"
                                    value={rule.isActive}
                                    onChange={(event) => {
                                        this.setRuleActive(rule.id, event.target.checked);
                                    }}
                                />
                                <label className="onoffswitch-label" htmlFor="IsActive">
                                    <span className="onoffswitch-inner" />
                                    <span className="onoffswitch-switch" />
                                </label>
                            </div>
                        </CustomTableCell>
                    </TableRow>
                )
            })
        )
    }

    render(){
        return(
            <React.Fragment>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell className={"Table-head"} style={{ width: '150px '}} >Actions</CustomTableCell>
                            <CustomTableCell className={"Table-head"} style={{ width: '220px' }} >Name</CustomTableCell>
                            <CustomTableCell className={"Table-head"} style={{ width: '220px' }} >Type</CustomTableCell>
                            <CustomTableCell className={"Table-head"} style={{ width: '220px' }} >Employees</CustomTableCell>
                            <CustomTableCell className={"Table-head"} style={{ width: '220px' }} >Automatic/Manual</CustomTableCell>
                            <CustomTableCell className={"Table-head"} style={{ width: '220px' }} >Active</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.renderTableRows()}                        
                    </TableBody>
                </Table>              
            </React.Fragment>
        );
    }
}

export default withApollo(BreaksTable);
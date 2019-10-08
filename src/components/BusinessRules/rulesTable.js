import React, {Fragment, Component} from 'react';

import withApollo from 'react-apollo/withApollo';
import withGlobalContent from "../Generic/Global";
import { withStyles } from '@material-ui/core/styles'; 

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tooltip from '@material-ui/core/Tooltip';


const CustomTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
        textAlign: "center"
    },
    body: {
        fontSize: 14,
        textAlign: "center"
    }
}))(TableCell);

class RulesTable extends Component{
    constructor(props) {
        super(props);

        this.state = {
            businessRules: [],
        }        
    }    

    setRuleActive = rule => _ =>{
        this.props.toggleActiveRule(rule.id, !rule.isActive);
    }

    handleEditButton = item => _ => {
        this.props.handleEdit(item);
    }

    renderTableRows = _ => {
        if(!this.props.businessRules || this.props.businessRules.length === 0) {
            return "No Business Rules have been set";
        }

        return (
            this.props.businessRules.map(rule => {
                return(
                    <TableRow>
                        <CustomTableCell>
                            <div className="tumi-row-centered">
                                <Tooltip title="Edit">
                                    <button
                                        className="btn btn-success float-left"
                                        onClick={this.handleEditButton(rule)}
                                    >
                                        <i className="fas fa-pen"></i>
                                    </button>
                                </Tooltip>
                            </div>
                        </CustomTableCell>
                        <CustomTableCell>{rule.id}</CustomTableCell>
                        <CustomTableCell>{rule.name.trim()}</CustomTableCell>
                        <CustomTableCell>{rule.ruleType.Name.trim()}</CustomTableCell>
                        <CustomTableCell>
                            <div className="onoffswitch" style={{margin: "0 auto"}}>
                                <input
                                    type="checkbox"
                                    checked={rule.isActive}                                    
                                    name="IsActive"
                                    className="onoffswitch-checkbox"
                                    id={`isActive-${rule.id}`}
                                    value={rule.isActive}
                                    onClick={this.setRuleActive(rule)}
                                />
                                <label className="onoffswitch-label" htmlFor={`isActive-${rule.id}`}>
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
            <Fragment>
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell className={"Table-head"} style={{ minWidth: '125px '}} >Actions</CustomTableCell>
                            <CustomTableCell className={"Table-head"} style={{ minWidth: '125px' }} >Id</CustomTableCell>
                            <CustomTableCell className={"Table-head"} style={{ minWidth: '125px' }} >Name</CustomTableCell>
                            <CustomTableCell className={"Table-head"} style={{ minWidth: '125px' }} >Type</CustomTableCell>
                            <CustomTableCell className={"Table-head"} style={{ minWidth: '125px' }} >Active</CustomTableCell>                            
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.renderTableRows()}                        
                    </TableBody>
                </Table> 
            </Fragment>
        );
    }
}

export default withApollo(withGlobalContent(RulesTable));
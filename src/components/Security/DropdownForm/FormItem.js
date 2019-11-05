import React, {Fragment, Component} from 'react';
import moment from "moment";

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { withStyles } from '@material-ui/core/styles';
import withApollo from "react-apollo/withApollo";

import { INSERT_ROL_FORM, TOGGLE_ROL_FORMS } from "./mutations";

const CustomTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

class RoleFormItem extends Component{
    constructor(props){
        super(props);

        this.state = {
            open: false,
            hasRelationship: false
        }
    }

    componentWillMount(){        
        this.setState(_ => ({
            hasRelationship: this.findMatch(this.props.item.Id, this.props.roleFormsInfo)
        }))
    }

    componentWillReceiveProps(nextProps){
        if(this.props.roleFormsInfo !== nextProps.roleFormsInfo && nextProps.roleFormsInfo.length > 0){
            this.setState(_ => ({
                hasRelationship: this.findMatch(this.props.item.Id, nextProps.roleFormsInfo)
            }));
        }
    }

    toggleOpen = _ => {
        this.setState(prev => ({
            open: !prev.open
        }))
    }

    toggleRelationship = _ => {
        this.setState(prev => ({
            hasRelationship: !prev.hasRelationship
        }), this.props.refreshData);
    }

    findMatch = (formId, roleFormsInfo) => {
        const found = roleFormsInfo.find(item => {
            return (item.IdForms === formId && item.IsActive)
        });

        return !!found;
    }

    updateRecord = _ => {
        //Find out if a creation or an edition is needed.
        const shouldEdit = this.props.roleFormsInfo.find(item => item.IdForms === this.props.item.Id);

        if(shouldEdit){
            const idsToUpdate = this.props.item.Children.map(item => {
                return item.Id
            });

            this.props.client.mutate({
                mutation: TOGGLE_ROL_FORMS,
                variables: {
                    rolesForms: [...idsToUpdate, this.props.item.Id],
                    IdRoles: this.props.role,
                    IsActive: !this.state.hasRelationship
                }                
            })
            .then(() => {
                this.props.refreshData();
                // this.toggleRelationship();
            })
            .catch(error => {
                console.log(error);                
            })
        } 
        
        else {
            const newRelation = {
                IdRoles: this.props.role,
                IdForms: this.props.item.Id,
                IsActive: 1,
                User_Created: 1,
                User_Updated: 1,
                Date_Created: moment().format("MM/DD/YYYY"),
                Date_Updated: moment().format("MM/DD/YYYY"),
            }

            const childRelations = this.props.item.Children.map(item => {
                return {
                    IdRoles: this.props.role,
                    IdForms: item.Id,
                    IsActive: 1,
                    User_Created: 1,
                    User_Updated: 1,
                    Date_Created: moment().format("MM/DD/YYYY"),
                    Date_Updated: moment().format("MM/DD/YYYY"),
                }
            })

            this.props.client.mutate({
                mutation: INSERT_ROL_FORM,
                variables: {
                    rolesforms: [newRelation, ...childRelations]
                }
            })
            .then(() => {
                // this.toggleRelationship();
            })
            .catch(error => {                
                console.log(error);
            })            
        }        
    }

    render(){
        const {Id, Code, Name, Value, Children} = this.props.item        
        return (
            <Fragment>
                <TableRow onClick={this.toggleOpen} style={{cursor: "pointer"}}>                
                    <CustomTableCell>
                        <div className="onoffswitch">
                            <input
                                type="checkbox"
                                checked={this.state.hasRelationship}
                                name={`${Id}-hasRelationship`}
                                className="onoffswitch-checkbox"
                                id={`${Id}-hasRelationship`}
                                value={this.state.hasRelationship}
                                // onChange={this.toggleRelationship}
                                onChange={this.updateRecord}
                            />
                            <label className="onoffswitch-label" htmlFor={`${Id}-hasRelationship`}>
                                <span className="onoffswitch-inner" />
                                <span className="onoffswitch-switch" />
                            </label>
                        </div>
                    </CustomTableCell>
                    <CustomTableCell>{Code}</CustomTableCell>
                    <CustomTableCell>{Name}</CustomTableCell>
                    <CustomTableCell>{Value}</CustomTableCell>                        
                </TableRow> 

                {
                    (Children && Children.length > 0) ? (
                        <TableRow style={{display: `${this.state.open ? "table-row" : "none"}`}}>
                            <CustomTableCell colspan={4} style={{paddingLeft: "50px !important"}}>
                                <table class="table">
                                    <thead>
                                        <tr>
                                        <th scope="col">Assigned</th>
                                        <th scope="col">Code</th>
                                        <th scope="col">Name</th>
                                        <th scope="col">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>                                
                                        {
                                            Children.map(item => {
                                                return (
                                                    <RoleFormItem item={item} roleFormsInfo={this.props.roleFormsInfo} />                                                    
                                                );
                                            })
                                        }                               
                                    </tbody>
                                </table>
                            </CustomTableCell>
                        </TableRow>         
                    ) : ""
                }
            </Fragment>
        )
    }
}

export default withApollo(RoleFormItem);
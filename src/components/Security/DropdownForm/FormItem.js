import React, {Fragment, Component} from 'react';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

import { withStyles } from '@material-ui/core/styles';

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
        // console.log(this.props.item);
        // console.log(this.props.roleFormsInfo);

        this.setState(_ => ({
            hasRelationship: this.findMatch(this.props.item.Id)
        }))
    }

    toggleOpen = _ => {
        this.setState(prev => ({
            open: !prev.open
        }))
    }

    findMatch = formId => {
        const found = this.props.roleFormsInfo.find(item => item.IdForms === formId );
        return !!found;
    }

    render(){
        const {Code, Name, Value, Children} = this.props.item
        
        return (
            <Fragment>
                <TableRow onClick={this.toggleOpen} style={{cursor: "pointer"}}>                
                    <CustomTableCell>
                        <div className="onoffswitch">
                            <input
                                type="checkbox"
                                checked={this.state.hasRelationship}
                                name="hasRelationship"
                                className="onoffswitch-checkbox"
                                id="hasRelationship"
                                value={this.state.hasRelationship}
                                onChange={() => {
                                    this.setState({
                                        
                                    }, () => {
                                        
                                    });
                                }}
                            />
                            <label className="onoffswitch-label" htmlFor="hasRelationship">
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
                                                    <tr>
                                                        <td>
                                                            <div className="onoffswitch">
                                                                <input
                                                                    type="checkbox"
                                                                    checked={this.findMatch(item.Id)}
                                                                    name="hasRelationship"
                                                                    className="onoffswitch-checkbox"
                                                                    id="hasRelationship"
                                                                    value={this.findMatch(item.Id)}
                                                                    onChange={() => {
                                                                        this.setState({
                                                                            
                                                                        }, () => {
                                                                            
                                                                        });
                                                                    }}
                                                                />
                                                                <label className="onoffswitch-label" htmlFor="hasRelationship">
                                                                    <span className="onoffswitch-inner" />
                                                                    <span className="onoffswitch-switch" />
                                                                </label>
                                                            </div>
                                                        </td>
                                                        <td>{item.Code}</td>
                                                        <td>{item.Name}</td>
                                                        <td>{item.Value}</td>
                                                    </tr>
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

export default RoleFormItem;
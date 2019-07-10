import React, { Component } from 'react'
import { GET_PROPERTIES_QUERY, GET_EMPLOYEEES_BY_PROPERTIES, GET_USERS_QUERY } from './queries';
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

const CustomTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    body: {
        fontSize: 14
    }
}))(TableCell);

const DEFAULT_PROPERTY = { value: 0, label: 'Select a Property' };
const DEFAULT_OPERATION = { value: 0, label: 'Select a Operation Manager' };

class TableConsolidated extends Component {

    DEFAULT_STATE = {
        properties: [],
        employeesByProperties: [],
        loading: true,
        property: '',
        users: [],
        propertyId: 0,
        operation: 0
    }

    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            rowsPerPage: 25,
            ...this.DEFAULT_STATE
        };
    }

    getProperties = () => {
		this.setState(() => ({ loadingProperties: true }), () => {
			this.props.client
				.query({
					query: GET_PROPERTIES_QUERY,
					fetchPolicy: 'no-cache'
				})
				.then(({ data }) => {

                    //Create structure based on property data
					const _options = data.getbusinesscompanies.map((property) => {
                        return { value: property.Id, label: property.Code + " | " + property.Name, key: property.Id };
                    });
                    
                    //Set default value for dropdown
                    let option = [...DEFAULT_PROPERTY, ..._options];
					//Set values to state
					this.setState(() => ({
						properties: option,
                        loadingProperties: false,
                        property: DEFAULT_PROPERTY
					}));

				})
				.catch(error => {
					this.setState(() => ({ loadingProperties: false }));
				});
		})
    }

    getUsers = () => {
        this.props.client.query({
            query: GET_USERS_QUERY,
            fetchPolicy: 'no-cache'
        }).then(({data}) => {
            const _options = data.user.map((user) => {
                return { value: user.Id, label: user.firstName + " " + user.lastName, key: user.Id };
            });
            
            //Set default value for dropdown
            let options = [...DEFAULT_OPERATION, ..._options];
            this.setState(() => ({
                users: options,
                user: DEFAULT_OPERATION
            }));

        }).catch((error) => {
            this.setState(() => ({ loadingProperties: false }));
        });
    }

    getDataFilters = () => {
        let variables;
        if (this.state.propertyId !== 0) {
            variables = {
                ...variables,
                property: {
                    Id: this.state.propertyId
                },
            };
        } else if (this.state.operation != 0) {
            variables = {
                ...variables,
                operationManagerId: this.state.operation
            };
        } 
        return variables;
    }

    getEmployeesByProperties = () => {
        this.props.client.query({
            query: GET_EMPLOYEEES_BY_PROPERTIES,
            variables: { ...this.getDataFilters() },
            fetchPolicy: 'no-cache'
        }).then(({ data }) => {
            this.setState(prevState => ({
                loading: true,
                employeesByProperties: data.employeesByProperties
            }), _ => {
                this.setState(prevState => ({loading: false}))
            });

        }).catch(error => {
            this.setState(() => ({ loadingProperties: false }));
        });
    }

    componentWillMount() {
        this.getProperties();
        this.getEmployeesByProperties();
        this.getUsers();
    }
    
    handlePropertyChange = (property) => {
        this.setState(() => ({ 
            property,
            propertyId: property.value,
            loading: true,
        }), _ => {
            this.getEmployeesByProperties();
        });
    };

    handleUserChange = (user) => {
        this.setState(() => ({ 
            user,
            operation: user.value,
            loading: true,
        }), _ => {
            this.getEmployeesByProperties();
        });
    };

    render() {
        let items = this.state.employeesByProperties;
        const { rowsPerPage, page } = this.state;
        return(
            <React.Fragment>
                 <div className="row justify-content-end">
					<div className="col-2">
                        <Select
                            name="property"
                            options={this.state.properties}
                            value={this.state.property}
                            onChange={this.handlePropertyChange}
                            // components={makeAnimated()}
                            closeMenuOnSelect
                        />
					</div>
                    <div className="col-2">
                        <Select
                            name="user"
                            options={this.state.users}
                            value={this.state.user}
                            onChange={this.handleUserChange}
                            // components={makeAnimated()}
                            closeMenuOnSelect
                        />
					</div>
				</div>
                <div className="card">
                    <div className="card-body">
                        {this.state.loading ? <LinearProgress />: ""}
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <CustomTableCell className={"Table-head"}>Code</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Property Name</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Operating Department</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Last Visited</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Associates</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Avg Hours</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Management</CustomTableCell>
                                    <CustomTableCell className={"Table-head"}>Ops Manager</CustomTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
                                    return (
                                        <TableRow>
                                            <CustomTableCell>{row.code}</CustomTableCell>
                                            <CustomTableCell>{row.name}</CustomTableCell>
                                            <CustomTableCell>{row.count_department}</CustomTableCell>
                                            <CustomTableCell>{row.count_associate}</CustomTableCell>
                                            <CustomTableCell>--</CustomTableCell>
                                            <CustomTableCell>--</CustomTableCell>
                                            <CustomTableCell>{row.management_company}</CustomTableCell>
                                            <CustomTableCell>{row.operationManager === "null null" ? "No Name" : row.operationManager}</CustomTableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                            <TableFooter>

                                {items.length > 0 && (
                                    <TablePagination
                                        colSpan={1}
                                        count={items.length}
                                        rowsPerPage={rowsPerPage}
                                        page={page}
                                        onChangePage={this.handleChangePage}
                                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    />
                                )}

                            </TableFooter>
                        </Table>
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

export default withApollo(TableConsolidated);
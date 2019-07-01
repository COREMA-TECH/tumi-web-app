import React, { Component, Fragment } from 'react';
import Accordion from '../ui-components/Accordion';
import Select from 'react-select';

import { GET_PROPERTIES_QUERY, GET_EMPLOYEEES_BY_PROPERTIES } from './queries';
import withApollo from 'react-apollo/withApollo';
import moment from 'moment';
import LinearProgress from '@material-ui/core/LinearProgress/LinearProgress';

class EmployeesProperties extends Component{

    state = {
        properties: [],
        employeesByProperties: [],
        loading: true
    }

    getProperties = () => {
		this.setState(() => ({ loadingProperties: true }), () => {
			this.props.client
				.query({
					query: GET_PROPERTIES_QUERY,
					fetchPolicy: 'no-cache'
				})
				.then(({ data }) => {
                    let options = [];
                    
					//Create structure based on property data
					data.getbusinesscompanies.map((property) => {
						options.push({ value: property.Id, label: property.Code + " | " + property.Name, key: property.Id });
					});

					//Set values to state
					this.setState(() => ({
						properties: options,
						loadingProperties: false
					}));

				})
				.catch(error => {
					this.setState(() => ({ loadingProperties: false }));
				});
		})
    }

    getEmployeesByProperties = () => {
        this.props.client.query({
            query: GET_EMPLOYEEES_BY_PROPERTIES,
            fetchPolicy: 'no-cache'
        }).then(({ data }) => {
            this.setState(prevState => ({
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
	}

    render(){
        return(
            <Fragment>
                <div className="row justify-content-end">
					<div className="col-2">
                        <label htmlFor="" className="font-weight-bold">Property</label>
                        <Select
                            name="property"
                            options={this.state.properties}
                            // value={this.state.property}
                            // onChange={this.handlePropertyChange}
                            // components={makeAnimated()}
                            closeMenuOnSelect
                        />
					</div>
				</div>
                <div className="card">
                    <div className="card-header">
                        Employees by Properties
                    </div>
                    <div className="card-body p-0">
                        {this.state.loading ? <LinearProgress />: ""}
                        {this.state.employeesByProperties.map(property => {
                            return <Accordion title={property.code + " | " + property.name}>
                                <div className="w-100">
                                    <div className="p-3">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th className="Table-head">Code</th>
                                                    <th className="Table-head">PropertyName</th>
                                                    <th className="Table-head">Operating Department</th>
                                                    <th className="Table-head">Associates</th>
                                                    <th className="Table-head">Last Visited</th>
                                                    <th className="Table-head">Avg Hours</th>
                                                    <th className="Table-head">Management</th>
                                                    <th className="Table-head">Ops Manager</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>{property.code}</td>
                                                    <td>{property.name}</td>
                                                    <td>{property.count_department}</td>
                                                    <td>{property.count_associate}</td>
                                                    <td>--</td>
                                                    <td>--</td>
                                                    <td>{property.management_company}</td>
                                                    <td>{property.operationManager === "null null" ? "No Name" : property.operationManager}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="mt-4 p-3">
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th className="Table-head">No</th>
                                                    <th className="Table-head">Associate Name</th>
                                                    <th className="Table-head">Position</th>
                                                    <th className="Table-head">LOS</th>
                                                    <th className="Table-head">Start Date</th>
                                                    <th className="Table-head">Phone</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {property.employees.map(employee => {
                                                    return <tr>
                                                        <td>{employee.id}</td>
                                                        <td>{employee.name}</td>
                                                        <td>{employee.position}</td>
                                                        <td>{employee.los}</td>
                                                        <td>{employee.startDate !== "N/A" ? moment(employee.startDate).format("MM/DD/YYYY") : "N/A"}</td>
                                                        <td>{employee.phone}</td>
                                                    </tr>
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                    
                                </div>
                            </Accordion>
                        })}
                        
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default withApollo(EmployeesProperties);
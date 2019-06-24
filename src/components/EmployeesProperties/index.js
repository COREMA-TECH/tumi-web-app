import React, { Component, Fragment } from 'react';
import Accordion from '../ui-components/Accordion';
import Select from 'react-select';

import { GET_PROPERTIES_QUERY } from './queries';
import withApollo from 'react-apollo/withApollo';

class EmployeesProperties extends Component{

    state = {
        properties: []
    }

    getProperties = () => {
		this.setState(() => ({ loadingProperties: true }), () => {
			this.props.client
				.query({
					query: GET_PROPERTIES_QUERY,
					fetchPolicy: 'no-cache'
				})
				.then(({ data }) => {
                    console.log(data, 'properties de employees-property');
                    let options = [];
                    
					//Create structure based on property data
					data.getbusinesscompanies.map((property) => {
						options.push({ value: property.Id, label: property.Code + " | " + property.Name });
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

    componentWillMount() {
		this.getProperties();
	}

    render(){
        return(
            <Fragment>
                <div className="row justify-content-end">
					<div className="col-3">
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

                    </div>
                    <div className="card-body">
                        <Accordion title="Springhill Suites Inidianapolis - Carmel">
                            <div className="w-100">
                                <div className="pb-3 border-bottom">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Code</th>
                                                <th>PropertyName</th>
                                                <th>Operating Department</th>
                                                <th>Associates</th>
                                                <th>Last Visited</th>
                                                <th>Avg Hours</th>
                                                <th>Management</th>
                                                <th>Ops Manager</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>SSCI</td>
                                                <td>Springhill Suites Indianapolis</td>
                                                <td>1</td>
                                                <td>8</td>
                                                <td>4/30/2019</td>
                                                <td>320</td>
                                                <td>Interstate Hotels</td>
                                                <td>Richard Ponton</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div className="mt-4">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>No</th>
                                                <th>Associate Name</th>
                                                <th>Hotel</th>
                                                <th>Position</th>
                                                <th>LOS</th>
                                                <th>Start Date</th>
                                                <th>Phone</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>1</td>
                                                <td>Sonia Ramirez</td>
                                                <td>SSCI</td>
                                                <td>Hisk-3</td>
                                                <td>425</td>
                                                <td>4/6/2018</td>
                                                <td>317-252-2825</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                
                            </div>
                        </Accordion>

                        
                    </div>
                </div>
            </Fragment>
        )
    }
}

export default withApollo(EmployeesProperties);
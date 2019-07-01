import React, { Component, Fragment } from 'react';
import Select from 'react-select';
import VisitTable from './VisitTable';
import MasterShift from "./MasterShift";

import Accordion from '../ui-components/Accordion';

import withApollo from 'react-apollo/withApollo';
import { GET_OP_MANAGER, GET_PROPERTIES_QUERY } from './Queries';

class Visit extends Component{

    state = {
        opManagers: [],
        opManagerFiltered: [],
        opManagerOptions: [],
        opManagerSelected: 0,
        properties: [],
        masterShiftOpen: false
    }

    handleMasterShift = (open) => {
        this.setState((prevState) => {
            return { masterShiftOpen: open }
        })
    }

    getOpManagers = () => {
		this.setState(() => ({ loadingOpManagers: true }), () => {
			this.props.client
				.query({
					query: GET_OP_MANAGER,
					fetchPolicy: 'no-cache'
				})
				.then(({ data }) => {
                    let options = [];

                    options = data.user.map((opManager) => {
						return { ...opManager, value: opManager.Id, label: opManager.Full_Name };
                    });

                    options = [{value:0, label: 'All Op. Manager'}, ...options]
                    
                    //Set values to state
					this.setState(() => ({
                        opManagers: data.user,
                        opManagerFiltered: data.user,
                        opManagerOptions: options,
						loadingOpManagers: false
					}));

				})
				.catch(error => {
					this.setState(() => ({ loadingOpManagers: false }));
				});
		})
    }

    filterOpManager = (option) => {
        if(option.value === 0){
            this.setState((prevState) => {
                return {
                    opManagerFiltered: prevState.opManagers,
                    opManagerSelected: 0
                }
            })
        }
        else{
            this.setState((prevState) => {
                return {
                    opManagerSelected: option.value, 
                    opManagerFiltered: prevState.opManagers.filter(item => {
                        return item.Id === option.value
                    })
                }
            })
        }
    }

    getProperties = () => {
		this.props.client
			.query({
				query: GET_PROPERTIES_QUERY,
				fetchPolicy: 'no-cache'
			})
			.then(({ data }) => {
				this.setState({
					properties: data.getbusinesscompanies
				});
			})
			.catch(error => {
				console.log(error)
			});
    }

    getVisits = () => {
		this.props.client
			.query({
				query: GET_PROPERTIES_QUERY,
				fetchPolicy: 'no-cache'
			})
			.then(({ data }) => {
				this.setState({
					properties: data.getbusinesscompanies
				});
			})
			.catch(error => {
				console.log(error)
			});
    }

    componentWillMount() {
        this.getOpManagers();
        this.getProperties();
	}

    render() {
        const { properties, opManagerOptions, opManagerFiltered } = this.state;
        return (
            <Fragment>
                <div className="row justify-content-end">
					<div className="col-3">
                        <Select
                            name="opManagers"
                            options={opManagerOptions}
                            onChange={(option) => this.filterOpManager(option)}
                            closeMenuOnSelect
                        />

                        <button type="button" className="btn btn-success mt-2 float-right" onClick={() => this.handleMasterShift(true)}>
                            New Visit
                        </button>
					</div>
				</div>
                <div className="card">
                    <div className="card-header">
                        Operation managers
                    </div>
                    <div className="card-body">
                        {
                            opManagerFiltered.map(item => {
                                return (
                                    <Accordion key={item.Id} title={item.Full_Name}>
                                        <VisitTable data={properties}/>
                                    </Accordion>
                                )
                            })
                        }
                        
                    </div>
                </div>

                <MasterShift open={this.state.masterShiftOpen} propertiesData={properties} handleClose={() => this.handleMasterShift(false)} />


            </Fragment>
        )
    }
}

export default withApollo(Visit);
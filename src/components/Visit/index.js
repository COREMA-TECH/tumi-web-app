import React, { Component, Fragment } from 'react';
//import Select from 'react-select';
import VisitTable from './VisitTable';
import MasterShift from "./MasterShift";

import Accordion from '../ui-components/Accordion';

import withApollo from 'react-apollo/withApollo';
import { GET_OP_MANAGER, GET_PROPERTIES_QUERY, GET_VISIT_BY_ID_QUERY } from './Queries';

import withGlobalContent from "../Generic/Global";

class Visit extends Component{

    state = {
        userId: 0,
        opManagers: [],
        opManagerFiltered: [],
        opManagerOptions: [],
        opManagerSelected: 0,
        properties: [],
        openingMasterShift: false,
        masterShiftHandle: {
            open: false,
            closeVisit: false,
            data: []
        }
    }

    handleCloseMasterShift = () => {
        this.setState(() => {
            return { 
                masterShiftHandle:{
                    open: false,
                    closeVisit: false,
                    data: []
                }
            }
        });
    }

    handleNewVisit = () => {
        this.setState(() => {
            return { 
                masterShiftHandle:{
                    open: true,
                    closeVisit: false,
                    data: []
                }
            }
        });
    }

    handleCloseVisit = (visitId) => {
        if(this.state.openingMasterShift === false){
            this.setState(() => {
                return{
                    openingMasterShift: true
                }
            }, () => {
                this.props.client
                    .query({
                        query: GET_VISIT_BY_ID_QUERY,
                        fetchPolicy: 'no-cache',
                        variables: {
                            id: visitId || 0
                        },
                    })
                    .then(({ data }) => {
                        this.setState(() => {
                            return { 
                                openingMasterShift: false,
                                masterShiftHandle:{
                                    open: true,
                                    closeVisit: true,
                                    data: data
                                }
                            }
                        });
                    })
                    .catch(error => {
                        this.setState(() => {
                            return { 
                                openingMasterShift: false
                            }
                        }, () => {
                            console.log(error);
                            this.props.handleOpenSnackbar(
                                'success',
                                'Error when opening the visit',
                                'bottom',
                                'right'
                            );
                        });
                    });
            });

        }
    }

    getOpManagers = () => {
		this.setState(() => ({ loadingOpManagers: true }), () => {
			this.props.client
				.query({
					query: GET_OP_MANAGER,
                    fetchPolicy: 'no-cache',
                    variables: {
                        id: this.state.userId
                    }
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

    componentWillMount() {
        this.setState(() => {
            let userId = 258; //localStorage.getItem('LoginId');
            return { userId: userId }
        }, () => {
            this.getOpManagers();
            this.getProperties();
        })
	}

    render() {
        const { properties, opManagerOptions, opManagerFiltered } = this.state;
        return (
            <Fragment>
                <div className="row justify-content-end">
					<div className="col-3">
                        {/* <Select
                            name="opManagers"
                            options={opManagerOptions}
                            onChange={(option) => this.filterOpManager(option)}
                            closeMenuOnSelect
                        /> */}

                        <button type="button" className="btn btn-success mt-2 float-right" onClick={this.handleNewVisit}>
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
                                    <Accordion key={item.Id} title={item.Full_Name + '-' + item.Id}>
                                        <VisitTable opManagerId={item.Id} handleCloseVisit={this.handleCloseVisit}/>
                                    </Accordion>
                                )
                            })
                        }
                    </div>
                </div>

                <MasterShift open={this.state.masterShiftHandle.open} actions={this.state.masterShiftHandle} propertiesData={properties} handleClose={this.handleCloseMasterShift} />


            </Fragment>
        )
    }
}

export default withApollo(withGlobalContent(Visit));
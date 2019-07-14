import React, { Component, Fragment } from 'react';
import VisitTable from './VisitTable';
import MasterShift from "./MasterShift";
import Select from 'react-select';
import Accordion from '../ui-components/Accordion';
import VisitCard from './VisitCards';

import Switch from '@material-ui/core/Switch';
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import ConfirmDialog from 'material-ui/ConfirmDialog';

import withApollo from 'react-apollo/withApollo';
import { GET_OP_MANAGER, GET_PROPERTIES_QUERY, GET_VISITS_QUERY, GET_VISIT_BY_ID_QUERY } from './Queries';
import { UPDATE_VISIT_QUERY } from './Mutations';
import { OP_MANAGER_ROL_ID } from './Utilities';
import withGlobalContent from "../Generic/Global";



class Visit extends Component{

    state = {
        loading: false,
        openConfirm: false,
        visitToDelete: null,
        userId: 0,
        rolId: 0,
        isOpManager: false,
        regionId: null, // solo se llenará cuando el usuario sea op manager
        opManagers: [],
        opManagerFiltered: [],
        opManagerOptions: [],
        opManagerSelected: {
            value:0, 
            label: 'All Op. Manager'
        },
        properties: [],
        visits: [],
        openingMasterShift: false,
        masterShiftHandle: {
            open: false,
            closeVisit: false,
            data: []
        },
        gridView: false
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
		this.setState(() => ({ loading: true }), () => {
			this.props.client
				.query({
					query: GET_OP_MANAGER,
                    fetchPolicy: 'no-cache'
				})
				.then(({ data }) => {
                    let options = [];
                    let {isOpManager, userId} = this.state;

                    let opManagerList = isOpManager ? data.user.filter(om => om.Id === userId) : data.user

                    options = opManagerList.map((opManager) => {
						return { ...opManager, value: opManager.Id, label: opManager.Full_Name };
                    });

                    options = [{value:0, label: 'All Op. Manager'}, ...options]

                    let loggedOpManager = null;
                    if(isOpManager) loggedOpManager = opManagerList[0];
                    
                    //Set values to state
					this.setState(() => ({
                        opManagers: opManagerList,
                        opManagerFiltered: opManagerList,
                        opManagerOptions: options,
                        loading: false,
                        regionId: loggedOpManager ? loggedOpManager.IdRegion : null
					}), () => this.getProperties());

				})
				.catch(error => {
					this.setState(() => ({ loading: false }));
				});
		})
    }

    getVisits = () => {
        this.setState(() => {
            return { loading: true}
        }, () => {
            this.props.client
                .query({
                    query: GET_VISITS_QUERY,
                    fetchPolicy: 'no-cache'
                })
                .then(({ data }) => {
                    this.setState({
                        visits: data.visits,
                        loading: false
                    });
                })
                .catch(error => {
                    console.log(error)
                    this.setState(() => {
                        return {loading: false}
                    })
                });
        });
    }

    disableVisit = (visit) => {
        this.setState(() => {
            return { openConfirm: true, visitToDelete: visit }
        });
    }

    disableVisitConfirmed = (visit) => {
        this.setState(() => {
            return { loading: true }
        }, () => {
            this.props.client.mutate({
                mutation: UPDATE_VISIT_QUERY,
                variables: {
                    visit: {
                        id: visit.id,
                        startTime: visit.startTime, // required
                        endTime: visit.endTime, // required
                        isActive: false
                    }
                }
            })
            .then(({ data }) => {
                this.setState(() => {
                    return {
                        loading: false,
                        openConfirm: false
                    }
                }, () => {
                    this.getVisits();
                    this.props.handleOpenSnackbar('success', 'Visit was deleted!');
                });
            })
            .catch(error => {
                console.log(error)
                this.setState(() => {
                    return {
                        loading: false
                    }
                }, () => {
                    this.props.handleOpenSnackbar('error', 'Error deleting visit');
                })
            });
        });
    }

    filterOpManager = (option) => {
        this.setState((prevState) => {
            let opManagers = !!option.value ? prevState.opManagers.filter(item => item.Id === option.value) : prevState.opManagers;
            return {
                opManagerFiltered: opManagers,
                opManagerSelected: option
            }
        });
    }

    getProperties = () => {
        let{ isOpManager, regionId } = this.state;
        let variables = isOpManager 
                        ? { Region: regionId ? regionId : 0 }
                        : {}  
		this.props.client
			.query({
				query: GET_PROPERTIES_QUERY,
                fetchPolicy: 'no-cache',
                variables
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

    handleGridView = () => {
        this.setState((prevState) => {
            return { gridView: !prevState.gridView }
        });
    }

    componentWillMount() {
        this.setState(() => {
            let userId = localStorage.getItem('LoginId');
            let rolId = localStorage.getItem('IdRoles');
            return { 
                userId: !!userId ? +userId : 0,
                rolId: !!rolId ? +rolId : 0,
                isOpManager: !!rolId && +rolId === OP_MANAGER_ROL_ID
            }
        }, () => {
            this.getOpManagers();
            this.getVisits();
        })
    }

    componentWillUpdate(nextProps, nextState){
        let masterShiftOpen = nextState.masterShiftHandle.open;
        let lastMasterShifOpen = this.state.masterShiftHandle.open;
        if(masterShiftOpen !== lastMasterShifOpen && !masterShiftOpen){
            this.getVisits();
        }
    }
    
    render() {
        const { isOpManager, properties, opManagerOptions, opManagerSelected, opManagerFiltered, masterShiftHandle, visits, gridView } = this.state;

        if (this.state.loading) {
            return (
                <LinearProgress />
            )
        }

        let content;
        if(gridView){
            content = <div className="row">
                        {
                            opManagerFiltered.map(opMan => {
                                return visits.filter(v => v.OpManagerId === opMan.Id).map(visit => {
                                    return <VisitCard key={visit.id} opManager={opMan} visit={visit} handleCloseVisit={this.handleCloseVisit} handleDisableVisit={this.disableVisit} />
                                });
                            })
                        }
                        </div>
        }
        else{
            content = <div className="card">
                        <div className="card-header">
                            Operation managers
                        </div>
                        <div className="card-body">
                            {
                                opManagerFiltered.map(item => {
                                    let vistsByOpManager = visits.filter(v => v.OpManagerId === item.Id);
                                    return (
                                        <Accordion key={item.Id} title={item.Full_Name}>
                                            <VisitTable opManagerId={item.Id} visits={vistsByOpManager} handleCloseVisit={this.handleCloseVisit} handleDisableVisit={this.disableVisit} />
                                        </Accordion>
                                    );
                                })
                            }
                        </div>
                    </div>
        }

        return (
            <Fragment>
                <div className="row align-items-end justify-content-end">
                    <div className="col-1">
                        <label htmlFor="">Grid View</label>
                        <Switch
                            checked={gridView}
                            onChange={this.handleGridView}
                            color="primary"
                        />
                    </div>
                    <div className={`col-${isOpManager ? '1' : '2'} pl-1`}>
                    {
                        !isOpManager && 
                            <Fragment>
                                <label htmlFor="">Op. Managers</label>
                                <Select
                                    name="opManager"
                                    options={opManagerOptions}
                                    onChange={this.filterOpManager}
                                    closeMenuOnSelect
                                    value={opManagerSelected}
                                />
                            </Fragment>
                    }
                    {
                        isOpManager &&
                            <button type="button" className="btn btn-sm btn-success btn-block px-1 my-2 float-right" onClick={this.handleNewVisit}>
                                New Visit
                            </button>
                    }
                    </div>
				</div>

                {
                    content
                }

                <MasterShift open={masterShiftHandle.open} actions={masterShiftHandle} propertiesData={properties} handleClose={this.handleCloseMasterShift} addNewVisit={this.addNewVisit}/>

                <ConfirmDialog
                    open={this.state.openConfirm}
                    closeAction={() => {
                        this.setState({ openConfirm: false });
                    }}
                    confirmAction={() => {
                        this.disableVisitConfirmed(this.state.visitToDelete);
                    }}
                    title={'are you sure you want to cancel this record?'}
                    loading={this.state.loading}
                />
            </Fragment>
        )
    }
}

export default withApollo(withGlobalContent(Visit));
import React, { Component } from 'react';
import gql from 'graphql-tag';
import withApollo from 'react-apollo/withApollo';
import HotelDialog from '../../MainContainer/Toolbar/Main/HotelDialog';
import AlertDialogSlide from 'Generic/AlertDialogSlide';
import withGlobalContent from 'Generic/Global';
import Select from 'react-select';
import makeAnimated from 'react-select/lib/animated';
import TextTruncate from 'react-text-truncate';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

{/* <a href="" onClick={this.handleFindByTag(false)} className="badge badge-danger mr-1">Not Assigned (Orphan)</a>
    <a href="" onClick={this.handleFindByTag(true)} className="badge badge-success mr-1">Assigned (Managed)</a>
    <a href="" onClick={this.handleFindByTag(0)} className="badge badge-info">All</a> */}
const ASSIGNED_FILTER_OPT = [
    {value: true, label: 'Assigned (Managed)'},
    {value: false, label: 'Not Assigned (Orphan)'},
    {value: 0, label: 'All'}
];

class HotelList extends Component {
    constructor() {
        super();
        this.state = {
            open: false,
            hotels: [],
            openAlert: false,
            deleteId: null,
            loadingRemoving: false,
            Markup: 0,
            idProperty: null,
            idCompany: null,
            searchbox: '',
            regions: [],
            showInactiveProperties: false,
            totalProperties: 0,
            assignedFilterOpt: ASSIGNED_FILTER_OPT,
            assignedFilterSelected: {value: 0, label: 'All'},
            openConfirmActivateProperty: false,
            updateOnActivateProperty: null
        }
    }

    getCompaniesQuery = gql`
        query getbusinesscompanies($Id_Parent: Int, $IsActive: Int) {
            getbusinesscompanies(IsActive: $IsActive, Id_Parent: $Id_Parent) {
                Id
                Id_Contract
                Id_Company
                Code
                Name
                Region
                Description
                ImageURL
                Address
                Id_Parent
                IsActive
            }
        }
    `;

    getPropertiesCountQuery = gql`
        query propertiesByUserCount($userId: Int) {
            propertiesByUserCount(userId: $userId)
        }
    `;

    GET_REGIONS_USER_QUERY = gql`
        query regionsUsersByUsersId($UserId: [Int]) {
            regionsUsersByUsersId(UserId: $UserId, isActive: true) {
                id
                RegionId
                CatalogItem{
                    Id
                    Name
                }
            }
        }
    `;

    UPDATE_PROPERTY = gql`
        mutation updateBusinessCompany($businessCompany: inputUpdateBusinessCompany) {
            updateBusinessCompany(businessCompany: $businessCompany) {
                Id
            }
        }
    `;

    deleteCompanyQuery = gql`
		mutation DeleteCompany($Id: Int!, $IsActive: Int!) {
			delbusinesscompanies(Id: $Id, IsActive: $IsActive) {
				Code
				Name
			}
		}
    `;

    deleteCompany = () => {
        this.setState({
            loadingRemoving: true
        }, () => {
            this.props.client.mutate({
                mutation: this.deleteCompanyQuery,
                variables: {
                    Id: this.state.deleteId,
                    IsActive: 0
                }
            }).then((data) => {
                this.setState({
                    openAlert: false,
                    loadingRemoving: false
                }, () => {
                    this.props.handleOpenSnackbar('success', 'Company Deleted!');
                    this.getHotels(-1);
                });
            }).catch((error) => {
                this.setState({
                    openAlert: false,
                    loadingRemoving: false
                }, () => {
                    this.props.handleOpenSnackbar('error', 'Error: Deleting Company: ' + error);
                });
            });
        }
        );
    };

    handleConfirmAlertDialog = () => {
        this.getHotels(-1);
    };

    getRegionsByUser = () => {
        const currentUser = localStorage.getItem('LoginId');
        this.props.client.query({
            query: this.GET_REGIONS_USER_QUERY,
            variables: { UserId: currentUser ? [Number.parseInt(currentUser)] : null },
            fetchPolicy: 'no-cache'
        }).then(({ data }) => {
            if(data.regionsUsersByUsersId){
                const regions = data.regionsUsersByUsersId.map(ru => ru.CatalogItem);
                this.setState({
                    regions
                });
            }
            this.getHotels(-1);
        }).catch(err => {
            this.setState({
                regions: []
            });
            this.getHotels(-1);
        });
    }

    UNSAFE_componentWillMount() {
        //this.getHotels(-1);
        this.getRegionsByUser();
        this.getPropertiesCount();
    }

    getHotels = (idParent) => {
        let params = {Id_Parent: idParent};
        if(!this.state.showInactiveProperties) params = {...params, IsActive: 1}
        this.props.client.query({
            query: this.getCompaniesQuery,
            variables: params,
            fetchPolicy: 'no-cache'
        }).then(({ data }) => {
            if(data.getbusinesscompanies){
                const regionsId = this.state.regions.map(r => r.Id);
                const hotelsFound = data.getbusinesscompanies.filter(bc => regionsId.includes(bc.Region));
                this.setState({
                    hotels: hotelsFound,
                    allHotels: hotelsFound
                });
            }
        }).catch();
    }

    getPropertiesCount = () => {
        const currentUser = localStorage.getItem('LoginId');
        this.props.client.query({
            query: this.getPropertiesCountQuery,
            variables: {userId: currentUser ? Number.parseInt(currentUser) : 0},
            fetchPolicy: 'no-cache'
        }).then(({ data }) => {
            this.setState({totalProperties: data.propertiesByUserCount});
        }).catch(_ => this.setState({totalProperties: 0}));
    }

    handleClickOpen = (event) => {
        event.preventDefault();
        this.setState({
            open: true,
            idProperty: null
        });
    };

    handleAlertOpen = (deleteId) => {
        this.setState({
            openAlert: true,
            deleteId: deleteId
        });
    };

    handleCloseAlertDialog = () => {
        this.setState({ openAlert: false, deleteId: null }, _ => {
            this.getHotels();
        });
    };

    handleClose = () => {
        this.setState({ open: false }, _ => {
            this.getHotels(-1);
        });
    };

    handleClickOpenEdit = (boolValue, id, rate, idCompany, isActive) => (event) => {
        //if (!this.props.showStepper) return false;
        console.log('ola ke ase',event); // TODO:(LF) Quitar esta linea
        event.preventDefault();

        if(isActive){
            this.setState({
                propertyClick: boolValue,
                idProperty: id,
                Markup: rate,
                idCompany: idCompany
            }, () => {
                this.setState({ open: true });
            });
        }
        else{
            this.setState({
                openConfirmActivateProperty: true,
                updateOnActivateProperty: {
                    propertyClick: boolValue,
                    idProperty: id,
                    Markup: rate,
                    idCompany: idCompany
                }
                //this.handleClickOpenEdit(boolValue, id, rate, idCompany, true)
            });
        }
    };

    handleCloseConfirmActivateProperty = () => {
        this.setState({
            openConfirmActivateProperty: false,
            updateOnActivateProperty: null
        });
    }

    handleActivateProperty = () => {
        const stateToUpdate = this.state.updateOnActivateProperty;
        this.props.client.mutate({
            mutation: this.UPDATE_PROPERTY,
            variables: { 
                businessCompany: {
                    Id: stateToUpdate ? stateToUpdate.idProperty : 0,
                    IsActive: 1
                }
            },
            fetchPolicy: 'no-cache'
        }).then(({ data }) => {
            console.log('reactivando el property KKK', data); // TODO: (LF) Quitar console log
            this.props.handleOpenSnackbar('success', 'Property Activated!');
            this.setState({
                openConfirmActivateProperty: false,
                ...stateToUpdate,
                updateOnActivateProperty: null,
            }, _ => {
                this.getHotels(-1);
                this.getPropertiesCount();
                this.setState({ open: true })
            });
        }).catch(err => {
            this.props.handleOpenSnackbar('error', 'Error to activate property');
        });
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        let hotelFind = [];

        if (value != "") {
            let dataEmployees = this.state.allHotels.filter((_, i) => {
                if (value === "") {
                    return true;
                }

                if (
                    _.Name.indexOf(value) > -1 ||
                    _.Name.toLocaleLowerCase().indexOf(value.toLowerCase()) > -1 ||
                    _.Name.toLocaleUpperCase().indexOf(value.toUpperCase()) > -1 ||
                    _.Code.indexOf(value) > -1 ||
                    _.Code.toLocaleLowerCase().indexOf(value.toLowerCase()) > -1 ||
                    _.Code.toLocaleUpperCase().indexOf(value.toUpperCase()) > -1 
                    
                ) {
                    return true;
                }
            });

            this.setState({
                hotels: dataEmployees
            });
        } else {
            this.getHotels(-1);
        }
    };

    handleFindByTag = (selected) => {
        if(!selected) return;
        this.setState({
            assignedFilterSelected: selected
        });
        switch (selected.value) {
            case true:
                this.getHotels(-2);
                break;
            case 0:
                this.getHotels(-1);
                break;
            default:
                this.getHotels(99999);
                break;
        }
    };

    handleShowInactivePropertiesChange = () => {
        this.setState(prevState => {
            return {showInactiveProperties: !prevState.showInactiveProperties}
        }, _ => this.getHotels(-1));
    }

    render() {
        return (
            <div className="container-fluid">
                <ul className="row d-flex align-items-end">
                    <div className="col-md-4 col-xl-3">
                        <div className="input-group">
                            <input onChange={this.handleChange} type="text" name="searchbox" className="form-control" placeholder="Search" />
                            <div className="input-group-append">
                                <span className="input-group-text">
                                    <i className="fas fa-search"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 col-xl-4 d-flex">
                        <div className="flex-grow-1">
                            <span>
                                Assigned Filter
                            </span>
                            <Select
                                options={this.state.assignedFilterOpt}
                                value={this.state.assignedFilterSelected}
                                onChange={this.handleFindByTag}
                                closeMenuOnSelect={true}
                                components={makeAnimated()}
                            />
                        </div>
                        <div className="ml-4">
                            <span>
                                Show Inactive Properties
                            </span>
                            <div className="onoffswitch">
                                <input
                                    id="inactiveProperties"
                                    onChange={this.handleShowInactivePropertiesChange}
                                    checked={this.state.showInactiveProperties}
                                    value={this.state.showInactiveProperties}
                                    name="inactiveProperties"
                                    type="checkbox"
                                    min="0"
                                    maxLength="50"
                                    minLength="10"
                                    className="onoffswitch-checkbox"
                                />
                                <label className="onoffswitch-label" htmlFor="inactiveProperties">
                                    <span className="onoffswitch-inner" />
                                    <span className="onoffswitch-switch" />
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-2 col-xl-5">
                        <div className="float-right">
                            <button className="btn btn-success mt-2 mb-1" onClick={this.handleClickOpen}>
                                Add New Property
                            </button>
                        </div>
                    </div>
                    <div className="col-md-12 mt-3">
                        <span className="text-success font-weight-bold">Total properties(Active and inactive): {this.state.totalProperties} </span>
                    </div>
                    <AlertDialogSlide
                        handleClose={this.handleCloseAlertDialog}
                        handleConfirm={this.handleConfirmAlertDialog}
                        open={this.state.openAlert}
                        loadingConfirm={this.state.loadingRemoving}
                        content="Do you really want to continue whit this operation?"
                    />
                    {this.state.hotels.map((hotel, i) => (
                        <li key={i} className="col-md-4 col-xl-2">
                            <div className={`HotelCard-wrapper ${hotel.IsActive === 0 ? 'opacity-4' : ''}`}>
                                <div className="HotelCard-controls">
                                    <button className="btn btn-link" onClick={(e) => { this.handleAlertOpen(hotel.Id) }}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                                <a href="" onClick={this.handleClickOpenEdit(true, hotel.Id, hotel.rate, hotel.Id_Parent, hotel.IsActive === 1)} className={hotel.Id_Parent === 99999 ? "HotelCard-item border-dark" : "HotelCard-item"}>
                                    <div className="HotelCard-img">
                                        <figure>
                                            <img src={`${hotel.ImageURL}`} alt="" />
                                        </figure>
                                    </div>
                                    <div className="HotelCard-info">
                                        <div className="HotelCard-title">
                                            {`${hotel.Name.trim()}`}
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>
                <HotelDialog
                    open={this.state.open}
                    Markup={this.state.Markup}
                    idCompany={this.state.idCompany}
                    idProperty={this.state.idProperty}
                    handleClose={this.handleClose}
                    handleOpenSnackbar={this.props.handleOpenSnackbar}
                />

                <Dialog maxWidth="md" open={this.state.openConfirmActivateProperty} >
                    <DialogContent>
                        <h3 className="text-center">To manage a property it must be active. Do you want to activate this property?</h3>
                    </DialogContent>
                    <DialogActions>
                        <button className="btn btn-success  btn-not-rounded mr-1 ml-2 mb-2" type="button" onClick={this.handleActivateProperty}>
                            Activate
                                </button>
                        <button className="btn btn-info  btn-not-rounded mb-2" type="button" onClick={this.handleCloseConfirmActivateProperty}>
                            Cancel
                                </button>

                    </DialogActions>
                </Dialog>
            </div>
        );
    }

}

export default withApollo(withGlobalContent(HotelList));
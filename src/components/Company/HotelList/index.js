import React, { Component } from 'react';
import gql from 'graphql-tag';
import withApollo from 'react-apollo/withApollo';
import HotelDialog from '../../MainContainer/Toolbar/Main/HotelDialog';
import AlertDialogSlide from 'Generic/AlertDialogSlide';
import withGlobalContent from 'Generic/Global';

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
            searchbox: ''
        }
    }

    getCompaniesQuery = gql`
        query getbusinesscompanies($Id_Parent: Int) {
            getbusinesscompanies(Id: null, IsActive: 1, Contract_Status: null, Id_Parent: $Id_Parent) {
                Id
                Id_Contract
                Id_Company
                Code
                Name
                Description
                ImageURL
                Address
                Id_Parent
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
        this.deleteCompany();
    };

    UNSAFE_componentWillMount() {
        this.getHotels(-1);
    }

    getHotels = (idParent) => {
        this.props.client.query({
            query: this.getCompaniesQuery,
            variables: { Id_Parent: idParent },
            fetchPolicy: 'no-cache'
        }).then(({ data }) => {
            this.setState({
                hotels: data.getbusinesscompanies,
                allHotels: data.getbusinesscompanies
            });
        }).catch();
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
        this.setState({ openAlert: false, deleteId: null });
    };

    handleClose = () => {
        this.setState({
            open: false
        }, () => {
            this.getHotels(-1);
        });
    };

    handleClickOpenEdit = (boolValue, id, rate, idCompany) => (event) => {
        //if (!this.props.showStepper) return false;
        event.preventDefault();
        this.setState({
            propertyClick: boolValue,
            idProperty: id,
            Markup: rate,
            idCompany: idCompany
        }, () => {
            this.setState({ open: true });
        });
    };

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
                    _.Name.toLocaleUpperCase().indexOf(value.toUpperCase()) > -1
                ) {
                    return true;
                }
            });

            // this.state.hotels.forEach(hotel => {
            //     if (hotel.Name.includes(value.toLowerCase()) || hotel.Name.includes(value.toUpperCase())) {
            //         hotelFind.push(hotel);
            //     }
            // });

            this.setState({
                hotels: dataEmployees
            });
        } else {
            this.getHotels(-1);
        }
    };

    handleFindByTag = (isAssign) => (event) => {
        event.preventDefault();
        if (isAssign == true)
            this.getHotels(-2);
        else if (isAssign === 0) {
            this.getHotels(-1);
        }
        else {
            this.getHotels(99999);
        }

    };

    render() {
        return (
            <div className="container-fluid">
                <ul className="row">
                    <div className="col-md-6">
                        <div class="input-group">
                            <input onChange={this.handleChange} type="text" name="searchbox" className="form-control" placeholder="Search" />
                            <div class="input-group-append">
                                <span class="input-group-text">
                                    <i class="fas fa-search"></i>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="float-right">
                            <button className="btn btn-success" onClick={this.handleClickOpen}>
                                Add New Property
                            </button>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <a href="" onClick={this.handleFindByTag(false)} className="badge badge-danger mr-1">Not Assigned</a>
                        <a href="" onClick={this.handleFindByTag(true)} className="badge badge-success mr-1">Assigned</a>
                        <a href="" onClick={this.handleFindByTag(0)} className="badge badge-info">All</a>
                    </div>
                    <AlertDialogSlide
                        handleClose={this.handleCloseAlertDialog}
                        handleConfirm={this.handleConfirmAlertDialog}
                        open={this.state.openAlert}
                        loadingConfirm={this.state.loadingRemoving}
                        content="Do you really want to continue whit this operation?"
                    />
                    {this.state.hotels.map((hotel) => (
                        <li className="col-md-2">
                            <div className="HotelCard-wrapper">
                                <div className="HotelCard-controls">
                                    <button className="btn btn-link" onClick={(e) => { this.handleAlertOpen(hotel.Id) }}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                                <a href="" onClick={this.handleClickOpenEdit(true, hotel.Id, hotel.rate, hotel.Id_Parent == 99999 ? 99999 : hotel.Id_Parent)} className={hotel.Id_Parent == 99999 ? "HotelCard-item bg-gd-danger" : "HotelCard-item"}>
                                    <div className="HotelCard-img">
                                        <figure>
                                            <img src={`${hotel.ImageURL}`} alt="" />
                                        </figure>
                                    </div>
                                    <div className="HotelCard-info">
                                        <span className="HotelCard-title">{hotel.Name}</span>
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
            </div>
        );
    }

}

export default withApollo(withGlobalContent(HotelList));
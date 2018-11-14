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
            idCompany: null
        }
    }

    getCompaniesQuery = gql`
        {
            getbusinesscompanies(Id: null, IsActive: 1, Contract_Status: null, Id_Parent: -1) {
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
                    this.getHotels();
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
        this.getHotels();
    }

    getHotels = () => {
        this.props.client.query({
            query: this.getCompaniesQuery,
            variables: {},
            fetchPolicy: 'no-cache'
        }).then(({ data }) => {
            this.setState({
                hotels: data.getbusinesscompanies
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

    handleClose = () => {
        this.setState({ open: false });
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

    render() {
        return (
            <div className="container-fluid">
                <ul className="row">
                    <div className="col-md-12">
                        <div className="float-right">
                            <button className="btn btn-success" onClick={this.handleClickOpen}>
                                Add Hotel
                            </button>
                        </div>
                    </div>
                    <div className="col-md-12">
                        <span class="badge badge-danger mr-1">Not Assigned</span>
                        <span class="badge badge-success">Assigned</span>
                    </div>
                    {this.state.hotels.map((hotel) => (
                        <li className="col-md-2">
                            <a href="" onClick={this.handleClickOpenEdit(true, hotel.Id, hotel.rate, hotel.Id_Parent == 99999 ? 99999 : hotel.Id_Parent)} className={hotel.Id_Parent == 99999 ? "HotelCard bg-gd-danger" : "HotelCard"}>
                                <div href="" className="HotelCard-controls">
                                    <AlertDialogSlide
                                        handleClose={this.handleCloseAlertDialog}
                                        handleConfirm={this.handleConfirmAlertDialog}
                                        open={this.state.openAlert}
                                        loadingConfirm={this.state.loadingRemoving}
                                        content="Do you really want to continue whit this operation?"
                                    />
                                    <button className="btn btn-link" onClick={(e) => { this.handleAlertOpen(hotel.Id) }}>
                                        <i className="fas fa-trash"></i>
                                    </button>
                                </div>
                                <div className="HotelCard-img">
                                    <figure>
                                        <img src="http://beebom.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg" alt="" />
                                    </figure>
                                </div>
                                <div className="HotelCard-info">
                                    <span className="HotelCard-title">{hotel.Name}</span>
                                </div>
                            </a>
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
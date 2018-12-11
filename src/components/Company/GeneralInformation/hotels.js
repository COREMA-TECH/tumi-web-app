import React, { Component } from 'react';
import gql from 'graphql-tag';
import withApollo from 'react-apollo/withApollo';
import HotelDialog from '../../MainContainer/Toolbar/Main/HotelDialog';
import AlertDialogSlide from 'Generic/AlertDialogSlide';
import withGlobalContent from 'Generic/Global';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Toolbar from '@material-ui/core/Toolbar';

class hotels extends Component {

    constructor() {
        super();
        this.state = {
            hotels: []
        }
    }

    getCompaniesQuery = gql`
    {
        getbusinesscompanies(Id: null, IsActive: 1, Contract_Status: null, Id_Parent: 99999) {
            Id
            Id_Contract
            Id_Company
            Code
            Code01
            BusinessType
            Name
            Description
            Start_Week
            End_Week
            Legal_Name
            Country
            State
            City
            Id_Parent
            ImageURL
            Start_Date
            Location
            Location01
            Rate
            Zipcode
            Fax
            Phone_Prefix
            Phone_Number
            Primary_Email
            Contract_URL
            Insurance_URL
            Other_File
            Other_Name
            Other01_URL
            Other01_Name
            Suite
            Rooms
            IsActive
            User_Created
            User_Updated
            Date_Created
            Date_Updated
            Contract_Status
            Contract_File
            Insurance_File
            Other_File
            Other01_File
            Region
        }
    }
    `;

    UPDATE_COMPANY_QUERY = gql`
		mutation updateCompanies($input: iParamBC!) {
			updbusinesscompanies(input: $input) {
				Id
				Name
				Description
			}
		}
	`;

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

    assignHotel = (hotel) => {
        this.props.client
            .mutate({
                // Pass the mutation structure
                mutation: this.UPDATE_COMPANY_QUERY,
                variables: {
                    input: {
                        Id: hotel.Id,
                        Id_Contract: 1,
                        Id_Company: hotel.Id_Company,
                        Code: `'${hotel.Code}'`,
                        Code01: `'${hotel.Code01}'`,
                        BusinessType: 1,
                        Name: `'${hotel.Name}'`,
                        Description: `'${hotel.Description}'`,
                        Start_Week: hotel.Start_Week,
                        End_Week: hotel.End_Week,
                        Legal_Name: `'${hotel.Legal_Name}'`,
                        Country: hotel.Country,
                        State: hotel.State,
                        City: hotel.City,
                        Id_Parent: this.props.ManagmentId,
                        ImageURL: `'${hotel.ImageURL}'`,
                        Start_Date: `'${hotel.Start_Date}'`,
                        Location: `'${hotel.Location}'`,
                        Location01: `'${hotel.Location01}'`,
                        Rate: hotel.Rate,
                        Zipcode: hotel.Zipcode,
                        Fax: `'${hotel.Fax}'`,
                        Phone_Number: `'${hotel.Phone_Number}'`,
                        Primary_Email: `'${hotel.Primary_Email}'`,
                        Contract_URL: `'${hotel.Contract_URL}'`,
                        Insurance_URL: `'${hotel.Insurance_URL}'`,
                        Other_URL: `'${hotel.Other_URL}'`,
                        Other_Name: `'${hotel.Other_Name}'`,
                        Other01_URL: `'${hotel.Other01_URL}'`,
                        Other01_Name: `'${hotel.Other01_Name}'`,
                        Suite: `'${hotel.Suite}'`,
                        Rooms: hotel.Rooms,
                        IsActive: hotel.IsActive,
                        User_Created: hotel.User_Created,
                        User_Updated: hotel.User_Updated,
                        Date_Created: `'${new Date(hotel.Date_Created).toISOString().substring(0, 10)}'`,
                        Date_Updated: `'${new Date(hotel.Date_Updated).toISOString().substring(0, 10)}'`,
                        Contract_Status: `'${hotel.Contract_Status}'`,
                        Contract_File: `'${hotel.Contract_File}'`,
                        Insurance_File: `'${hotel.Insurance_File}'`,
                        Other_File: `'${hotel.Other_File}'`,
                        Other01_File: `'${hotel.Other01_File}'`,
                        Region: hotel.Region,
                        Phone_Prefix: `'${hotel.Phone_Prefix}'`
                    }
                }
            })
            .then((data) => {
                this.props.handleOpenSnackbar('success', 'Hotel Assigned');
                this.props.handleClose();
            })
            .catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error: Inserting General Information: ' + error);
                this.setState({
                    loadingUpdate: false
                });
            });
    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    aria-labelledby="scroll-dialog-title"
                    fullScreen
                >
                    <DialogTitle id="alert-dialog-title dialog-header">{'Properties without assign'}</DialogTitle>
                    <AppBar style={{ background: '#0092BD' }}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={this.props.handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="title" color="inherit">
                                Properties without assign
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <DialogContent>
                        <ul className="row">
                            {this.state.hotels.map((hotel) => (
                                <li className="col-md-2">
                                    <div className="HotelCard-wrapper">
                                        <div className="HotelCard-controls">
                                            {/* <button className="btn btn-link" onClick={(e) => { this.handleAlertOpen(hotel.Id) }}>
                                                <i className="fas fa-trash"></i>
                                            </button> */}
                                        </div>
                                        <a href="" className="HotelCard-item"
                                            onClick={(e) => { e.preventDefault(); this.assignHotel(hotel) }}
                                        >
                                            <div className="HotelCard-img">
                                                <figure>
                                                    <img src="http://beebom.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg" alt="" />
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
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

}

export default withApollo(withGlobalContent(hotels));
import React, { Component } from 'react';
import gql from 'graphql-tag';
import withApollo from 'react-apollo/withApollo';
import HotelDialog from '../../MainContainer/Toolbar/Main/HotelDialog';
import AlertDialogSlide from 'Generic/AlertDialogSlide';
import withGlobalContent from 'Generic/Global';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import TabsInDialog from '../../../Company/TabsInDialog/TabsInDialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import AppBar from '@material-ui/core/AppBar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Toolbar from '@material-ui/core/Toolbar';

class hotels extends Component {

    getCompaniesQuery = gql`
    {
        getbusinesscompanies(Id: null, IsActive: 1, Contract_Status: null, Id_Parent: 99999) {
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

    assignHotel = () => {

    }

    render() {
        return (
            <div>
                <Dialog
                    open={this.props.open}
                    aria-labelledby="scroll-dialog-title"
                >
                    <DialogTitle id="alert-dialog-title dialog-header">{'Hotels without assign'}</DialogTitle>
                    <AppBar style={{ background: '#0092BD' }}>
                        <Toolbar>
                            <IconButton color="inherit" onClick={this.props.handleClose} aria-label="Close">
                                <CloseIcon />
                            </IconButton>
                            <Typography variant="title" color="inherit">
                                Hotels without assign
                            </Typography>
                        </Toolbar>
                    </AppBar>
                    <DialogContent>
                        <ul className="row">
                            {this.state.hotels.map((hotel) => (
                                <li className="col-md-2">
                                    <div className="HotelCard-wrapper">
                                        <div className="HotelCard-controls">
                                            <button className="btn btn-link" onClick={(e) => { this.handleAlertOpen(hotel.Id) }}>
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                        <a href="" onClick={this.assignHotel}>
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
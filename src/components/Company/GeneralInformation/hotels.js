import React, { Component } from 'react';
import gql from 'graphql-tag';
import withApollo from 'react-apollo/withApollo';
import HotelDialog from '../../MainContainer/Toolbar/Main/HotelDialog';
import AlertDialogSlide from 'Generic/AlertDialogSlide';
import withGlobalContent from 'Generic/Global';

class hotels extends Component {

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

}

export default withApollo(withGlobalContent(hotels));
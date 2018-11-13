import React, { Component } from 'react';
import gql from 'graphql-tag';
import withApollo from 'react-apollo/withApollo';


class HotelList extends Component {

    constructor() {
        super();
        this.state = {
            open: false,
            hotels: []
        }
    }

    getCompaniesQuery = gql`
        {
            getbusinesscompanies(Id: null, IsActive: 1, Contract_Status: null, Id_Parent: 99999) {
                Id
                Id_Contract
                Code
                Name
                Description
                ImageURL
                Address
            }
        }
    `;

    UNSAFE_componentWillMount() {
        this.getHotels();
    }

    getHotels = () => {
        this.props.client.query({
            query: this.getCompaniesQuery,
            variables: {}
        }).then(({ data }) => {
            this.setState({
                hotels: data.getbusinesscompanies
            });
        }).catch();
    }

    render() {
        return (
            <div className="container-fluid">
                <ul className="row">
                    {this.state.hotels.map((hotel) => (
                        <li className="col-md-2">
                            <div className="HotelCard">
                                <div className="HotelCard-img">
                                    <figure>
                                        <img src="http://beebom.com/wp-content/uploads/2016/01/Reverse-Image-Search-Engines-Apps-And-Its-Uses-2016.jpg" alt="" />
                                    </figure>
                                </div>
                                <div className="HotelCard-info">
                                    <span className="HotelCard-title">{hotel.Name}</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

}

export default withApollo(HotelList);
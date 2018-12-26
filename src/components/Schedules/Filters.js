import React, { Component } from 'react';
import { GET_CITIES_QUERY } from './Queries';
import withApollo from 'react-apollo/withApollo';

class Filters extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cities: []
        };
    }

    handleChange = () => {

    }

    getCities = () => {
        this.props.client
            .query({
                query: GET_CITIES_QUERY,
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                this.setState({
                    // cities: data.getcatalogitem
                });
            })
            .catch();
    }

    UNSAFE_componentWillMount() {
        this.getCities();
    }

    render() {
        return (
            <form action="">
                <div className="row">
                    <div className="col-md-3">
                        <label htmlFor="">City</label>
                        <select name="state" id="" className="form-control" onChange={this.handleChange}>
                            <option value="0">Select a Option</option>
                            {
                                this.state.cities.map((city) => {
                                    return <option value={`${city.Id}`}>{city.Name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="">Position</label>
                        <select name="position" id="" className="form-control">
                            <option value="">Select a Option</option>
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="">Shifts</label>
                        <select name="shifts" id="" className="form-control">
                            <option value="">Select a Option</option>
                        </select>
                    </div>
                </div>
            </form>

        );
    }

}

export default withApollo(Filters);
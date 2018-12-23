import React, { Component } from 'react';
import { GET_CITIES_QUERY } from './Queries';

class Filters extends Component {

    handleChange = () => {

    }

    getCities = () => {
        this.props.client
            .query({
                query: GET_CITIES_QUERY,
                variables: {
                    id: this.state.city,
                    parent: this.state.state
                },
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                this.setState({
                    cities: data.getcatalogitem
                });
            })
            .catch();
    }

    render() {
        return (
            <form action="">
                <div className="row">
                    <div className="col-md-3">
                        <label htmlFor="">City</label>
                        <select name="state" id="" className="form-control">
                            <option value="">Select a Option</option>
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

export default Filters;
import React, { Component } from 'react';
import { GET_CITIES_QUERY, GET_STATES_QUERY, GET_POSITION, GET_SHIFTS } from './Queries';
import withApollo from 'react-apollo/withApollo';

class Filters extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cities: [],
            states: [],
            positions: [],
            shifts: []
        };
    }

    handleLoadCities = () => {

    }

    handleStateChange = (e) => {
        var value = e.target.value;
        this.setState({
            stateId: value
        }, this.getCities(value));
    }

    getCities = (stateId) => {
        this.props.client
            .query({
                query: GET_CITIES_QUERY,
                fetchPolicy: 'no-cache',
                variables: {
                    parentId: stateId
                }
            })
            .then(({ data }) => {
                this.setState({
                    cities: data.getcatalogitem
                });
            })
            .catch();
    }

    getStates = () => {
        this.props.client
            .query({
                query: GET_STATES_QUERY,
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                this.setState({
                    states: data.getcatalogitem
                });
            })
            .catch();
    }

    getPosition = () => {
        this.props.client
            .query({
                query: GET_POSITION,
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                this.setState({
                    positions: data.getposition
                });
            })
            .catch();
    }

    getShifts = () => {
        this.props.client
            .query({
                query: GET_SHIFTS,
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                this.setState({
                    shifts: data.shift
                });
            })
            .catch();
    }

    componentWillMount() {
        this.getStates();
        this.getPosition();
        this.getShifts();
    }

    render() {
        return (
            <form action="">
                <div className="row">
                    <div className="col-md-5">
                        <label htmlFor="">
                            Location
                        </label>
                        <div class="input-group">
                            <div class="input-group-prepend">
                                <span class="input-group-text">State</span>
                            </div>
                            <select name="stateId" id="" className="form-control" onChange={this.handleStateChange} value={this.state.stateId}>
                                <option value="0">Select a Option</option>
                                {
                                    this.state.states.map((state) => {
                                        return <option value={`${state.Id}`}>{state.Name}</option>
                                    })
                                }
                            </select>
                            <div class="input-group-prepend">
                                <span class="input-group-text">City</span>
                            </div>
                            <select name="stateId" id="" className="form-control" value={this.state.cityId} onChange={this.props.handleChange}>
                                <option value="0">Select a Option</option>
                                {
                                    this.state.cities.map((city) => {
                                        return <option value={`${city.Id}`}>{city.Name}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="">Position</label>
                        <select name="positionId" id="" className="form-control" onChange={this.props.handleChange}>
                            <option value="">Select a Option</option>
                            {
                                this.state.positions.map((position) => {
                                    return <option value={`${position.Id}`}>{position.Position}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="">Shifts</label>
                        <select name="shiftId" id="" className="form-control" onChange={this.props.handleChange}>
                            <option value="">Select a Option</option>
                            {
                                this.state.shifts.map((shift) => {
                                    return <option value={`${shift.id}`}>{shift.title}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className="col-md-1 d-flex flex-column-reverse">
                        <button type="button" className="btn btn-danger" onClick={this.props.handleReset}>
                            Reset
                        </button>
                    </div>
                </div>
            </form>

        );
    }

}

export default withApollo(Filters);
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
            shifts: [],
            stateId: 0,
            cityId: 0,
            shiftId: 0
        };
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        // console.log("veamos el evento target ", target, " value ", value, " name ", name);
        this.setState({
            [name]: value
        });
    }

    handleLoadCities = () => {

    }

    handleStateChange = (e) => {
        var value = e.target.value;
        this.setState(prevState => {
            return { stateId: value }
        }, this.getCities());
    }

    getCities = () => {
        this.props.client
            .query({
                query: GET_CITIES_QUERY,
                fetchPolicy: 'no-cache',
                variables: {
                    parentId: this.state.stateId
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

    UNSAFE_componentWillMount() {
        this.getStates();
        this.getPosition();
        this.getShifts();
    }

    render() {
        return (
            <form action="">
                <div className="row">
                    <div className="col-md-6">
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
                            <select name="state" id="" className="form-control" value={this.state.cityId} onChange={this.handleChange}>
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
                        <select name="position" id="" className="form-control" onChange={this.handleChange}>
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
                        <select name="shifts" id="" className="form-control" onChange={this.handleChange}>
                            <option value="">Select a Option</option>
                            {
                                this.state.shifts.map((shift) => {
                                    return <option value={`${shift.id}`}>{shift.title}</option>
                                })
                            }
                        </select>
                    </div>
                </div>
            </form>

        );
    }

}

export default withApollo(Filters);
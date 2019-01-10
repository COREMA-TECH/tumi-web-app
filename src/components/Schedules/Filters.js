import React, { Component } from 'react';
import { GET_CITIES_QUERY, GET_STATES_QUERY, GET_POSITION, GET_SHIFTS } from './Queries';
import withApollo from 'react-apollo/withApollo';
import Options from './Options';

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

    }

    changeHotel = () => {

    }

    render() {
        return (
            <div className="MasterShiftHeader">
                <div className="row">
                    <div className="col-md-12">
                        Location: <a href="" onClick={this.changeHotel} className="link">Hotel lo que sea</a>,
                        Position: <a href="" onClick={this.changeHotel} className="link">Cualquier posición</a>
                    </div>
                </div>
                <div className="MasterShiftHeader-controls">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="MasterShiftHeader-controlLeft">
                                <button onClick={this.props.handleOpenForm} className="btn btn-success btn-not-rounded mr-1" type="button">Add Shift</button>
                                <button className="btn btn-default btn-not-rounded mr-1" type="button">Save as Template</button>
                                <button className="btn btn-default btn-not-rounded mr-1" type="button">Copy Previous Week</button>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="MasterShiftHeader-controlRight">
                                <div className="can-toggle">
                                    <input id="my-full" type="checkbox" />
                                    <label htmlFor="my-full" className="my-full">
                                        <div className="can-toggle__switch" data-checked="MY" data-unchecked="FULL"></div>
                                    </label>
                                </div>
                                <button className="btn btn-default btn-not-rounded btn-publish" type="button">Publish</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default withApollo(Filters);
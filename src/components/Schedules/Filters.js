import React, { Component } from 'react';
import { GET_CITIES_QUERY, GET_STATES_QUERY, GET_POSITION, GET_SHIFTS, GET_TEMPLATES } from './Queries';
import { CREATE_TEMPLATE } from './Mutations';
import withApollo from 'react-apollo/withApollo';
import Options from './Options';
import moment from 'moment';

class Filters extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cities: [],
            states: [],
            positions: [],
            shifts: [],
            templates: []
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

    getTemplates = () => {
        this.props.client
            .query({
                query: GET_TEMPLATES,
                fetchPolicy: 'no-cache'
            })
            .then(({ data }) => {
                this.setState((prevState) => {
                    return { templates: data.template }
                });
            })
            .catch();
    }

    componentWillMount() {
        this.getTemplates();
    }

    getStartAndEndDate = () => {
        let startDayOfWeek = moment().startOf('week').format();
        let endDayOfWeek = moment().endOf('week').format();
    }

    saveAsTemplate = () => {
        this.props.client
            .mutate({
                mutation: CREATE_TEMPLATE,
                variables: {
                    id: this.props.templateShifts,
                    title: "test",
                    startDate: this.props.templateStartDate,
                    endDate: this.props.templateEndDate
                }
            })
            .then((data) => {
                this.getTemplates();
                alert('saved');
            })
            .catch((error) => {
                alert('crash');
            });
    }

    render() {
        return (
            <div className="MasterShiftHeader">
                <div className="row">
                    <div className="col-md-12">
                        Location: <a href="" onClick={this.props.handleClosePreFilter} className="link">{this.props.locationName}</a>,
                        Position: <a href="" onClick={this.props.handleClosePreFilter} className="link">{this.props.positionName}</a>,
                        Requested By: <a href="" onClick={this.props.handleClosePreFilter} className="link">{this.props.requestedName}</a>
                    </div>
                </div>
                <div className="MasterShiftHeader-controls">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="MasterShiftHeader-controlLeft">
                                <button onClick={this.props.handleOpenForm} className="btn btn-success btn-not-rounded mr-1" type="button">Add Shift</button>
                                <button onClick={this.saveAsTemplate} className="btn btn-default btn-not-rounded mr-1" type="button">Save as Template</button>
                                <button onClick={this.getStartAndEndDate} className="btn btn-default btn-not-rounded mr-1" type="button">Copy Previous Week</button>
                                <div className="dropdown float-left dropdown-withoutjs">
                                    <button data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="dropdownMenuButton" className="dropdown-toggle btn btn-default btn-not-rounded mr-1" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Use Template</button>
                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                        {
                                            this.state.templates.map((template) => {
                                                return <a key={template.id} className="dropdown-item" href="#">{template.title}</a>
                                            })
                                        }
                                    </div>
                                </div>
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
                                <button className="btn btn-success btn-not-rounded btn-publish" type="button">Publish</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default withApollo(Filters);
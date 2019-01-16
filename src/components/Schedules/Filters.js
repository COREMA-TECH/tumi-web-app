import React, { Component } from 'react';
import { GET_CITIES_QUERY, GET_STATES_QUERY, GET_POSITION, GET_SHIFTS, GET_TEMPLATES } from './Queries';
import { CREATE_TEMPLATE } from './Mutations';
import withApollo from 'react-apollo/withApollo';
import Options from './Options';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';

class Filters extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cities: [],
            states: [],
            positions: [],
            shifts: [],
            templates: [],
            titleModalOpened: false,
            title: ''
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

    saveAsTemplate = (event) => {
        event.preventDefault();
        this.props.client
            .mutate({
                mutation: CREATE_TEMPLATE,
                variables: {
                    id: this.props.templateShifts,
                    title: this.state.title,
                    endDate: this.props.templateEndDate
                }
            })
            .then((data) => {
                this.getTemplates();
                alert('saved');
                this.openFormTitle();
            })
            .catch((error) => {
                alert('crash');
            });
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

    }

    openFormTitle = () => {
        this.setState({
            titleModalOpened: !this.state.titleModalOpened
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
                                <button onClick={this.openFormTitle} className="btn btn-default btn-not-rounded mr-1" type="button">Save as Template</button>
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
                <Dialog maxWidth="md" open={this.state.titleModalOpened}>
                    <form onSubmit={this.saveAsTemplate}>
                        <DialogContent>
                            <label htmlFor="">Template Name</label>
                            <input type="text" name="title" className="form-control" required onChange={this.handleChange} />
                        </DialogContent>
                        <DialogActions>
                            <button onClick={this.openFormTitle} className="btn btn-danger btn-not-rounded" type="button">
                                Cancel
                            </button>
                            <button className="btn btn-success btn-not-rounded mr-1" type="submit">
                                Save
                        </button>
                        </DialogActions>
                    </form>
                </Dialog>
            </div>
        );
    }

}

export default withApollo(Filters);
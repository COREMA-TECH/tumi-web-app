import React, { Component } from 'react';
import { GET_CITIES_QUERY, GET_STATES_QUERY, GET_SHIFTS, GET_TEMPLATES } from './Queries';
import { CREATE_TEMPLATE, USE_TEMPLATE, LOAD_PREVWEEK, PUBLISH_ALL } from './Mutations';
import withApollo from 'react-apollo/withApollo';
import moment from 'moment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import withGlobalContent from 'Generic/Global';

import Select from 'react-select';
import onClickOutside from 'react-onclickoutside';

class Filters extends Component {

    constructor(props) {
        super(props);

        this.state = {
            cities: [],
            states: [],
            shifts: [],
            templates: [],
            titleModalOpened: false,
            title: '',
            item: null,
            openModal: false,
            TemplateList: false,
            openTemplateMenu: false
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
                this.props.handleOpenSnackbar(
                    'success',
                    'Template Saved'
                );
                this.getTemplates();
                this.openFormTitle();
            })
            .catch((error) => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error saving template'
                );
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

    loadTemplate = (id) => {
        let endDayOfWeek = this.props.templateEndDate;
        let requestedBy = this.props.requested;
        let userId = localStorage.getItem('LoginId');
        let specialComment = "";
        this.props.client
            .mutate({
                mutation: USE_TEMPLATE,
                variables: {
                    templateId: id,
                    endDate: endDayOfWeek,
                    userId: userId,
                    requestedBy: requestedBy,
                    specialComment: specialComment
                }
            })
            .then((data) => {
                this.props.handleOpenSnackbar(
                    'success',
                    'Template Saved'
                );
                this.props.toggleRefresh();
            })
            .catch((error) => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error saving template'
                );
            });
    }

    loadPreviousWeek = () => {


        let endDayOfWeek = moment(this.props.templateStartDate).subtract(1, "days").format('YYYY-MM-DD');
        let entityId = this.props.location;
        let userId = localStorage.getItem('LoginId');

        this.setState({ loadingPrevWeek: true }, () => {
            this.props.client
                .mutate({
                    mutation: LOAD_PREVWEEK,
                    variables: {
                        endDate: endDayOfWeek,
                        entityId: entityId,
                        userId: userId,
                        departmentId: this.props.department
                    }
                })
                .then((data) => {
                    this.setState({ loadingPrevWeek: false }, () => {
                        this.props.handleOpenSnackbar(
                            'success',
                            'Previous week loaded'
                        );
                        this.props.toggleRefresh();
                    })

                })
                .catch((error) => {
                    this.setState({ loadingPrevWeek: false }, () => {
                        this.props.handleOpenSnackbar(
                            'error',
                            'Error recovering previous week data'
                        );
                    })
                });
        })

    }

    publishAll = () => {
        this.props.client
            .mutate({
                mutation: PUBLISH_ALL,
                variables: {
                    ids: this.props.templateShifts
                }
            })
            .then((data) => {
                this.props.handleOpenSnackbar(
                    'success',
                    'All shifts published successfully'
                );
                this.props.toggleRefresh();
            })
            .catch((error) => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error publishing shifts'
                );
            });
    }

    handleClickOpenModal = () => {
        this.props.handleOpenWorkOrderForm();
    };

    handleCloseModal = (event) => {
        event.preventDefault();
        this.setState({
            openModal: false, openLife: false

        });
    };

    enableTemplateList = (event) => {
        event.preventDefault();
        this.setState({
            TemplateList: !this.state.TemplateList
        });
    }

    handleClickOutside = () => {
        this.setState({ openTemplateMenu: false })
    };

    render() {
        return (
            <div className="MasterShiftHeader">
                <div className="row">
                    <div className="col-md-12">
                        Location: <a href="" onClick={this.props.handleClosePreFilter} className="link">{this.props.locationName}</a>,
                        Department: <a href="" onClick={this.props.handleClosePreFilter} className="link">{this.props.departmentName}</a>,
                        Employees:
                        <div className="ScheduleWrapper">
                            <Select
                                name="employees"
                                className="EmployeeFilter"
                                options={this.props.employees}
                                value={this.props.selectedEmployee}
                                onChange={this.props.onSelectedEmployeeChange}
                                closeMenuOnSelect={false}
                            />
                        </div>
                    </div>
                </div>
                <div className="MasterShiftHeader-controls">
                    <div className="row">
                        <div className="col-md-8">
                            <div className="MasterShiftHeader-controlLeft">
                                <button onClick={this.handleClickOpenModal} className="btn btn-success btn-not-rounded mr-1" type="button">Add Shift</button>
                                {/* <button onClick={this.openFormTitle} className="btn btn-default btn-not-rounded mr-1" type="button" disabled={this.props.viewType != 1 ? true : false}>Save as Template</button> */}
                                <button onClick={this.loadPreviousWeek} className="btn btn-default btn-not-rounded mr-1" type="button">Copy Previous Week {this.state.loadingPrevWeek && <i className="fa fa-spinner fa-spin" />}</button>
                                <div className="dropdown float-left">
                                    <button onClick={() => { this.setState({ openTemplateMenu: !this.state.openTemplateMenu }) }} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" id="dropdownMenuButton" className="dropdown-toggle btn btn-default btn-not-rounded mr-1" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" disabled={this.props.viewType != 1 ? true : false}>Templates</button>
                                    <div className={`dropdown-menu ${this.state.openTemplateMenu ? 'd-block' : 'd-none'}`} aria-labelledby="dropdownMenuButton">

                                        <a href="#" className="dropdown-item" onClick={this.openFormTitle}>Save as Template</a>
                                        <a href="#" className="dropdown-item" onClick={this.enableTemplateList}>Use Template</a>
                                        <div className={`TampletsList ${this.state.TemplateList ? 'd-block' : 'd-none'}`}>
                                            {
                                                this.state.templates.map((template) => {
                                                    return <a key={template.id} className="dropdown-item" href="#" onClick={(event) => { event.preventDefault(); this.loadTemplate(template.id) }}>{template.title}</a>
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="MasterShiftHeader-controlRight">
                                {/* <div className="can-toggle">
                                    <input id="my-full" type="checkbox" />
                                    <label htmlFor="my-full" className="my-full">
                                        <div className="can-toggle__switch" data-checked="MY" data-unchecked="FULL"></div>
                                    </label>
                                </div> */}
                                <button className="btn btn-success btn-not-rounded btn-publish" type="button" onClick={this.publishAll}>Publish All</button>
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

export default withApollo(withGlobalContent(onClickOutside(Filters)));
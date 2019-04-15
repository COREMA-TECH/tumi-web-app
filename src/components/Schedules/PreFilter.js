import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import withGlobalContent from 'Generic/Global';
import { withApollo } from 'react-apollo';
import { GET_INITIAL_DATA, GET_CONTACT_BY_QUERY, GET_DEPARTMENTS, GET_POSITION } from './Queries';
import AutosuggestInput from 'ui-components/AutosuggestInput/AutosuggestInput';

class PreFilter extends Component {

    constructor() {
        super();
        this.state = {
            saving: false,
            locations: [],
            departments: [],
            positions: [],
            contacts: [],
            disabled: true,
            location: 0,
            department: 0,
            position: 0,
            loadingPositions: true,
            loadingDepartments: true,
        }
    }

    getDepartments = () => {
        this.setState({ loadingDepartments: true }, () => {
            this.props.client
                .query({
                    query: GET_DEPARTMENTS,
                    variables: {
                        Id_Entity: this.state.location
                    }
                })
                .then(({ data }) => {
                    this.setState((prevState) => {
                        return { departments: data.catalogitem, loadingDepartments: false }
                    })

                }).catch(error => {
                    this.setState({ loadingDepartments: false }, () => {
                        this.props.handleOpenSnackbar(
                            'error',
                            'Error loading Department list',
                            'bottom',
                            'right'
                        );
                    });
                })
        })
    }

    getPositions = () => {
        this.setState({ loadingPositions: true }, () => {
            this.props.client
                .query({
                    query: GET_POSITION,
                    variables: {
                        Id_Department: this.state.department
                    }
                })
                .then(({ data }) => {
                    console.log("getPositions ", data)
                    this.setState((prevState) => {
                        return { positions: data.getposition, loadingPositions: false }
                    })

                }).catch(error => {
                    this.setState({ loadingPositions: false }, () => {
                        this.props.handleOpenSnackbar(
                            'error',
                            'Error loading Department list',
                            'bottom',
                            'right'
                        );
                    });
                })
        })
    }

    getLocations = () => {
        this.setState({ loadingLoaction: true }, () => {
            this.props.client
                .query({
                    query: GET_INITIAL_DATA,
                })
                .then(({ data }) => {
                    this.setState((prevState) => {
                        return { locations: data.getbusinesscompanies, loadingLoaction: false, loadingDepartments: false }
                    })
                }).catch(error => {
                    this.setState({ loadingLoaction: false }, () => {
                        this.props.handleOpenSnackbar(
                            'error',
                            'Error loading Locations list',
                            'bottom',
                            'right'
                        );
                    })

                });
        })
    }
    getContacts = () => {
        this.setState({ loadingContacts: true }, () => {
            this.props.client
                .query({
                    query: GET_CONTACT_BY_QUERY,
                    variables: {
                        id: this.state.location
                    }
                })
                .then(({ data }) => {
                    //Save Positions into state
                    this.setState((prevState) => {
                        return { contacts: data.getcontacts, loadingContacts: false }
                    })

                }).catch(error => {
                    this.setState({ loadingContacts: false })
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error loading Contacts list',
                        'bottom',
                        'right'
                    );
                });
        })
    }

    renderLocationList = () => {
        return this.state.locations.map((item) => {
            return <option key={item.Id} value={item.Id}>{item.Code} | {item.Name}</option>
        })
    }

    renderContactsList = () => {
        return this.state.contacts.map((item) => {
            return <option key={item.Id} value={item.Id}>{item.First_Name + ' ' + item.Last_Name}</option>;
        });
    }

    renderDeparmentList = () => {
        return this.state.departments.map((item) => {
            return <option key={item.Id} value={item.Id}>{item.Code + ' ' + item.Description}</option>;
        });
    }
    renderPositionList = () => {
        return this.state.positions.map((item) => {
            return <option key={item.Id} value={item.Id}>{item.Position}</option>;
        });
    }

    handleSelectValueChange = (event) => {
        var index = event.nativeEvent.target.selectedIndex;
        var text = event.nativeEvent.target[index].text;

        const element = event.target;

        this.setState({
            [element.name]: element.value,
            [element.name + "Name"]: text,
            disabled: false
        }, () => {
            console.log("element.name  ", element.name)
            if (element.name == 'location') {
                this.getContacts();
                this.getDepartments();
            }
            if (element.name == 'department') {
                this.getPositions();
            }
        })
    }

    componentWillMount() {
        this.getLocations();
    }

    handleApplyFilters = (event) => {
        event.preventDefault();
        this.props.handleApplyFilters(this.state.location, this.state.requested, this.state.department, this.state.position);
        this.props.handleGetTextofFilters(this.state.locationName, this.state.requestedName, this.state.departmentName, this.state.positionName);
        this.setState({
            disabled: !this.state.disabled
        });
    }


    updateLocationName = (value) => {
        this.setState(
            {
                locationName: value
            },
            () => {
                this.validateField('locationName', value);
            }
        );
    };

    render() {
        const disabled = this.state.disabled;
        return (
            <Dialog maxWidth="sm" open={this.props.openPreFilter} >
                <form action="" onSubmit={this.handleApplyFilters}>
                    <DialogContent>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <label htmlFor="">Property</label>
                                    {/*  <AutosuggestInput
                                        id="location"
                                        name="location"
                                        data={this.state.locations}
                                        // required
                                        //error={!this.state.titleNameValid}
                                        value={this.props.location}
                                        onChange={this.updateLocationName}
                                        onSelect={this.updateLocationName}
                                    />*/}


                                    <select name="location" id="" value={this.props.location} disabled={this.state.loadingLoaction} className="form-control" required onChange={this.handleSelectValueChange}>
                                        <option value="">Select a Option</option>
                                        {this.renderLocationList()}
                                    </select>

                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="">Department</label>
                                    <select name="department" id="" value={this.props.department} disabled={this.state.loadingDepartments} required className="form-control" onChange={this.handleSelectValueChange}>
                                        <option value="">Select a Option</option>
                                        {this.renderDeparmentList()}
                                    </select>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="">Position</label>
                                    <select name="position" id="" value={this.props.position} disabled={this.state.loadingPositions} required className="form-control" onChange={this.handleSelectValueChange}>
                                        <option value="">Select a Option</option>
                                        {this.renderPositionList()}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        <div className="row">
                            <div className="col-md-12">
                                <button className="btn btn-success btn-not-rounded" type="submit">
                                    Filter
                                        {this.state.saving && <i className="fas fa-spinner fa-spin ml-2" />}
                                </button>

                                <button className="btn btn-light btn-not-rounded ml-1" type="button" onClick={this.props.handleClosePreFilter}>
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }

}

export default withApollo(withGlobalContent(PreFilter));
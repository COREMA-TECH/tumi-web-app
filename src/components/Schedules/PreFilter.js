import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import withGlobalContent from 'Generic/Global';
import { withApollo } from 'react-apollo';
import { GET_INITIAL_DATA, GET_CONTACT_BY_QUERY, GET_DEPARTMENTS, GET_POSITION } from './Queries';
import Select from 'react-select';
import makeAnimated from "react-select/lib/animated";
import { withStyles } from '@material-ui/core/styles';

// const DEFAULT_SELECTED_LOCATION = { value: 0, label: "Select an Option" };
const styles = {
    paper: { overflowY: 'unset' }
};

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
            loadingLocations: false,
            loadingPositions: false,
            loadingDepartments: false,
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
        this.setState(() => ({ loadingPositions: true }), () => {
            this.props.client
                .query({
                    query: GET_POSITION,
                    variables: {
                        Id_Department: this.state.department
                    }
                })
                .then(({ data }) => {
                    this.setState((prevState) => {
                        return { positions: data.getposition, loadingPositions: false }
                    })

                }).catch(error => {
                    this.setState(() => ({ loadingPositions: false }), () => {
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
        let filter = {};
        let idRol = localStorage.getItem('IdRoles');
        let idEntity = localStorage.getItem("Id_Entity");
        if (idRol == 5) filter = { ...filter, Id: idEntity };

        this.setState({ loadingLocations: true }, () => {
            this.props.client
                .query({
                    query: GET_INITIAL_DATA,
                    variables: {
                        ...filter
                    }
                })
                .then(({ data }) => {
                    this.setState((prevState) => {
                        return { locations: data.getbusinesscompanies, loadingLocations: false, loadingDepartments: false }
                    }, () => {
                        if (this.props.location) {
                            this.setState(() => {
                                return { location: this.props.location }
                            }, () => {
                                this.getContacts();
                                this.getDepartments();
                                this.getStartWeek(this.props.location);
                            });
                        }
                    })
                }).catch(error => {
                    this.setState({ loadingLocations: false }, () => {
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

    getLocationList = () => {
        return this.state.locations.map((item) => {
            return { value: item.Id, label: item.Name }
        })
    }

    getPositionList = () => {
        return this.state.positions.map((item) => {
            return { value: item.Id, label: item.Position };
        });
    }

    getDepartmentList = () => {
        return this.state.departments.map((item) => {
            return { value: item.Id, label: item.Description };
        });
    }

    getStartWeek = (id) => {
        let company = this.state.locations.find(_ => _.Id === id);
        this.setState(() => ({
            startWeek: company ? company.Start_Week : 1
        }))
    }

    componentWillMount() {
        this.getLocations();
    }

    handleApplyFilters = (event) => {
        event.preventDefault();
        if (!this.state.location || !this.state.department || !this.state.position)
            this.props.handleOpenSnackbar('warning', 'Filters are required, please select them all');
        else {
            event.preventDefault();
            this.props.handleApplyFilters(this.state.location, this.state.requested, this.state.department, this.state.position, this.state.startWeek);
            this.props.handleGetTextofFilters(this.state.locationName, this.state.requestedName, this.state.departmentName, this.state.positionName);
            this.setState({
                disabled: !this.state.disabled
            });
        }
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

    findSelectedLocation = value => {
        if (!value)
            return null;

        const found = this.state.locations.find(item => {
            return item.Id === value;
        });

        return found ? { value: found.Id, label: found.Name } : null;
    }

    handleLocationFilterChange = ({ value, label }) => {
        this.setState(() => ({
            location: parseInt(value),
            locationName: label,
            department: null
        }), () => {
            this.getContacts();
            this.getDepartments();
            this.getStartWeek(value);
        });
    }

    findSelectedDepartment = value => {
        if (!value)
            return null;

        const found = this.state.departments.find(item => {
            return item.Id === value;
        });

        return found ? { value: found.Id, label: found.Description } : null;
    }

    handleDepartmentFilterChange = ({ value, label }) => {
        this.setState(() => ({
            department: parseInt(value),
            departmentName: label,
            position: null
        }), () => {
            this.getPositions();
        });
    }

    findSelectedPosition = value => {
        if (!value)
            return null;

        const found = this.state.positions.find(item => {
            return item.Id === value;
        });

        return found ? { value: found.Id, label: found.Position } : null;
    }

    handlePositionFilterChange = ({ value, label }) => {
        this.setState(() => ({
            position: parseInt(value),
            positionName: label
        }));
    }

    render() {
        const { classes } = this.props;

        return (
            <Dialog maxWidth="sm" fullWidth open={this.props.openPreFilter} classes={{ paper: classes.paper }}>
                <DialogContent style={{ overflowY: "unset" }}>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <label htmlFor="property">Property</label>
                                <Select
                                    id="property"
                                    options={this.getLocationList()}
                                    value={this.findSelectedLocation(this.state.location)}
                                    onChange={this.handleLocationFilterChange}
                                    closeMenuOnSelect={true}
                                    components={makeAnimated()}
                                    isMulti={false}
                                    className='tumi-fullWidth'
                                    isDisabled={this.state.loadingLocations}
                                    isLoading={this.state.loadingLocations}
                                    placeholder="Select an Option"
                                />
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="department">Department</label>
                                <Select
                                    id="department"
                                    options={this.getDepartmentList()}
                                    value={this.findSelectedDepartment(this.state.department)}
                                    onChange={this.handleDepartmentFilterChange}
                                    closeMenuOnSelect={true}
                                    components={makeAnimated()}
                                    isMulti={false}
                                    className='tumi-fullWidth'
                                    isDisabled={this.state.loadingDepartments}
                                    isLoading={this.state.loadingDepartments}
                                    placeholder="Select an Option"
                                />
                            </div>
                            <div className="col-md-12">
                                <label htmlFor="position">Position</label>
                                <Select
                                    id="position"
                                    options={this.getPositionList()}
                                    value={this.findSelectedPosition(this.state.position)}
                                    onChange={this.handlePositionFilterChange}
                                    closeMenuOnSelect={true}
                                    components={makeAnimated()}
                                    isMulti={false}
                                    className='tumi-fullWidth'
                                    isDisabled={this.state.loadingPositions}
                                    isLoading={this.state.loadingPositions}
                                    placeholder="Select an Option"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <DialogActions>
                                <div className="tumi-buttonWrapper">
                                    <button className="btn btn-success btn-not-rounded tumi-button" type="button" onClick={this.handleApplyFilters}>
                                        Filter
                                                {this.state.saving && <i className="fas fa-spinner fa-spin ml-2" />}
                                    </button>

                                    <button className="btn btn-danger btn-not-rounded tumi-button" type="button" onClick={this.props.handleClosePreFilter}>
                                        Cancel
                                        </button>
                                </div>
                            </DialogActions>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

}

export default withStyles(styles)(withApollo(withGlobalContent(PreFilter)));
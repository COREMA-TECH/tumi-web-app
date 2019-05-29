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

import makeAnimated from "react-select/lib/animated";
import Select from 'react-select';

class PreFilter extends Component {

    constructor() {
        super();
        this.state = {
            saving: false,
            locations: [],
            locationFilterOptions: [],
            departments: [],
            departmentFilterOptions: [],
            positions: [],
            positionFilterOptions: [],
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
                    }, _ => {
                        this.setState(_ => {
                            return {departmentFilterOptions: this.renderDeparmentList()}
                        })
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
                    this.setState((prevState) => {
                        return { positions: data.getposition, loadingPositions: false }
                    }, _ => {
                        this.setState(_ => {
                            return { positionFilterOptions: this.renderPositionList() }
                        })
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
                    }, _ => {
                        this.setState({
                            locationFilterOptions: this.renderLocationList()
                        })
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
            return {value: item.Id, label: `${item.Code} | ${item.Name}`}
        })
    }

    findSelectedLocation = location => {
        const defValue = {value: "", label: "Select an Option"};

        if(location == 'null' || location === '')
            return defValue;

        const found = this.state.locationFilterOptions.find(item => {
            return item.value === location;
        });

        return found ? found : defValue;
    }

    renderContactsList = () => {
        return this.state.contacts.map((item) => {
            return <option key={item.Id} value={item.Id}>{item.First_Name + ' ' + item.Last_Name}</option>;
        });
    }

    renderDeparmentList = () => {
        return this.state.departments.map((item) => {
            return {value: item.Id, label: `${item.Code} ${item.Description}`}
        });
    }

    renderPositionList = () => {
        return this.state.positions.map((item) => {
            return { value: item.Id, label: item.Position.trim() }
        });
    }

    findSelectedDepartment = department => {
        const defValue = {value: "", label: "Select an Option"};

        if(department == 'null' || department === '')
            return defValue;

        const found = this.state.departmentFilterOptions.find(item => {
            return item.value === department;
        });

        return found ? found : defValue;
    }

    findSelectedPosition = position => {
        const defValue = {value: "", label: "Select an Option"};

        if(position == 'null' || position === '')
            return defValue;

        const found = this.state.positionFilterOptions.find(item => {
            return item.value === position;
        });

        return found ? found : defValue;
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
            if (element.name == 'location') {
                this.getContacts();
                this.getDepartments();
            }
            if (element.name == 'department') {
                this.getPositions();
            }
        })
    }

    handlePositionChange = ({value, label}) => {
        this.setState(_ => {
            return { position: value, positionName: label, disabled: false }
        })
    }

    handlePropertyChange = ({value, label}) => {
        this.setState( _ => {
            return {
                location: value,
                locationName: label,
                disabled: false
            }
        }, _ => {
            this.getContacts();
            this.getDepartments();
        })
    }

    handleDepartmentChange = ({value, label}) => {
        this.setState( _ => {
            return {
                department: value,
                departmentName: label,
                disabled: false
            }
        }, _ => {
            this.getPositions();
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
        return (
            <Dialog maxWidth="sm" open={this.props.openPreFilter} >
                <form action="" onSubmit={this.handleApplyFilters}>
                    <DialogContent>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <label htmlFor="">Property</label>
                                    <Select
                                        options={this.state.locationFilterOptions}
                                        value={this.findSelectedLocation(this.state.location)}
                                        onChange={this.handlePropertyChange}
                                        closeMenuOnSelect={true}
                                        components={makeAnimated()}
                                        isMulti={false}
                                        isDisabled={this.state.loadingLoaction}
                                        required
                                    />
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="">Department</label>                                    
                                    <Select
                                        options={this.state.departmentFilterOptions}
                                        value={this.findSelectedDepartment(this.state.department)}
                                        onChange={this.handleDepartmentChange}
                                        closeMenuOnSelect={true}
                                        components={makeAnimated()}
                                        isMulti={false}
                                        isDisabled={this.state.loadingDepartments}
                                        required
                                    />
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="">Position</label>                                    
                                    <Select
                                        options={this.state.positionFilterOptions}
                                        value={this.findSelectedPosition(this.state.position)}
                                        onChange={this.handlePositionChange}
                                        closeMenuOnSelect={true}
                                        components={makeAnimated()}
                                        isMulti={false}
                                        isDisabled={this.state.loadingPositions}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </DialogContent>
                    <div className="row">
                        <div className="col-md-12">
                            <DialogActions>
                                <div className="tumi-buttonWrapper">
                                    <button className="btn btn-success btn-not-rounded tumi-button" type="submit">
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
                </form>
            </Dialog>
        );
    }

}

export default withApollo(withGlobalContent(PreFilter));
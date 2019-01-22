import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import withGlobalContent from 'Generic/Global';
import { withApollo } from 'react-apollo';
import { GET_INITIAL_DATA, GET_POSITION, GET_CONTACT_BY_QUERY } from './Queries';

class PreFilter extends Component {

    constructor() {
        super();
        this.state = {
            saving: false,
            locations: [],
            positions: [],
            contacts: [],
            disabled: true
        }
    }

    getLocations = () => {
        this.props.client
            .query({
                query: GET_INITIAL_DATA,
            })
            .then(({ data }) => {
                this.setState((prevState) => {
                    return { locations: data.getbusinesscompanies }
                })

            }).catch(error => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error loading Locations list',
                    'bottom',
                    'right'
                );
            });
    }

    getPosition = (position = 0) => {
        this.setState({ loadingPosition: true }, () => {
            this.props.client
                .query({
                    query: GET_POSITION,
                    variables: {
                        Id_Entity: this.state.location
                    }
                })
                .then(({ data }) => {
                    //Save Positions into state
                    this.setState((prevState) => {
                        return { positions: data.getposition, position, loadingPosition: false }
                    })

                }).catch(error => {
                    this.setState({ loadingPosition: false })
                    this.props.handleOpenSnackbar(
                        'error',
                        'Error loading position list',
                        'bottom',
                        'right'
                    );
                });
        })
    }

    getContacts = () => {
        this.setState({ loadingPosition: true }, () => {
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
                        return { contacts: data.getcontacts, loadingPosition: false }
                    })

                }).catch(error => {
                    this.setState({ loadingPosition: false })
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

    renderPositionList = () => {
        return this.state.positions.map((item) => {
            return <option key={item.Id} value={item.Id}>{item.Position}</option>
        })
    }

    renderContactsList = () => {
        return this.state.contacts.map((item) => {
            return <option key={item.Id} value={item.Id}>{item.First_Name + ' ' + item.Last_Name}</option>;
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
            if (element.name == 'location') {
                this.getPosition();
                this.getContacts();
            }
        })
    }

    componentWillMount() {
        this.getLocations();
    }

    handleApplyFilters = (event) => {
        event.preventDefault();
        this.props.handleApplyFilters(this.state.position, this.state.location, this.state.requested);
        this.props.handleGetTextofFilters(this.state.positionName, this.state.locationName, this.state.requestedName);
        this.setState({
            disabled: !this.state.disabled
        });
    }

    render() {
        const disabled = this.state.disabled;
        return (
            <Dialog maxWidth="sm" open={this.props.openPreFilter} >
                <form action="" onSubmit={this.handleApplyFilters}>
                    <DialogContent>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <label htmlFor="">Location</label>
                                    <select name="location" id="" className="form-control" required onChange={this.handleSelectValueChange}>
                                        <option value="">Select a Option</option>
                                        {this.renderLocationList()}
                                    </select>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="">Position</label>
                                    <select name="position" id="" disabled={disabled} required className="form-control" onChange={this.handleSelectValueChange}>
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
                                {
                                    this.props.isEditFilter ? (
                                        <button className="btn btn-defautl btn-not-rounded" type="button" onClick={this.props.handleClosePreFilter}>
                                            Cancel
                                    </button>
                                    ) : ("")
                                }
                            </div>
                        </div>
                    </DialogActions>
                </form>
            </Dialog>
        );
    }

}

export default withApollo(withGlobalContent(PreFilter));
import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import withGlobalContent from 'Generic/Global';
import { withApollo } from 'react-apollo';
import { GET_INITIAL_DATA, GET_POSITION } from './Queries';

class PreFilter extends Component {

    constructor() {
        super();
        this.state = {
            saving: false,
            locations: [],
            positions: []
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

    handleSelectValueChange = (event) => {
        var index = event.nativeEvent.target.selectedIndex;
        var text = event.nativeEvent.target[index].text;

        const element = event.target;
        this.setState({
            [element.name]: element.value
        }, () => {
            if (element.name == 'location')
                this.getPosition();
        })
    }

    componentWillMount() {
        this.getLocations();
    }

    handleApplyFilters = (event) => {
        event.preventDefault();
        this.props.handleApplyFilters(this.state.position, this.state.location);
    }

    render() {
        return (
            <Dialog maxWidth="md" open={this.props.openPreFilter} onClose={this.props.handleClosePreFilter}>
                <DialogContent>
                    <form action="" onSubmit={this.handleApplyFilters}>
                        <div className="container">
                            <div className="row">
                                <div className="col-md-12">
                                    <label htmlFor="">Location</label>
                                    <select name="location" id="" className="form-control" onChange={this.handleSelectValueChange}>
                                        <option value="">Select a Option</option>
                                        {this.renderLocationList()}
                                    </select>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="">Position</label>
                                    <select name="position" id="" className="form-control">
                                        <option value="">Select a Option</option>
                                        {this.renderPositionList()}
                                    </select>
                                </div>
                                <div className="col-md-12">
                                    <button className="btn btn-success btn-not-rounded mt-2 float-right" type="submit">
                                        Filter
                                    {this.state.saving && <i class="fas fa-spinner fa-spin ml-2" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        );
    }

}

export default withApollo(withGlobalContent(PreFilter));
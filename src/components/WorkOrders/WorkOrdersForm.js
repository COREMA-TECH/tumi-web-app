import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withApollo } from 'react-apollo';
import { GET_HOTEL_QUERY, GET_POSITION_BY_QUERY } from './queries';

class WorkOrdersForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            hotels: [],
            positions: []
        };
    }

    componentWillMount() {

        this.props.client
            .query({
                query: GET_HOTEL_QUERY
            })
            .then(({ data }) => {
                this.setState({
                    hotels: data.getbusinesscompanies
                });
            })
            .catch();


        this.setState({
            openModal: this.props.openModal
        });
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

        if (name === "hotel") {
            this.getPositions(value);
        }
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.add();
    }

    add = () => {
        /* add() {
             this.props.client.mutate({
                 mutation: this.INSERT_QUERY,
                 variables: {
                     input: {
                         EntityId: this.props.idCompany,
                         PeriodId: this.state.period,
                         amount: parseFloat(this.state.amount),
                         charge: this.state.charge,
                     }
                 }
             })
                 .then((data) => {
                     this.props.handleOpenSnackbar(
                         'success',
                         'Preference Inserted!'
                     );
                     this.setState({saving:false})
                 })
                 .catch((error) => {
                     this.setState({saving:false})
                     this.props.handleOpenSnackbar(
                         'error',
                         'Error Preferences: ' + error
                     );
                 });
         }*/
    }

    getPositions = (id) => {
        this.props.client
            .query({
                query: GET_POSITION_BY_QUERY,
                variables: { id: id },
            })
            .then(({ data }) => {
                this.setState({
                    positions: data.getposition
                });
            })
            .catch();
    }

    render() {
        return (
            <div>
                <Dialog maxWidth="md" open={this.props.openModal} onClose={this.props.handleCloseModal} >
                    <DialogTitle style={{ padding: '0px' }}>
                        <div className="modal-header">
                            <h5 className="modal-title">Work Order</h5>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <form action="" onSubmit={this.handleSubmit}>
                            <div className="row">
                                <div className="col-md-6">
                                    <label htmlFor="">Hotel</label>
                                    <select name="hotel" className="form-control" id="" onChange={this.handleChange}>
                                        <option value="0">Select a Hotel</option>
                                        {
                                            this.state.hotels.map((hotel) => (
                                                <option value={hotel.Id}>{hotel.Name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="">Position</label>
                                    <select name="position" className="form-control" id="">
                                        <option value="0">Select a Position</option>
                                        {
                                            this.state.positions.map((position) => (
                                                <option value={position.Id}>{position.Position}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="">Quantity</label>
                                    <input type="text" className="form-control" name="quantity" />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="">Shift</label>
                                    <input type="text" className="form-control" name="shift" />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="">Date Needed By</label>
                                    <input type="date" className="form-control" name="start_date" />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="">To</label>
                                    <input type="date" className="form-control" name="end_date" />
                                </div>
                                <div className="col-md-6">
                                    <label htmlFor="">Date</label>
                                    <input type="date" className="form-control" name="date" />
                                </div>
                                <div className="col-md-12">
                                    <div className="form-separator">Requirements</div>
                                </div>
                                <div className="col-md-3">
                                    <label>
                                        Need Experience?
                                    </label>
                                    <div className="onoffswitch">
                                        <input type="checkbox" name="experience" onClick={this.toggleState} onChange={this.handleChange} className="onoffswitch-checkbox" id="myonoffswitch" />
                                        <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                            <span className="onoffswitch-inner"></span>
                                            <span className="onoffswitch-switch"></span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <label>
                                        Need to Speak English?
                                    </label>
                                    <div className="onoffswitch">
                                        <input type="checkbox" name="speak" onClick={this.toggleState} onChange={this.handleChange} className="onoffswitch-checkbox" id="myonoffswitchSpeak" />
                                        <label className="onoffswitch-label" htmlFor="myonoffswitchSpeak">
                                            <span className="onoffswitch-inner"></span>
                                            <span className="onoffswitch-switch"></span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="">Comment</label>
                                    <textarea name="comment" className="form-control" id="" cols="30" rows="10"></textarea>
                                </div>
                                <div className="col-md-12">
                                    <div className="mt-2">
                                        <button className="btn btn-danger ml-1 float-right" onClick={this.props.handleCloseModal}>Cancel</button>
                                        <button className="btn btn-success float-right" type="submit">Save</button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

}

export default withStyles()(withMobileDialog()(withApollo(WorkOrdersForm)));

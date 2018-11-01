import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withApollo } from 'react-apollo';
import { GET_HOTEL_QUERY, GET_POSITION_BY_QUERY } from './queries';
import { CREATE_WORKORDER, UPDATE_WORKORDER } from './mutations';
import ShiftsData from '../../data/shitfs.json';

class WorkOrdersForm extends Component {
    _states = {
        id: null,
        hotel: 0,
        IdEntity: null,
        date: '',
        quantity: 0,
        status: 0,
        shift: '',
        startDate: '',
        endDate: '',
        needExperience: false,
        needEnglish: false,
        comment: '',
        position: 0,
        PositionRateId: null,
        userId: 1,
        ShiftsData: ShiftsData
    };

    constructor(props) {
        super(props);
        this.state = {
            openModal: false,
            hotels: [],
            positions: [],
            ...this._states
        };
    }

    ReceiveStatus = false;

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.item && !this.state.openModal) {
            this.setState({
                id: nextProps.item.id,
                IdEntity: nextProps.item.IdEntity,
                date: nextProps.item.date,
                quantity: nextProps.item.quantity,
                status: 30452,
                shift: nextProps.item.shift,
                startDate: nextProps.item.startDate,
                endDate: nextProps.item.endDate,
                needExperience: nextProps.item.needExperience,
                needEnglish: nextProps.item.needEnglish,
                comment: nextProps.item.comment,
                userId: 1,
                openModal: nextProps.openModal
            }, () => {
                this.getPositions(nextProps.item.IdEntity, nextProps.item.PositionRateId);
                this.ReceiveStatus = true;
            });
        } else if (!this.state.openModal) {
            this.setState({
                IdEntity: 0,
                date: '',
                quantity: 0,
                status: 0,
                shift: '',
                startDate: '',
                endDate: '',
                needExperience: false,
                needEnglish: false,
                comment: '',
                PositionRateId: 0,
                userId: 1
            });
        }
        this.setState({
            openModal: nextProps.openModal
        });

    }

    UNSAFE_componentWillMount() {
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

    handleSubmit = (event) => {
        event.preventDefault();
        if (this.state.IdEntity == 0 ||
            this.state.PositionRateId == 0 ||
            this.state.quantity == "" ||
            this.state.quantity == 0 ||
            this.state.date == "" ||
            this.state.startDate == "" ||
            this.state.endDate == "" ||
            this.state.shift == "" ||
            this.state.shift == 0) {
            this.props.handleOpenSnackbar(
                'error',
                'Error all fields are required'
            );
        } else {
            if (this.state.id == null)
                this.add();
            else
                this.update();
        }
    };

    add = () => {
        this.props.client.mutate({
            mutation: CREATE_WORKORDER,
            variables: {
                workOrder: {
                    IdEntity: this.state.IdEntity,
                    date: this.state.date,
                    quantity: this.state.quantity,
                    status: 30452,
                    shift: this.state.shift,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                    needExperience: this.state.needExperience,
                    needEnglish: this.state.needEnglish,
                    comment: this.state.comment,
                    PositionRateId: this.state.PositionRateId,
                    userId: 1
                }
            }
        }).then((data) => {
            this.props.handleOpenSnackbar('success', 'Preference Inserted!');
            this.setState({ openModal: false });
            window.location.reload();
        }).catch((error) => {
            this.props.handleOpenSnackbar('error', 'Error Preferences: ' + error);
        });
    };

    update = () => {
        this.props.client.mutate({
            mutation: UPDATE_WORKORDER,
            variables: {
                workOrder: {
                    id: this.state.id,
                    IdEntity: this.state.IdEntity,
                    date: this.state.date,
                    quantity: this.state.quantity,
                    status: 30452,
                    shift: this.state.shift,
                    startDate: this.state.startDate,
                    endDate: this.state.endDate,
                    needExperience: this.state.needExperience,
                    needEnglish: this.state.needEnglish,
                    comment: this.state.comment,
                    PositionRateId: this.state.PositionRateId,
                    userId: 1
                }
            }
        }).then((data) => {
            this.props.handleOpenSnackbar('success', 'Preference Inserted!');
            this.setState({ openModal: false });
            window.location.reload();
        }).catch((error) => {
            this.props.handleOpenSnackbar('error', 'Error Preferences: ' + error);
        });
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });


        if (name === 'IdEntity') {
            this.getPositions(value);
        }
    };

    getPositions = (id, PositionId = null) => {
        this.props.client
            .query({
                query: GET_POSITION_BY_QUERY,
                variables: { id: id },
            })
            .then(({ data }) => {
                this.setState({
                    positions: data.getposition,
                    PositionRateId: PositionId
                });
            })
            .catch();
    }

    render() {
        return (
            <div>
                <Dialog maxWidth="lg" open={this.state.openModal} onClose={this.props.handleCloseModal} >
                    <DialogTitle style={{ padding: '0px' }}>
                        <div className="modal-header">
                            <h5 className="modal-title">Work Order</h5>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <form action="" onSubmit={this.handleSubmit}>
                            <div className="row">
                                <div className="col-md-4">
                                    <label htmlFor="">Hotel</label>
                                    <select name="IdEntity" className="form-control" id="" onChange={this.handleChange} value={this.state.IdEntity}>
                                        <option value={0}>Select a Hotel</option>
                                        {
                                            this.state.hotels.map((hotel) => (
                                                <option value={hotel.Id} >{hotel.Name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="">Position</label>
                                    <select name="PositionRateId" className="form-control" id="" onChange={this.handleChange} value={this.state.PositionRateId}>
                                        <option value="0">Select a Position</option>
                                        {
                                            this.state.positions.map((position) => (
                                                <option value={position.Id} >{position.Position}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="">Quantity</label>
                                    <input type="text" className="form-control" name="quantity" onChange={this.handleChange} value={this.state.quantity} />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="">Shift</label>
                                    <select className="form-control" name="shift" onChange={this.handleChange} value={this.state.shift}>
                                        <option value="0">Select a Shift</option>
                                        {
                                            this.state.ShiftsData.map((shift) => (
                                                <option value={shift.Id} >{shift.Name}</option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="">Date Needed By</label>
                                    <input type="date" className="form-control" name="startDate" onChange={this.handleChange} value={this.state.startDate.substring(0, 10)} />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="">To</label>
                                    <input type="date" className="form-control" name="endDate" onChange={this.handleChange} value={this.state.endDate.substring(0, 10)} />
                                </div>
                                <div className="col-md-4">
                                    <label htmlFor="">Date</label>
                                    <input type="date" className="form-control" name="date" onChange={this.handleChange} value={this.state.date.substring(0, 10)} />
                                </div>
                                <div className="col-md-12">
                                    <div className="form-separator">Requirements</div>
                                </div>
                                <div className="col-md-3">
                                    <label>
                                        Need Experience?
                                    </label>
                                    <div className="onoffswitch">
                                        <input type="checkbox" name="needExperience" onClick={this.toggleState} onChange={this.handleChange} className="onoffswitch-checkbox" id="myonoffswitch" checked={this.state.needExperience} />
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
                                        <input type="checkbox" name="needEnglish" onClick={this.toggleState} onChange={this.handleChange} className="onoffswitch-checkbox" id="myonoffswitchSpeak" checked={this.state.needEnglish} />
                                        <label className="onoffswitch-label" htmlFor="myonoffswitchSpeak">
                                            <span className="onoffswitch-inner"></span>
                                            <span className="onoffswitch-switch"></span>
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="">Comment</label>
                                    <textarea onChange={this.handleChange} name="comment" className="form-control" id="" cols="30" rows="10" value={this.state.comment}></textarea>
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

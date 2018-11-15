import React, { Component } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import withMobileDialog from '@material-ui/core/withMobileDialog';
import { withApollo } from 'react-apollo';

class Filters extends Component {

    constructor() {
        super();
        this.state = {
            needExperience: false,
            needEnglish: false
        }
    }

    render() {
        return (
            <div>
                <Dialog maxWidth="sm" open={this.props.openModal} onClose={this.props.handleCloseModal}>
                    <DialogTitle style={{ padding: '0px' }}>
                        <div className="modal-header">
                            <h5 className="modal-title">Filters</h5>
                        </div>
                    </DialogTitle>
                    <DialogContent>
                        <form action="">
                            <div className="row">
                                <div className="col-md-6">
                                    <label>Need Experience?</label>
                                    <div className="onoffswitch">
                                        <input
                                            type="checkbox"
                                            name="needExperience"
                                            onClick={this.toggleState}
                                            onChange={this.handleChange}
                                            className="onoffswitch-checkbox"
                                            id="myonoffswitch"
                                            checked={this.state.needExperience}
                                        />
                                        <label className="onoffswitch-label" htmlFor="myonoffswitch">
                                            <span className="onoffswitch-inner" />
                                            <span className="onoffswitch-switch" />
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <label>Need to Speak English?</label>
                                    <div className="onoffswitch">
                                        <input
                                            type="checkbox"
                                            name="needEnglish"
                                            onClick={this.toggleState}
                                            onChange={this.handleChange}
                                            className="onoffswitch-checkbox"
                                            id="myonoffswitchSpeak"
                                            checked={this.state.needEnglish}
                                        />
                                        <label className="onoffswitch-label" htmlFor="myonoffswitchSpeak">
                                            <span className="onoffswitch-inner" />
                                            <span className="onoffswitch-switch" />
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="">Distance</label>
                                    <input type="number" name="distance" className="form-control" />
                                </div>
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <button className="btn btn-danger ml-1 float-right" onClick={this.props.handleCloseModal}>
                                                Cancel<i class="fas fa-ban ml-2" />
                                            </button>
                                            <button className="btn btn-success ml-1 float-right" type="submit">
                                                Save {!this.state.saving && <i class="fas fa-save ml2" />}
                                                {this.state.saving && <i class="fas fa-spinner fa-spin  ml2" />}
                                            </button>
                                        </div>
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

export default Filters;
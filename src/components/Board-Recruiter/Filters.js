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
            needEnglish: false,
            distance: 0
        }
    }


    handleChange = (event) => {

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    };

    CloseWin = () => {

        sessionStorage.setItem('NewFilterLead', false);
        sessionStorage.setItem('needExperienceLead', false);
        sessionStorage.setItem('needEnglishLead', false);
        sessionStorage.setItem('distances', 30);

        this.props.handleCloseModal()
    }

    NewFilters = () => {
        sessionStorage.setItem('NewFilterLead', true);
        sessionStorage.setItem('needExperienceLead', this.state.needExperience);
        sessionStorage.setItem('needEnglishLead', this.state.needEnglish);
        sessionStorage.setItem('distances', this.state.distance);

        this.props.handleCloseModal()
        //  localStorage.setItem('NewFilter', true);
        // localStorage.setItem('needExperience', this.state.needExperience);
        //localStorage.setItem('needEnglish', this.state.needEnglish);
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
                                    <label>Needs Experience?</label>
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
                                    <label>Needs to Speak English?</label>
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
                                    <input
                                        onChange={(event) => {
                                            this.setState({
                                                distance: event.target.value
                                            });
                                        }}
                                        value={this.state.distance}
                                        name="distance"
                                        type="number"
                                        className="form-control"
                                        min="0"
                                        maxLength="50"
                                    />

                                </div>
                                <div className="col-md-12">
                                    <div className="row">
                                        <div className="col-md-12">
                                            <button className="btn btn-danger ml-1 float-right" onClick={this.CloseWin}>
                                                Reset Filters<i class="fas fa-ban ml-2" />
                                            </button>
                                            <button className="btn btn-success ml-1 float-right" onClick={this.NewFilters}>
                                                New Filter {!this.state.saving && <i class="fas fa-filter ml2" />}
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
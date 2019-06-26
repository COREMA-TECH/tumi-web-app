import React, {Component, Fragment } from 'react';
import Select from 'react-select';
import Timer from './timer';

import { withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import grey from '@material-ui/core/colors/grey';
import TextField from '@material-ui/core/TextField';
import FileUpload from 'ui-components/FileUpload/FileUpload';


const styles = (theme) => ({
    timerBox: {
        backgroundColor: grey[300]
    }
});

class MasterShift extends Component{

    state = {
        runTimer: false
    }

    handleSubmit = (e) => {
        e.preventDefault();
    }

    render() {
        let { open, classes } = this.props;
        return (
            <Fragment>
                <div className={`MasterShiftForm ${open ? 'active' : ''}`}>
                    <header className="MasterShiftForm-header">
                        <div className="row">
                            <div className="col-md-10">
                                <h3 className="MasterShiftForm-title">Title</h3>
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-link MasterShiftForm-close"
                                    onClick={this.props.handleClose}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                        </div>
                    </header>

                    <div className="row">
                        <div className="col-12">
                            <form onSubmit={this.preventDefault}>
                                <label htmlFor="">Hotel</label>
                                <Select
                                    name="hotel"
                                    //options={opManagerOptions}
                                    //onChange={(option) => this.filterOpManager(option)}
                                    placeholder="Select a Hotel"
                                    closeMenuOnSelect
                                />
                                
                                <label htmlFor="">Location</label>
                                <p>Mapa XD</p>

                                <div className={`d-flex border border-success mt-3 ${classes.timerBox}`} >
                                    <div className="w-100 d-flex align-items-center justify-content-center">
                                        <Timer run={ this.state.runTimer } />
                                    </div>

                                    <div className="flex-shrink-1 d-flex align-items-stretch justify-content-center flex-column">
                                        <div className="border border-success p-1">
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-primary btn-block"
                                                onClick={() => this.setState(() => {
                                                    return { runTimer: true }
                                                })}
                                                >
                                                Start
                                            </button>
                                        </div>

                                        <div className="border border-success p-1">
                                            <button 
                                                type="button" 
                                                className="btn btn-sm btn-danger btn-block"
                                                onClick={() => this.setState(() => {
                                                    return { runTimer: false }
                                                })}
                                                >
                                                Finalize
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <label htmlFor="">Comment</label>
                                <textarea
                                    name="comment"
                                    cols="60"
                                    rows="3"
                                    className="form-control textarea-apply-form"
                                />

                                <label htmlFor="">Photo</label>
                                <FileUpload
                                        // updateURL={(url, fileName) => {
                                        //     this.setState({
                                        //         contractURL: url,
                                        //         contractFile: fileName
                                        //     });
                                        // }}
                                        //url={this.state.contractURL}
                                        //fileName={this.state.contractFile}
                                        //handleOpenSnackbar={this.props.handleOpenSnackbar}
                                    />
                            </form>
                        </div>
                    </div>

                    <footer className="MasterShiftForm-footer">
                        <div className="d-flex justify-content-between p-3">
                            <button type="button" className="btn btn-success">
                                Save
                            </button>

                            <button type="button" className="btn btn-light">
                                Cancel
                            </button>
                        </div>
                    </footer>
                </div>

                {/* <div className="MasterShiftForm-overlay" onClick={() => this.props.handleCloseForm(this.resetInputs)}></div> */}
            </Fragment>
        )
    }
}

export default withStyles(styles)(MasterShift);
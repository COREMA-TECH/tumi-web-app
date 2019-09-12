import React, { Component, Fragment } from 'react';
import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Dialog from "@material-ui/core/Dialog/Dialog";
import Select from 'react-select';

class RolesModal extends Component {
    render() {
        return <Fragment>
            <Dialog maxWidth="md" open={this.props.open} onClose={this.props.handleClose}>
                <DialogTitle style={{ padding: '0px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">{this.props.title}</h5>
                    </div>
                </DialogTitle>
                <DialogContent>
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12">
                                <label htmlFor="screen">Default Screen</label>
                                <Select
                                    options={this.props.forms}
                                    value={this.props.formSelected}
                                    onChange={this.props.handleChangeForms}
                                    closeMenuOnSelect={false}
                                    //components={makeAnimated()}
                                />                      
                            </div>
                        </div>


                        <div className="row pl-0 pr-0">
                            <div className="col-md-12">
                                <button
                                    className="btn btn-danger ml-1 float-right"
                                    onClick={ this.props.handleClose }
                                >
                                    Close<i class="fas fa-ban ml-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Fragment>
    }
}

export default RolesModal;
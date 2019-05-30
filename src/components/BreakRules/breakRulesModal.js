import React, {Component} from 'react';

import DialogTitle from "@material-ui/core/DialogTitle/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent/DialogContent";
import Dialog from "@material-ui/core/Dialog/Dialog";
import makeAnimated from "react-select/lib/animated";
import Select from 'react-select';

class BreakRulesModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ruleName: '',
            code: '',
            time: 0,
            lenght: 0,
            lenghtOptions: [
                { value: 'Minutes', label: 'Minutes' },
                { value: 'hours', label: 'Hours' },
            ],   
            selectedEmployees: [],
            selectedEmployee: null,
            employeeSelectOptions: []       
        }
    }

    render() {
        return(
            <Dialog className="BreaksModal" fullWidth maxWidth="sm" open={this.props.openModal} onClose={this.props.handleClose}>
                <DialogTitle style={{ padding: '0px' }}>
                    <div className="modal-header">
                        <h5 className="modal-title">Break Rule</h5>
                    </div>
                </DialogTitle>
                <DialogContent>
                   <form onSubmit={this.props.handleSubmit}>
                        <div className="form-row">
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label for="ruleName">Name</label>
                                    <input value={this.state.ruleName} name="ruleName" type="text" className="form-control" id="ruleName"/>
                                </div>                            
                            </div>    
                            <div className="col-12 col-md-6">
                                <div className="form-group">
                                    <label for="code">Code</label>
                                    <input value={this.state.code} name="code" type="text" className="form-control" id="code"/>
                                </div>                            
                            </div>    
                        </div>
                        <div className="form-row">
                            <div className="col-md-4">
                                <div className="form-group">
                                    <label for="lenght">Lenght</label>
                                    <input value={this.state.lenght} name="lenght" type="text" className="form-control" id="lenght"/>
                                </div>                            
                            </div>
                            <div className="col-md-4">
                                <div className="form-group">
                                    <Select
                                        options={this.state.lenghtOptions}
                                        value={{value: 'minutes', label: "Minutes"}}
                                        onChange={_ => {}}
                                        closeMenuOnSelect={true}
                                        components={makeAnimated()}
                                        isMulti={false}
                                        className='BreaksModal-timeOpt'                                        
                                    />
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group mb-0">
                                    <label className="d-block" for="">Type</label>
                                    <div className="BreaksModal-radioWrap">
                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="isPaid" id="isPaid" value="true" />
                                            <label className="form-check-label" for="isPaid">
                                                Paid
                                            </label>
                                        </div>

                                        <div className="form-check">
                                            <input className="form-check-input" type="radio" name="isPaid" id="isUnpaid" value="false" />
                                            <label className="form-check-label" for="isUnpaid">
                                                Unpaid
                                            </label>
                                        </div>
                                    </div>
                                </div>  
                            </div>
                        </div> 
                        {/* End Form Row */}
                        <div class="form-group row">
                            <label for="employeeSelect" class="col-sm-2 col-form-label">Employees</label>
                            <div class="col-sm-10">
                                <Select
                                    options={this.state.selectedEmployees}
                                    value={this.state.selectedEmployee}
                                    onChange={_ => {}}
                                    closeMenuOnSelect={false}
                                    components={makeAnimated()}
                                    isMulti={true}                                    
                                />
                            </div>
                        </div>
                   </form>
                </DialogContent>
            </Dialog>
        );
    }
}

export default BreakRulesModal;
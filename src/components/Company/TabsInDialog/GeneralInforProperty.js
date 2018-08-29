import React, {Component} from 'react';
import InputForm from "../../ui-components/InputForm/InputForm";

class GeneralInfoProperty extends Component {
    render() {
        return (
            <div>
                <div className="general-information__content">
                    <div className="dialog-row">
                        <div className="card-form-row">
                            <span className="input-label primary">Company Name</span>
                            <InputForm/>
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">Address</span>
                            <InputForm/>
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">Address 2</span>
                            <InputForm/>
                        </div>
                    </div>
                    <div className="dialog-row">
                        <div className="card-form-row">
                            <span className="input-label primary">Suite</span>
                            <InputForm/>
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">City</span>
                            <InputForm/>
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">State</span>
                            <InputForm/>
                        </div>
                    </div>
                    <div className="dialog-row">
                        <div className="card-form-row">
                            <span className="input-label primary">Zip Code</span>
                            <InputForm/>
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">Phone Number</span>
                            <InputForm/>
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">Fax Week</span>
                            <InputForm/>
                        </div>
                    </div>
                </div>
                <div className="general-information__content">
                    <div className="dialog-row">
                        <div className="card-form-row">
                            <span className="input-label primary">Property Code</span>
                            <InputForm/>
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">Cost Center</span>
                            <InputForm/>
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">Contract Start Date</span>
                            <InputForm/>
                        </div>
                    </div>
                    <div className="dialog-row">
                        <div className="card-form-row">
                            <span className="input-label primary">Room</span>
                            <InputForm/>
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">Week Start</span>
                            <InputForm/>
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">Contract</span>
                            <InputForm/>
                        </div>
                    </div>
                    <div className="dialog-row">
                        <div className="card-form-row">
                            <span className="input-label primary">Insurance</span>
                            <InputForm/>
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">Other</span>
                            <InputForm/>
                        </div>
                        <div className="card-form-row">
                            <span className="input-label primary">Other 2</span>
                            <InputForm/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

GeneralInfoProperty.propTypes = {};

export default GeneralInfoProperty;

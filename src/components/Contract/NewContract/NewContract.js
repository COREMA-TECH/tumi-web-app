import React, {Component} from 'react';
import './index.css';
import InputForm from "../../ui-components/InputForm/InputForm";
import TextAreaForm from "../../ui-components/InputForm/TextAreaForm";
import data from '../../../data/days.json';
import SelectForm from "../../ui-components/SelectForm/SelectForm";

class NewContract extends Component {
    render() {
        return (
            <div className="contract-container">
                <div className="contract-body">
                    <div className="contract-body__content">
                        <div className="contract-body-row">

                            <div className="contract-body-row__content">
                                <div className="contract-body-row__header">
                                  <span className="contract-body__subtitle">
                                    Contact Information
                                  </span>
                                </div>
                                <div className="contract-body-row__form">
                                    <div className="card-form-body">
                                        <div className="card-form-row">
                                            <span className="input-label primary">Contract Name</span>
                                            <InputForm />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Contract Owner</span>
                                            <InputForm />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Account Name</span>
                                            <InputForm />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Customer Signed By</span>
                                            <InputForm />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Customer Signed Title</span>
                                            <InputForm />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Customer Signed Date</span>
                                            <InputForm />
                                        </div>
                                    </div>
                                </div>

                                <div className="contract-body-row__form">
                                    <div className="card-form-body">
                                        <div className="card-form-row">
                                            <span className="input-label primary">Status</span>
                                            <SelectForm data={data} />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Contract Start Date</span>
                                            <InputForm />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Contract Term (months)</span>
                                            <InputForm />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Owner Expiration Notice</span>
                                            <SelectForm data={data} />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Company Signed By</span>
                                            <InputForm />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Company Signed Date</span>
                                            <InputForm />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="contract-body-row__content">
                                <div className="contract-body-row__header">
                                  <span className="contract-body__subtitle">
                                    Billing Information
                                  </span>
                                </div>
                                <div className="contract-body-row__form">
                                    <div className="card-form-body">
                                        <div className="card-form-row">
                                            <span className="input-label primary">Billing Name</span>
                                            <InputForm />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Billing Street</span>
                                            <InputForm />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Billing City</span>
                                            <InputForm />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Billing State / Providence</span>
                                            <SelectForm data={data} />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Billing Zip Code / Postal Code</span>
                                            <InputForm />
                                        </div>
                                        <div className="card-form-row">
                                            <span className="input-label primary">Billing Country</span>
                                            <InputForm />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="contract-body-row__content">
                                <div className="contract-body-row__header">
                                    <span className="contract-body__subtitle">
                                      Contract Information
                                    </span>
                                </div>
                                <div className="contract-body-row__form">
                                    <div className="card-form-body">
                                        <div className="card-form-row">
                                            <span className="input-label primary">Contract Terms</span>
                                            <TextAreaForm />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="contract-footer">
                            <div className="contract-next-button">Save</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NewContract;

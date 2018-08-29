import React, {Component} from 'react';
import './index.css';
import InputForm from "../../ui-components/InputForm/InputForm";
import TextAreaForm from "../../ui-components/InputForm/TextAreaForm";
import ContactsTable from "../../Company/ContactsTable/ContactsTable";

class ExhibitContract extends Component {
    render() {
        return (
            <div className="contract-container">
                <div className="contract-body">
                    <div className="contract-body__content">
                        <div className="contract-body-row">

                            <div className="contract-body-row__content">
                                <div className="contract-body-row__header">
                                  <span className="contract-body__subtitle">
                                    Exhibit A (Rates & Positions)
                                  </span>
                                </div>
                                <div className="contract-body-row__form contract-body-row__form--lg">

                                </div>
                            </div>

                            <div className="contract-body-row__content">
                                <div className="contract-body-row__header">
                                    <span className="contract-body__subtitle">
                                      Exhibit C
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

                            <div className="contract-body-row__content">
                                <div className="contract-body-row__header">
                                    <span className="contract-body__subtitle">
                                      Exhibit C
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

                            <div className="contract-body-row__content">
                                <div className="contract-body-row__header">
                                    <span className="contract-body__subtitle">
                                      Exhibit D
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

                            <div className="contract-body-row__content">
                                <div className="contract-body-row__header">
                                    <span className="contract-body__subtitle">
                                      Exhibit E
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

                            <div className="contract-body-row__content">
                                <div className="contract-body-row__header">
                                    <span className="contract-body__subtitle">
                                      Exhibit F
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

export default ExhibitContract;

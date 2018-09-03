import React, {Component} from 'react';
import './index.css';
import TextAreaForm from "../../ui-components/InputForm/TextAreaForm";
import withApollo from "react-apollo/withApollo";
import {gql} from "apollo-boost";

class ExhibitContract extends Component {
    constructor(props) {
        super(props);

        this.state = {
            exhibitA: '',
            exhibitB: '',
            exhibitC: '',
            exhibitD: '',
            exhibitE: '',
            exhibitF: '',
        }
    }

    ADD_EXHIBIT = gql`
        mutation updcontracstexhibit($Id: Int, $Exhibit_B: String, $Exhibit_C: String, $Exhibit_D: String, $Exhibit_E: String,  $Exhibit_F: String) {
            updcontracstexhibit(
                Id: $Id,
                Exhibit_B: $Exhibit_B,
                Exhibit_C: $Exhibit_C,
                Exhibit_D: $Exhibit_D,
                Exhibit_E: $Exhibit_E,
                Exhibit_F: $Exhibit_F){
                Id
                Exhibit_B
                Exhibit_C
                Exhibit_D
                Exhibit_E
                Exhibit_F
            }
        }
    `;

    insertExhibit = () => {
        this.props.client
            .mutate({
                mutation: this.ADD_EXHIBIT,
                variables: {
                    Id: 16,
                    Exhibit_B: `'${this.state.exhibitB}'`,
                    Exhibit_C: `'${this.state.exhibitC}'`,
                    Exhibit_D: `'${this.state.exhibitD}'`,
                    Exhibit_E: `'${this.state.exhibitE}'`,
                    Exhibit_F: `'${this.state.exhibitF}'`,
                }
            })
    };

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
                                      Exhibit B
                                    </span>
                                </div>
                                <div className="contract-body-row__form">
                                    <div className="card-form-body">
                                        <div className="card-form-row">
                                            <span className="input-label primary">Contract Terms</span>
                                            <TextAreaForm
                                                value={this.state.exhibitB}
                                                change={(text) => {
                                                    this.setState({
                                                        exhibitB: text
                                                    })
                                                }}
                                            />
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
                                            <TextAreaForm
                                                value={this.state.exhibitC}
                                                change={(text) => {
                                                    this.setState({
                                                        exhibitC: text
                                                    })
                                                }}
                                            />
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
                                            <TextAreaForm
                                                value={this.state.exhibitD}
                                                change={(text) => {
                                                    this.setState({
                                                        exhibitD: text
                                                    })
                                                }}
                                            />
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
                                            <TextAreaForm
                                                value={this.state.exhibitE}
                                                change={(text) => {
                                                    this.setState({
                                                        exhibitE: text
                                                    })
                                                }}
                                            />
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
                                            <TextAreaForm
                                                value={this.state.exhibitF}
                                                change={(text) => {
                                                    this.setState({
                                                        exhibitF: text
                                                    })
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="contract-footer">
                            <div
                                className="contract-next-button"
                                onClick={
                                    () => {
                                        // Insert Exhibits
                                        this.insertExhibit();
                                    }
                                }
                            >
                                Save
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withApollo(ExhibitContract);

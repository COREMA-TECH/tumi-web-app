import React, { Component } from 'react';
import InputMask from "react-input-mask";

class EmployeeInputRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            emailAddress: '',
            phoneNumber: '',

            lastRow: true
        }
    }

    render() {
        const firstName = `firstName${this.props.index}`;
        const lastName = `lastName${this.props.index}`;
        const email = `email${this.props.index}`;
        const phoneNumber = `phoneNumber${this.props.index}`;
        const department = `department${this.props.index}`;
        const contactTitle = `contactTitle${this.props.index}`;


        return (
            <div className="row">
                <div className="col-md-2">
                    <input
                        onChange={(e) => {
                            const value = e.target.value;
                            this.props.onchange(firstName, value);

                            if (this.state.lastRow) {
                                if (value.length > 2) {
                                    this.props.newRow();
                                    this.setState({
                                        lastRow: false
                                    })
                                }
                            }
                        }}
                        value={this.props[firstName]}
                        type="text"
                        name="firstName"
                        className="form-control"
                        required={!this.state.lastRow}
                    />
                </div>
                <div className="col-md-2">
                    <input
                        onChange={(e) => {
                            this.props.onchange(lastName, e.target.value);
                        }}
                        type="text"
                        value={this.props[lastName]}
                        name="lastName"
                        className="form-control"
                        required={!this.state.lastRow}
                    />
                </div>
                <div className="col-md-2">
                    <input
                        onChange={(e) => {
                            this.props.onchange(email, e.target.value);
                        }}
                        value={this.props[email]}
                        type="email"
                        name="email"
                        className="form-control"
                        required={!this.state.lastRow}
                    />
                </div>
                <div className="col-md-2">
                    <InputMask
                        id="number"
                        name="number"
                        mask="+(999) 999-9999"
                        maskChar=" "
                        value={this.props[phoneNumber]}
                        className="form-control"
                        onChange={(e) => {
                            this.props.onchange(phoneNumber, e.target.value);
                        }}
                        placeholder="+(999) 999-9999"
                        pattern="^(\+\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$"
                    />
                </div>
                <div className="col-md-2">
                    <select
                        className="form-control"
                        onChange={(e) => {
                            this.props.onchange(department, e.target.value);
                        }}>
                        <option>Select a option</option>
                        {
                            this.props.departments.map(item => {
                                return (
                                    <option value={item.Id}>{item.Name.trim()}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="col-md-2">
                    <select
                        className="form-control"
                        onChange={(e) => {
                            this.props.onchange(contactTitle, e.target.value);
                        }}>
                        <option>Select a option</option>
                        {
                            this.props.titles.map(item => {
                                return (
                                    <option value={item.Id}>{item.Name.trim()}</option>
                                )
                            })
                        }
                    </select>
                </div>
            </div>
        );
    }
}

export default EmployeeInputRow;
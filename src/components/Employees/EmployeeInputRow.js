import React, {Component} from 'react';

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
        return (
            <div className="row">
                <div className="col-md-3">
                    <input
                        onChange={(e) => {
                            this.props.onchange('firstName'+this.props.index, e.target.value);
                            this.setState({
                                firstName: e.target.value
                            }, () => {
                                if(this.state.lastRow){
                                    if (this.state.firstName.length > 2) {
                                        this.props.newRow();
                                        this.setState({
                                            lastRow: false
                                        })
                                    }
                                }
                            })
                        }}
                        type="text"
                        name="firstName"
                        className="form-control"
                        required={!this.state.lastRow}
                    />
                </div>
                <div className="col-md-3">
                    <input
                        onChange={(e) => {
                            this.setState({
                                lastName: e.target.value
                            })
                        }}
                        type="text"
                        name="lastName"
                        className="form-control"
                        required={!this.state.lastRow}
                    />
                </div>
                <div className="col-md-3">
                    <input
                        onChange={(e) => {
                            this.setState({
                                emailAddress: e.target.value
                            })
                        }}
                        type="email"
                        name="email"
                        className="form-control"
                        required={!this.state.lastRow}
                    />
                </div>
                <div className="col-md-3">
                    <input
                        onChange={(e) => {
                            this.setState({
                                phoneNumber: e.target.value
                            })
                        }}
                        type="number"
                        name="number"
                        className="form-control"
                        required={!this.state.lastRow}
                    />
                </div>
            </div>
        );
    }
}

export default EmployeeInputRow;
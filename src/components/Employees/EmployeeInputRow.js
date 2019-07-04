import React, { Component } from 'react';

import { withStyles } from "@material-ui/core";
import withApollo from "react-apollo/withApollo";
import withGlobalContent from "Generic/Global";
import green from "@material-ui/core/colors/green";

import InputMask from "react-input-mask";
import { GET_DEPARTMENTS_QUERY } from "../ApplyForm/Application/ProfilePreview/Queries";
import { GET_ALL_POSITIONS_QUERY } from "./Queries";
import DatePicker from "react-datepicker";
import moment from 'moment';

const styles = theme => ({
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        marginBottom: "30px",
        width: "100%"
    },
    root: {
        display: "flex",
        alignItems: "center"
    },
    formControl: {
        margin: theme.spacing.unit
        //width: '100px'
    },
    button: {
        margin: theme.spacing.unit
    },
    input: {
        display: "none"
    },
    wrapper: {
        position: "relative"
    },
    buttonSuccess: {
        backgroundColor: green[500],
        "&:hover": {
            backgroundColor: green[700]
        }
    },
    fabProgress: {
        color: green[500],
        position: "absolute",
        top: -6,
        left: -6,
        zIndex: 1
    },
    buttonProgress: {
        color: green[500],
        position: "absolute",
        top: "50%",
        left: "50%",
        marginTop: -12,
        marginLeft: -12
    }
});

class EmployeeInputRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            emailAddress: '',
            phoneNumber: '',

            lastRow: true,
            department: "",
            contactTitle: "",

            arrayDepartment: [],
            arraytitles: []
        }
    }

    fetchTitles = (id) => {
        this.props.client
            .query({
                query: GET_ALL_POSITIONS_QUERY,
                variables: { Id_Department: id },
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.getposition != null) {
                    this.setState({
                        arraytitles: data.data.getposition,
                    }, () => {
                        // this.getHotels()
                    });
                }
            })
            .catch((error) => {
                // TODO: show a SnackBar with error message
                this.setState({
                    loading: false
                })
            });
    };

    componentWillMount() {
        this.fetchDepartments()
    }

    fetchDepartments = (id) => {
        this.props.client
            .query({
                query: GET_DEPARTMENTS_QUERY,
                variables: { Id_Entity: id },
                fetchPolicy: 'no-cache'
            })
            .then((data) => {
                if (data.data.getcatalogitem != null) {
                    this.setState({
                        arrayDepartment: data.data.getcatalogitem,
                        //  departments: data.data.getcatalogitem,
                    });
                }
            })
            .catch((error) => {
                // TODO: show a SnackBar with error message

                this.setState({
                    loading: false
                })
            });
    };

    handleChangeDate = (hireDate) => (date) => {
        let _date = moment(date).format();
        
        this.props.onchange(hireDate, _date);

        this.setState(prevState => {
            return { hireDateSelected: _date }
        })
    }

    render() {
        const firstName = `firstName${this.props.index}`;
        const lastName = `lastName${this.props.index}`;
        const email = `email${this.props.index}`;
        const phoneNumber = `phoneNumber${this.props.index}`;
        const department = `department${this.props.index}`;
        const contactTitle = `contactTitle${this.props.index}`;
        const idEntity = `idEntity${this.props.index}`;
        const hireDate = `hireDate${this.props.index}`;

        return (

            <div className="row Employees-row">
                <div className="col">
                    <label htmlFor="" >* First Name</label>
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
                        maxLength={50}
                    />
                </div>
                <div className="col">
                    <label htmlFor="" >* Last Name</label>
                    <input
                        onChange={(e) => {
                            this.props.onchange(lastName, e.target.value);
                        }}
                        type="text"
                        value={this.props[lastName]}
                        name="lastName"
                        className="form-control"
                        required={!this.state.lastRow}
                        maxLength={50}
                    />
                </div>
                <div className="col">
                    <label htmlFor="">Start Date</label>
                    {/* <input
                        onChange={(e) => {
                            this.props.onchange(hireDate, e.target.value);
                        }}
                        value={this.props[hireDate]}
                        type="text"
                        name="hireDate"
                        className="form-control"
                        maxLength={100}
                    /> */
                    }
                    <DatePicker
                        selected={this.state.hireDateSelected}
                        onChange={this.handleChangeDate(hireDate)}
                        id="datepicker"
                    />
                </div>
                <div className="col">
                    <label htmlFor="">* Phone Number</label>
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
                        placeholder="+(___) ___-____"
                        pattern="^(\+\([0-9]{3}\) |[0-9]{3}-)[0-9]{3}-[0-9]{4}$"
                        required={this.props.phoneRequired}
                    />
                </div>
                <div className="col">
                    <label htmlFor="">Hotel</label>
                    <select
                        className="form-control"
                        onChange={(e) => {
                            this.setState({
                                hotelEdit: e.target.value
                            });

                            this.props.onchange(idEntity, e.target.value);


                            this.props.onchange(department, null);
                            this.props.onchange(contactTitle, null);
                            this.setState({
                                department: "",
                                contactTitle: "",
                            });

                            if (e.target.value == "null") {
                                this.fetchDepartments();
                            } else {
                                this.fetchDepartments(e.target.value);
                            }
                        }}
                        value={this.state.hotelEdit}
                    >
                        <option value="null">Select option</option>
                        {
                            this.props.hotels.map(item => {
                                return (
                                    <option value={item.Id}>{item.Name.trim()}</option>
                                )
                            })
                        }
                    </select>
                </div>
                <div className="col">
                    <label htmlFor="" >Department</label>
                    <select
                        value={this.state.department}
                        name="department"
                        id="department"
                        className="form-control"
                        onChange={(e) => {
                            this.setState({
                                department: e.target.value
                            }, () => {
                                this.fetchTitles(this.state.department)
                            });
                            this.props.onchange(department, e.target.value);
                        }}
                    >
                        <option value="">Select option</option>
                        {
                            this.state.arrayDepartment.map(item => (
                                <option value={item.Id}>{item.Name.trim()}</option>
                            ))
                        }
                    </select>
                </div>
                <div className="col">
                    <label htmlFor="" >Position</label>
                    <select
                        id="contactTitle"
                        name="contactTitle"
                        className="form-control"
                        value={this.state.contactTitle}
                        onChange={(e) => {
                            this.setState({
                                contactTitle: e.target.value
                            });
                            this.props.onchange(contactTitle, e.target.value);
                        }}
                    >
                        <option value="">Select option</option>
                        {
                            this.state.arraytitles.map(item => {
                                if (this.state.hotelEdit == item.Id_Entity) {
                                    return (
                                        <option value={item.Id}>{item.Position.trim()}</option>
                                    )
                                }
                            })
                        }
                    </select>
                </div>
            </div>
        );
    }
}

//export default EmployeeInputRow;
export default withStyles(styles)(withApollo(withGlobalContent(EmployeeInputRow)));

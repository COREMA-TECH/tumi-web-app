import React, { Component } from 'react';

import { withStyles } from "@material-ui/core";
import withApollo from "react-apollo/withApollo";
import withGlobalContent from "Generic/Global";
import green from "@material-ui/core/colors/green";

import InputMask from "react-input-mask";
import { GET_DEPARTMENTS_QUERY } from "../ApplyForm/Application/ProfilePreview/Queries";
import { GET_ALL_POSITIONS_QUERY } from "./Queries";

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
                variables: { Id_Entity: id },
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
                    }, () => {
                        this.fetchTitles(id)
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

    render() {
        const firstName = `firstName${this.props.index}`;
        const lastName = `lastName${this.props.index}`;
        const email = `email${this.props.index}`;
        const phoneNumber = `phoneNumber${this.props.index}`;
        const department = `department${this.props.index}`;
        const contactTitle = `contactTitle${this.props.index}`;
        const idEntity = `idEntity${this.props.index}`;

        return (

            < div className="row Employees-row">
                <div className="col">
                    <label htmlFor="" className="d-xs-block d-sm-block d-lg-none d-xl-none">* First Name</label>
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
                    <label htmlFor="" className="d-xs-block d-sm-block d-lg-none d-xl-none">* Last Name</label>
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
                    <label htmlFor="" className="d-xs-block d-sm-block d-lg-none d-xl-none">Email Address</label>
                    <input
                        onChange={(e) => {
                            this.props.onchange(email, e.target.value);
                        }}
                        value={this.props[email]}
                        type="email"
                        name="email"
                        className="form-control"
                        maxLength={100}
                    />
                </div>
                <div className="col">
                    <label htmlFor="" className="d-xs-block d-sm-block d-lg-none d-xl-none">Phone Number</label>
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
                <div className="col">
                    <label htmlFor="" className="d-xs-block d-sm-block d-lg-none d-xl-none">Hotel</label>
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
                        <option value="null">Select a option</option>
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
                    <label htmlFor="" className="d-xs-block d-sm-block d-lg-none d-xl-none">Department</label>
                    <select
                        value={this.state.department}
                        name="department"
                        id="department"
                        className="form-control"
                        onChange={(e) => {
                            this.setState({
                                department: e.target.value
                            });
                            console.info("Department ID: ", e.target.value);
                            this.props.onchange(department, e.target.value);
                        }}
                    >
                        <option value="">Select a option</option>
                        {
                            this.state.arrayDepartment.map(item => (
                                <option value={item.Id}>{item.Name.trim()}</option>
                            ))
                        }
                    </select>
                    {/*<AutoComplete*/}
                    {/*id="department"*/}
                    {/*name="department"*/}
                    {/*value={this.state.department}*/}
                    {/*data={this.state.arrayDepartment}*/}
                    {/*//data={this.props.departments}*/}
                    {/*onChange={(value) => {*/}
                    {/*console.log("Department Title: ",value);*/}
                    {/*this.props.onchange(department, value);*/}
                    {/*this.setState({*/}
                    {/*department: value*/}
                    {/*})*/}
                    {/*}}*/}
                    {/*onSelect={(value) => {*/}
                    {/*console.log("Department Title: ",value);*/}
                    {/*this.props.onchange(department, value);*/}
                    {/*this.setState({*/}
                    {/*department: value*/}
                    {/*})*/}
                    {/*}}*/}
                    {/*/>*/}
                </div>
                <div className="col">
                    <label htmlFor="" className="d-xs-block d-sm-block d-lg-none d-xl-none">Position</label>
                    <select
                        id="contactTitle"
                        name="contactTitle"
                        className="form-control"
                        value={this.state.contactTitle}
                        onChange={(e) => {
                            this.setState({
                                contactTitle: e.target.value
                            });

                            console.info("Contact Title ID: ", e.target.value);
                            this.props.onchange(contactTitle, e.target.value);
                        }}
                    >
                        <option value="">Select a option</option>
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
                    {/*<AutoComplete*/}
                    {/*id="contactTitle"*/}
                    {/*name="contactTitle"*/}
                    {/*value={this.state.contactTitle}*/}
                    {/*//data={this.props.titles}*/}
                    {/*data={this.state.arraytitles}*/}
                    {/*onChange={(value) => {*/}
                    {/*console.log("Contact Title: ",value);*/}
                    {/*this.props.onchange(contactTitle, value);*/}
                    {/*this.setState({*/}
                    {/*contactTitle: value*/}
                    {/*})*/}
                    {/*}}*/}
                    {/*onSelect={(value) => {*/}
                    {/*console.log("Contact Title: ",value);*/}
                    {/*this.props.onchange(contactTitle, value);*/}
                    {/*this.setState({*/}
                    {/*contactTitle: value*/}
                    {/*})*/}
                    {/*}}*/}
                    {/*/>*/}
                </div>
            </div>
        );
    }
}

//export default EmployeeInputRow;
export default withStyles(styles)(withApollo(withGlobalContent(EmployeeInputRow)));

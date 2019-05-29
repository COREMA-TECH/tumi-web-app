import React, { Component } from 'react';

import { withStyles } from "@material-ui/core";
import withApollo from "react-apollo/withApollo";
import withGlobalContent from "Generic/Global";
import green from "@material-ui/core/colors/green";

import InputMask from "react-input-mask";
import { GET_DEPARTMENTS_QUERY } from "../ApplyForm/Application/ProfilePreview/Queries";
import { GET_ALL_POSITIONS_QUERY } from "./Queries";

import makeAnimated from "react-select/lib/animated";
import Select from 'react-select';

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
            arraytitles: [],
            positionSelectArray: []
        }
    }

    fetchTitles = (id) => {
        console.log(id);
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
                        this.setState({
                            positionSelectArray: this.getPositionsList()
                        });
                    });
                }
            })
            .catch((error) => {
                console.log(error);
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

    getHotelsList = _ => {
        const hotels = this.props.hotels.map(item => {
            return { value: item.Id, label: item.Name.trim() }
        });

        const hotelList = [{value: "null", label: 'Select option'}, ...hotels];

        return hotelList;
    }

    getDepartmentsList = _ => {
        const departments = this.state.arrayDepartment.map(item => {
            return { value: item.Id, label: item.Name.trim() }
        });

        const depList = [{value: "null", label: 'Select option'}, ...departments];

        return depList;
    }

    getPositionsList = _ => {
        const positions = [];
        
        this.state.arraytitles.map(item => {
            if (this.state.hotelEdit == item.Id_Entity) {
                positions.push({value: item.Id, label: item.Position.trim()});
            }
        });

        const positionList = [{value: "null", label: "Select option"}, ...positions];

        return positionList;
    }

    findSelectedHotel = hotelId => {
        const defValue = {value: "null", label: "Select option"};

        if(hotelId === 'null')
            return defValue;

        const found = this.props.hotels.find(item => {
            return item.Id === hotelId;
        });

        return found ? {value: found.Id, label: found.Name.trim()} : defValue;
    }

    findSelectedDepartment = depId => {
        const defValue = {value: "null", label: "Select option"};

        if(depId === 'null')
            return defValue;

        const found = this.state.arrayDepartment.find(item => {
            return item.Id === depId;
        });

        return found ? {value: found.Id, label: found.Name.trim()} : defValue;
    }

    findSelectedPosition = positionId => {
        const defValue = {value: "null", label: "Select option"};

        if(positionId === 'null')
            return defValue;

        const found = this.state.arraytitles.find(item => {
            return item.Id === positionId;
        });

        return found ? {value: found.Id, label: found.Position.trim()} : defValue;
    }

    handleHotelChange = ({idEntity, department, contactTitle}) => ({value}) => {
        this.setState({
            hotelEdit: value
        });

        this.props.onchange(idEntity, value);

        this.props.onchange(department, null);
        this.props.onchange(contactTitle, null);
        this.setState({
            department: "",
            contactTitle: "",
        });

        if (value === "null") {
            this.fetchDepartments();
        } else {
            this.fetchDepartments(value);
        }
    }

    handleDepartmentChange = (department) => ({value}) => {
        this.setState({
            department: value
        }, () => {
            this.fetchTitles(this.state.department)
        });
        this.props.onchange(department, value);
    }

    handlePositionChange = (contactTitle) => ({value}) => {
        this.setState({
            contactTitle: value
        });
        this.props.onchange(contactTitle, value);
    }

    render() {
        const firstName = `firstName${this.props.index}`;
        const lastName = `lastName${this.props.index}`;
        const email = `email${this.props.index}`;
        const phoneNumber = `phoneNumber${this.props.index}`;
        const department = `department${this.props.index}`;
        const contactTitle = `contactTitle${this.props.index}`;
        const idEntity = `idEntity${this.props.index}`;

        const hotelSelectList = this.getHotelsList();
        const departmentSelectList = this.getDepartmentsList();
        const positionSelectList = this.getPositionsList();
        console.log(positionSelectList);

        return (
            < div className="row Employees-row" style={{minHeight: "200px"}}>
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
                    <label htmlFor="" >Email Address</label>
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
                    <label htmlFor="" >Phone Number</label>
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
                    <Select
                        options={hotelSelectList}
                        value={this.findSelectedHotel(this.state.hotelEdit)}
                        onChange={this.handleHotelChange({idEntity, department, contactTitle})}
                        closeMenuOnSelect={true}
                        components={makeAnimated()}
                        isMulti={false}
                    />
                </div>
                <div className="col">
                    <label htmlFor="" >Department</label>
                    <Select
                        options={departmentSelectList}
                        value={this.findSelectedDepartment(this.state.department)}
                        onChange={this.handleDepartmentChange(department)}
                        closeMenuOnSelect={true}
                        components={makeAnimated()}
                        isMulti={false}
                    />
                </div>
                <div className="col">
                    <label htmlFor="" >Position</label>
                    {/* <select
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
                        <option value="null">Select option</option>
                        {
                            this.state.arraytitles.map(item => {
                                if (this.state.hotelEdit == item.Id_Entity) {
                                    return (
                                        <option value={item.Id}>{item.Position.trim()}</option>
                                    )
                                }
                            })
                        }
                    </select> */}
                    
                    <Select
                        options={positionSelectList}
                        value={this.findSelectedPosition(this.state.contactTitle)}
                        onChange={this.handlePositionChange(contactTitle)}
                        closeMenuOnSelect={true}
                        components={makeAnimated()}
                        isMulti={false}
                    />
                </div>
            </div>
        );
    }
}

//export default EmployeeInputRow;
export default withStyles(styles)(withApollo(withGlobalContent(EmployeeInputRow)));

import React, { Component } from 'react';

import Select from 'react-select';
import { withStyles } from "@material-ui/core";
import withApollo from "react-apollo/withApollo";
import withGlobalContent from "Generic/Global";
import green from "@material-ui/core/colors/green";

import InputMask from "react-input-mask";
import { GET_DEPARTMENTS_QUERY } from "../ApplyForm/Application/ProfilePreview/Queries";
import { GET_POSIT_BY_HOTEL_DEPART_QUERY } from "./Queries";
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

const DEFAULT_HOTEL_OPT = { value: null, label: 'Select a Hotel' };
const DEFAULT_DEPARTMENT_OPT = { value: null, label: 'Select a Department' };
const DEFAULT_TITLE_OPT = { value: null, label: 'Select a Position' };

class EmployeeInputRow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            firstName: '',
            lastName: '',
            emailAddress: '',
            phoneNumber: '',

            hotelEdit: DEFAULT_HOTEL_OPT,
            department: DEFAULT_DEPARTMENT_OPT,
            contactTitle: DEFAULT_TITLE_OPT,

            arrayDepartment: [],
            arraytitles: []
        }
    }

    fetchTitles = (id) => {
        this.setState(() => {
            return {
                arraytitles: [],
                contactTitle: DEFAULT_TITLE_OPT
            }
        }, () => {
            if (!!id && !!this.state.hotelEdit.value) {
                this.props.client
                    .query({
                        query: GET_POSIT_BY_HOTEL_DEPART_QUERY,
                        variables: {
                            Id_Entity: this.state.hotelEdit.value,
                            Id_Department: id
                        },
                        fetchPolicy: 'no-cache'
                    })
                    .then((data) => {
                        if (data.data.getposition != null) {
                            this.setState({
                                arraytitles: data.data.getposition.map(t => {
                                    return { value: t.Id, label: t.Position ? t.Position.trim() : '' }
                                })
                            });
                        }
                    })
                    .catch((error) => {
                        console.log('Error fetchTitles: ', error);
                    });
            }
        })
    };

    componentWillMount() {
        this.fetchDepartments()
    }

    fetchDepartments = (id) => {
        this.setState(() => {
            return {
                arrayDepartment: [],
                department: DEFAULT_DEPARTMENT_OPT,
                contactTitle: DEFAULT_TITLE_OPT
            }
        }, () => {
            if (!!id) {
                this.props.client
                    .query({
                        query: GET_DEPARTMENTS_QUERY,
                        variables: { Id_Entity: id },
                        fetchPolicy: 'no-cache'
                    })
                    .then((data) => {
                        if (data.data.getcatalogitem != null) {
                            this.setState({
                                arrayDepartment: data.data.getcatalogitem.map(d => {
                                    return { value: d.Id, label: d.Name ? d.Name.trim() : '' }
                                })
                            });
                        }
                    })
                    .catch((error) => {
                        console.log('Error fetchDepartment: ', error);
                    });
            }
        });

    };

    handleChangeDate = (hireDate) => (date) => {
        let _date = moment(date).format();

        this.props.onchange(hireDate, _date);

        this.setState(prevState => {
            return { hireDateSelected: _date }
        })
    }

    handleOnChangeHotel = (opt, idEntity, department, contactTitle) => {
        this.setState({
            hotelEdit: opt
        }, () => this.fetchDepartments(opt.value));

        this.props.onchange(idEntity, opt.value);
        this.props.onchange(department, null);
        this.props.onchange(contactTitle, null);
    }

    handleOnChangeDepartment = (opt, department, contactTitle) => {
        this.setState({
            department: opt
        }, () => this.fetchTitles(opt.value));

        this.props.onchange(department, opt.value);
        this.props.onchange(contactTitle, null);
    }

    handleOnChangeTitle = (opt, contactTitle) => {
        this.setState({
            contactTitle: opt
        }, () => this.props.onchange(contactTitle, opt.value));
    }

    render() {
        const firstName = `firstName${this.props.index}`;
        const lastName = `lastName${this.props.index}`;
        const phoneNumber = `phoneNumber${this.props.index}`;
        const department = `department${this.props.index}`;
        const contactTitle = `contactTitle${this.props.index}`;
        const idEntity = `idEntity${this.props.index}`;
        const hireDate = `hireDate${this.props.index}`;
        const lastRow = this.props.index === this.props.lastIndex;
        const isUnique = `isUnique${this.props.index}`;

        return (

            <div className="row Employees-row position-relative">
                <div className="col">
                    {this.props[isUnique] === false ?
                        <i className="fas fa-exclamation-triangle text-danger" style={{ position: 'absolute', left: '-25px', top: '59%' }}></i> :
                        <React.Fragment></React.Fragment>}
                    <label htmlFor="" >* First Name</label>
                    <input
                        onChange={(e) => {
                            const value = e.target.value;
                            this.props.onchange(firstName, value);

                            if (lastRow) {
                                if (value.length > 2) {
                                    this.props.newRow();
                                }
                            }
                        }}
                        value={this.props[firstName] || ''}
                        type="text"
                        name="firstName"
                        className="form-control"
                        required={!lastRow}
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
                        value={this.props[lastName] || ''}
                        name="lastName"
                        className="form-control"
                        required={!lastRow}
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
                        value={this.props[phoneNumber] || ''}
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
                        options={this.props.hotels}
                        value={this.state.hotelEdit}
                        onChange={(opt) => this.handleOnChangeHotel(opt, idEntity, department, contactTitle)}
                        closeMenuOnSelect={true}
                    />
                </div>
                <div className="col">
                    <label htmlFor="" >Department</label>
                    <Select
                        name="department"
                        id="department"
                        options={this.state.arrayDepartment}
                        value={this.state.department}
                        onChange={(opt) => this.handleOnChangeDepartment(opt, department, contactTitle)}
                        closeMenuOnSelect={true}
                    />
                </div>
                <div className="col">
                    <label htmlFor="" >Position</label>
                    <Select
                        id="contactTitle"
                        name="contactTitle"
                        options={this.state.arraytitles}
                        value={this.state.contactTitle}
                        onChange={(opt) => this.handleOnChangeTitle(opt, contactTitle)}
                        closeMenuOnSelect={true}
                    />
                </div>

                <button class="float-right btn btn-link mt-4" title="Delete row" onClick={this.props.onDeleteRowHandler} disabled={this.props.index === this.props.lastIndex && this.props.lastIndex}><i className="fa fa-times text-dark" /></button>


            </div>
        );
    }
}

//export default EmployeeInputRow;
export default withStyles(styles)(withApollo(withGlobalContent(EmployeeInputRow)));

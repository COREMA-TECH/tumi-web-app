import React from "react";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";
import { select } from "async";
import months from "./months.json";
import timeZones from "./timezones.json";
import LinearProgress from "@material-ui/core/LinearProgress/LinearProgress";
import Calendar from "../../Holidays/Calendar";
import CatalogItem from "../../Generic/CatalogItem";

class Preferences extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Id: null,
            period: 1,
            charge: false,
            amount: "",
            idCompany: this.props.idCompany,
            Entityid: this.props.idCompany,
            disabled: true,
            time: "",
            options: [],

            startMonth: null,
            endMonth: null,
            timeZone: null,
            openCalendarModal: false
        };
        //this.setState({ idCompany: this.props.idCompany });
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    closeModal = (fnc = () => { }) => {
        this.setState(
            {
                openCalendarModal: false,
                idHoliday: null
            },
            fnc
        );
    };

    componentWillMount() {
        this.setState(
            {
                loading: true
            },
            () => {
                this.props.client
                    .query({
                        query: this.GET_QUERY,
                        variables: { id: this.state.idCompany },
                        fetchPolicy: "no-cache"
                    })
                    .then(result => {
                        let data = result.data;
                        if (data.companyPreferences != null) {
                            this.setState(
                                {
                                    Id: data.companyPreferences[0].id,
                                    period: data.companyPreferences[0].PeriodId,
                                    charge: data.companyPreferences[0].charge,
                                    amount: data.companyPreferences[0].amount,
                                    EntityId: data.companyPreferences[0].EntityId,
                                    disabled: !data.companyPreferences[0].charge,
                                    startMonth: data.companyPreferences[0].FiscalMonth1,
                                    endMonth: data.companyPreferences[0].FiscalMonth2,
                                    timeZone: data.companyPreferences[0].Timezone,
                                    time: data.companyPreferences[0].time
                                },
                                () => { }
                            );
                        }
                    })
                    .catch(error => {
                        this.setState({
                            errorMessage: "Error: Loading departments: " + error
                        });

                        this.setState({
                            loading: false
                        });
                    });
            }
        );

        this.setState(
            {
                loading: true
            },
            () => {
                this.props.client
                    .query({
                        query: this.GET_QUERY_CATALOGS,
                        variables: { id: 11 },
                        fetchPolicy: "no-cache"
                    })
                    .then(result => {
                        let data = result.data;
                        if (data.getcatalogitem != null) {
                            this.setState(
                                {
                                    options: data.getcatalogitem
                                },
                                () => {
                                    this.setState({
                                        loading: false
                                    });
                                }
                            );
                        } else {
                            this.setState({
                                loading: false
                            });
                        }
                    })
                    .catch(error => {
                        this.setState({
                            errorMessage: "Error: Loading positions: " + error
                        });
                    });
            }
        );
    }

    toggleState = event => {
        this.setState({
            disabled: !this.state.disabled
        });
    };

    handleChange(event) {
        const target = event.target;
        const value = target.type === "checkbox" ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

        if (name === "charge") {
            this.setState({
                amount: !value ? "" : this.state.amount,
                time: !value ? "" : this.state.time,
                period: !value ? null : this.state.period
            });
        }
    }

    handleSubmit(event) {
        event.preventDefault();
        this.setState({ saving: true }, () => {
            if (
                this.state.disabled &&
                (this.props.idCompany == ""/* ||
                    this.state.period == undefined ||
                    this.state.amount == undefined ||
                    this.state.amount < 0*/)
            ) {
                this.props.handleOpenSnackbar("error", "Error all fields are required");
            } else {
                if (this.state.Id == null) this.add();
                else this.update();
            }
        });
    }

    add() {
        this.props.client
            .mutate({
                mutation: this.INSERT_QUERY,
                variables: {
                    input: {
                        EntityId: this.props.idCompany,
                        PeriodId: this.state.period,
                        amount: parseFloat(this.state.amount),
                        charge: this.state.charge,
                        FiscalMonth1:
                            this.state.startMonth == "" ? null : this.state.startMonth,
                        FiscalMonth2:
                            this.state.endMonth == "" ? null : this.state.endMonth,
                        Timezone: parseInt(this.state.timeZone),
                        time: this.state.time
                    }
                }
            })
            .then(data => {
                this.props.handleOpenSnackbar("success", "Preference Inserted!");
                this.setState({ saving: false });
            })
            .catch(error => {
                this.setState({ saving: false });
                this.props.handleOpenSnackbar("error", "Error Preferences: " + error);
            });
    }

    update() {
        this.props.client
            .mutate({
                mutation: this.UPDATE_QUERY,
                variables: {
                    input: {
                        id: this.state.Id,
                        EntityId: this.props.idCompany,
                        PeriodId: this.state.period,
                        amount: parseFloat(this.state.amount),
                        charge: this.state.charge,
                        FiscalMonth1: this.state.startMonth,
                        FiscalMonth2: this.state.endMonth,
                        Timezone: parseInt(this.state.timeZone),
                        time: this.state.time
                    }
                }
            })
            .then(data => {
                this.props.handleOpenSnackbar("success", "Preference Updated!");
                this.setState({ saving: false });
            })
            .catch(error => {
                this.props.handleOpenSnackbar("error", "Error Preferences: " + error);
                this.setState({ saving: false });
            });
    }

    GET_QUERY = gql`
    query companyPreferences($id: Int) {
      companyPreferences(EntityId: $id) {
        id
        EntityId
        PeriodId
        amount
        charge
        FiscalMonth1
        FiscalMonth2
        Timezone
        time
      }
    }
  `;

    GET_QUERY_CATALOGS = gql`
    query getcatalogitem($id: Int) {
      getcatalogitem(IsActive: 1, Id_Catalog: $id) {
        Id
        Code: Name
        Name: Description
        IsActive
      }
    }
  `;

    INSERT_QUERY = gql`
    mutation addCompanyPreference($input: [inputInsertCompanyPreference]) {
      addCompanyPreference(companyPreference: $input) {
        id
        PeriodId
        charge
        amount
        EntityId
        FiscalMonth1
        FiscalMonth2
        Timezone
        time
      }
    }
  `;

    UPDATE_QUERY = gql`
    mutation updateCompanyPreference($input: inputUpdateCompanyPreference) {
      updateCompanyPreference(companyPreference: $input) {
        id
        PeriodId
        charge
        amount
        EntityId
        FiscalMonth1
        FiscalMonth2
        Timezone
        time
      }
    }
  `;

    render() {
        if (this.state.loading) {
            return <LinearProgress />;
        }

        return (
            <div className="">
                <form onSubmit={this.handleSubmit} className="Preferences-form">
                    <div className="row">
                        <div className="col-md-12">

                            <button
                                type="submit"
                                className="btn btn-success edit-company-button float-right"
                            >
                                Save {!this.state.saving && <i class="fas fa-save ml-1" />}
                                {this.state.saving && <i class="fas fa-spinner fa-spin ml-1" />}
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-5">
                            
                            < div className="row" >
                                <div className="col-md-6">
                                    <div className="card">
                                        <div className="card-header">Fiscal Year</div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>Start Month</label>
                                                </div>
                                                <div className="col-md-12">
                                                    <select
                                                        value={this.state.startMonth}
                                                        className="form-control"
                                                        onChange={event => {
                                                            this.setState({
                                                                startMonth: event.target.value
                                                            });
                                                        }}
                                                    >
                                                        <option value="12">Select a month</option>
                                                        {months.map(month => {
                                                            if (this.state.endMonth != month.id) {
                                                                return (
                                                                    <option key={month.id} value={month.id}>
                                                                        {month.description}
                                                                    </option>
                                                                );
                                                            }
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>End Month</label>
                                                </div>
                                                <div className="col-md-12">
                                                    <select
                                                        value={this.state.endMonth}
                                                        className="form-control"
                                                        onChange={event => {
                                                            this.setState({
                                                                endMonth: event.target.value
                                                            });
                                                        }}
                                                    >
                                                        <option value="12">Select a month</option>
                                                        {months.map(month => {
                                                            if (this.state.startMonth != month.id) {
                                                                return (
                                                                    <option key={month.id} value={month.id}>
                                                                        {month.description}
                                                                    </option>
                                                                );
                                                            }
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    {/* Time Zone preferences*/}
                                    <div className="card">
                                        <div className="card-header">Time Zone</div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <label>Time Zone</label>
                                                </div>
                                                <div className="col-md-12">
                                                    <select
                                                        value={this.state.timeZone}
                                                        className="form-control"
                                                        onChange={event => {
                                                            this.setState({
                                                                timeZone: event.target.value
                                                            });
                                                        }}
                                                    >
                                                        <option value="">Select an option</option>
                                                        {timeZones.map(item => {
                                                            return (
                                                                <option key={item.id} value={item.id}>
                                                                    {item.offset + " " + item.name}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div >
                        </div >

                        {/*<div className="col-md-7">
                            <div className="card">
                                <div className="card-body">
                                    <div className="text-center">
                                        <button
                                            type="button"
                                            className="btn btn-info edit-company-button"
                                            onClick={e => {
                                                e.preventDefault();
                                                this.setState({ openCalendarModal: true });
                                            }}
                                        >
                                            Set Up Company Holidays <i class="fas fa-calendar-alt ml-1" />
                                        </button>
                                    </div>

                                    <Calendar
                                        idCompany={this.props.idCompany}
                                        handleOpenSnackbar={this.props.handleOpenSnackbar}
                                        open={this.state.openCalendarModal}
                                        closeModal={this.closeModal}
                                        openModal={() => {
                                            this.setState({ openCalendarModal: true });
                                        }}
                                        idHoliday={this.state.idHoliday}
                                    />
                                </div>
                            </div>
                        </div>
                        */}
                    </div >
                </form >
            </div >
        );
    }
}

export default withApollo(Preferences);

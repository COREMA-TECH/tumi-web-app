import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';
import CatalogItem from 'Generic/CatalogItem';
import { select } from 'async';

class Preferences extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            Id: null,
            period: 1,
            charge: false,
            amount: 0,
            idCompany: this.props.idCompany,
            Entityid: this.props.idCompany,
            disabled: true
        };
        //this.setState({ idCompany: this.props.idCompany });
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentWillMount() {
        this.props.client
            .query({
                query: this.GET_QUERY,
                variables: { id: this.state.idCompany },
                fetchPolicy: 'no-cache'
            })
            .then((result) => {
                let data = result.data;
                if (data.companyPreferences != null) {
                    this.setState({
                        Id: data.companyPreferences[0].id,
                        period: data.companyPreferences[0].PeriodId,
                        charge: data.companyPreferences[0].charge,
                        amount: data.companyPreferences[0].amount,
                        EntityId: data.companyPreferences[0].EntityId,
                        disabled: !data.companyPreferences[0].charge
                    });
                }
            })
            .catch((error) => {
                this.setState({
                    errorMessage: 'Error: Loading departments: ' + error
                });
            });
    }

    toggleState = (event) => {

        this.setState({
            disabled: !this.state.disabled
        });

    }

    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });

        if (name === "charge") {
            this.setState({
                amount: !value ? 0 : this.state.amount
            });
        }

    }

    handleSubmit(event) {

        if (this.state.disabled && (this.props.idCompany == "" || this.state.period == undefined || this.state.amount == undefined || this.state.amount < 0)) {
            this.props.handleOpenSnackbar(
                'error',
                'Error all fields are required'
            );
        } else {
            if (this.state.Id == null)
                this.add();
            else
                this.update();
        }
        event.preventDefault();
    }

    add() {
        this.props.client.mutate({
            mutation: this.INSERT_QUERY,
            variables: {
                input: {
                    EntityId: this.props.idCompany,
                    PeriodId: this.state.period,
                    amount: parseFloat(this.state.amount),
                    charge: this.state.charge,
                }
            }
        })
            .then((data) => {
                this.props.handleOpenSnackbar(
                    'success',
                    'Preference Inserted!'
                );
            })
            .catch((error) => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error Preferences: ' + error
                );
            });
    }

    update() {
        this.props.client.mutate({
            mutation: this.UPDATE_QUERY,
            variables: {
                input: {
                    id: this.state.Id,
                    EntityId: this.props.idCompany,
                    PeriodId: this.state.period,
                    amount: parseFloat(this.state.amount),
                    charge: this.state.charge,
                }
            }
        })
            .then((data) => {
                this.props.handleOpenSnackbar(
                    'success',
                    'Preference Updated!'
                );
            })
            .catch((error) => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error Preferences: ' + error
                );
            });
    }

    GET_QUERY = gql`
        query companyPreferences($id:Int) {
            companyPreferences(EntityId: $id) {
                id
                EntityId
                PeriodId
                amount
                charge
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
            }
        }
    `;

    render() {
        return (
            <div className="container">
                <form onSubmit={this.handleSubmit} className="Preferences-form">
                    <div className="row">
                        <div className="col-4">
                            <div className="card-wrapper">
                                <div className="card-form-header yellow">Lunch Preferences</div>
                                <div className="row">
                                    <div className="col-12">
                                        <div className="col-6">
                                            <label className="primary card-input-label">
                                                Charge Lunch Hours?
                                            </label>
                                        </div>
                                        <div className="col-6">
                                            <input type="checkbox" checked={this.state.charge} name="charge" onClick={this.toggleState} onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="col-6">
                                            <label className="primary card-input-label">
                                                Period
                                            </label>
                                        </div>
                                        <div className="col-6">
                                            {
                                                (!this.state.disabled) ?
                                                    <CatalogItem
                                                        update={(id) => {
                                                            this.setState({ period: id })
                                                        }}
                                                        PeriodId={11}
                                                        name="period"
                                                        value={this.state.period}
                                                        disabled={(this.state.disabled)}
                                                    >
                                                    </CatalogItem>
                                                    :
                                                    <select className="form-control" disabled></select>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="col-6">
                                            <label className="primary card-input-label">
                                                Amount
                                            </label>
                                        </div>
                                        <div className="col-6">
                                            <input type="number" min="0" name="amount" disabled={(this.state.disabled) ? "disabled" : ""} value={this.state.amount} className="form-control" onChange={this.handleChange} />
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="options-company">
                                            <input className="btn btn-success edit-company-button" type="submit" value="Save" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

}

export default withApollo(Preferences);
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
        event.preventDefault();
        this.setState({saving:true},()=>{
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
        })
       
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
                this.setState({saving:false})
            })
            .catch((error) => {
                this.setState({saving:false})
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
                this.setState({saving:false})
            })
            .catch((error) => {
                this.props.handleOpenSnackbar(
                    'error',
                    'Error Preferences: ' + error
                );
                this.setState({saving:false})
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
            <div className="">
                <form onSubmit={this.handleSubmit} className="Preferences-form">
                    <div className="row">
                        <div className="col-md-12">
                            <button type="submit" className="btn btn-success edit-company-button float-right">
                            Save {!this.state.saving && <i class="fas fa-save ml-1" />}
											{this.state.saving && <i class="fas fa-spinner fa-spin ml-1" />}
                            </button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <div class="card">
                                <div class="card-header">Lunch Preferences</div>
                                <div class="card-body">
                                    <div className="row">
                                        <div className="col-md-2">
                                            <label>
                                                Charge Lunch Hours?
                                            </label>

                                            <div class="onoffswitch">
                                                <input type="checkbox" checked={this.state.charge} name="charge" onClick={this.toggleState} onChange={this.handleChange} className="onoffswitch-checkbox" id="myonoffswitch" />
                                                <label class="onoffswitch-label" for="myonoffswitch">
                                                    <span class="onoffswitch-inner"></span>
                                                    <span class="onoffswitch-switch"></span>
                                                </label>
                                            </div>
                                        </div>
                                        <div className="col-md-5">
                                            <label>
                                                Period
                                            </label>
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
                                        <div className="col-md-5">
                                            <label>
                                                Amount
                                            </label>
                                            <input type="number" min="0" name="amount" step=".01" disabled={(this.state.disabled) ? "disabled" : ""} value={this.state.amount} className="form-control" onChange={this.handleChange} />
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
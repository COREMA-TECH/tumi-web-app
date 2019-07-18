import React, { Component } from 'react';
import { INSERT_USER_QUERY } from './Mutations';
import { GET_COMPANY_QUERY, GET_USER } from './Queries';
import moment from 'moment';
import withApollo from "react-apollo/withApollo";
import BreakRules from '../../BreakRules';

class User extends Component {

    constructor() {
        super();
        this.state = {
            company: {},
            Id_Entity: 1,
            Id_Contact: null,
            Id_Roles: 0,
            Code_User: '',
            Full_Name: '',
            Electronic_Address: '',
            Phone_Number: '',
            Id_Language: '',
            IsAdmin: 0,
            AllowDelete: 0,
            AllowInsert: 0,
            AllowEdit: 0,
            AllowExport: 0,
            IdSchedulesEmployees: null,
            IdSchedulesManager: null,
            IsRecruiter: false,
            IdRegion: null,
            IsActive: 1,
            idRol: 0,
            idLanguage: 0
        }
    }

    componentWillMount() {
        this.getCompany();
    }

    getUser = () => {
        this.props.client.query({
            query: GET_USER,
            fetchPolicy: 'no-cache',
            variables: {
                id: this.props.idCompany
            },
        });
    }

    getCompany = () => {
        this.props.client.query({
            query: GET_COMPANY_QUERY,
            variables: {
                id: this.props.idCompany
            },
            fetchPolicy: 'no-cache'
        }).then(({ data }) => {
            this.setState({
                company: data.getbusinesscompanies[0],
                Id_Entity: data.getbusinesscompanies[0].Id,
                fullname: data.getbusinesscompanies[0].Code,
                email: data.getbusinesscompanies[0].Primary_Email,
                number: data.getbusinesscompanies[0].Phone_Number
            });
        });
    }

    insertUser = () => {
        this.setState({
            loading: true
        }, () => {
            this.props.client.mutate({
                mutation: INSERT_USER_QUERY,
                variables: {
                    input: {
                        Id: null,
                        Id_Entity: this.state.Id_Entity,
                        Id_Contact: null,
                        Id_Roles: this.state.idRol,
                        Code_User: `'${this.state.username}'`,
                        Full_Name: `'${this.state.fullname}'`,
                        Electronic_Address: `'${this.state.email}'`,
                        Phone_Number: `'${this.state.number}'`,
                        Id_Language: this.state.idLanguage,
                        IsAdmin: this.state.isAdmin ? 1 : 0,
                        AllowDelete: this.state.allowDelete ? 1 : 0,
                        AllowInsert: this.state.allowInsert ? 1 : 0,
                        AllowEdit: this.state.allowEdit ? 1 : 0,
                        AllowExport: this.state.allowExport ? 1 : 0,
                        IdSchedulesEmployees: null,
                        IdSchedulesManager: null,
                        IsRecruiter: false,
                        IdRegion: null,
                        IsActive: this.state.IsActive ? 1 : 0,
                        User_Created: 1,
                        User_Updated: 1,
                        Date_Created: "'2018-08-14 16:10:25+00'",
                        Date_Updated: "'2018-08-14 16:10:25+00'"
                    }
                }
            }).then((data) => {
                this.props.handleOpenSnackbar('success', 'User Inserted!');
            }).catch((error) => {
                this.props.handleOpenSnackbar(
                    'error', 'Error: Inserting User: ' + error
                );
                this.setState({
                    loading: false
                });
            });
        }
        );
    };

    handelChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.insertUser();
    }

    render() {
        return (
            <div className="row">
                <div className="col-md-4">
                    <div className="card">
                        <form action="" onSubmit={this.handleSubmit}>
                            <div className="card-header">
                                Username and Password
                            </div>
                            <div className="card-body">
                                <div className="row">
                                    <div className="col-md-12">
                                        <label htmlFor="">Username</label>
                                        <input type="text" name="username" className="form-control" required onChange={this.handelChange} />
                                    </div>
                                    <div className="col-md-12">
                                        <label htmlFor="">Password</label>
                                        <input type="password" name="password" className="form-control" required onChange={this.handelChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <button className="btn btn-success" type="submit">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-md-8">
                    <BreakRules 
                        companyId={this.props.idCompany}
                    />
                </div>
            </div>
        );
    }
}

export default withApollo(User);

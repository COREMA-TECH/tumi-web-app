import React, { Component } from 'react';
import { INSERT_USER_QUERY, UPDATE_USER_QUERY } from './Mutations';
import { GET_COMPANY_QUERY, GET_USER } from './Queries';
import withApollo from "react-apollo/withApollo";
import BreakRules from '../../BreakRules';

class User extends Component {

    constructor() {
        super();
        this.state = {
            company: {},
            Id_User: null,
            Id_Entity: 1,
            Full_Name: '',
            Electronic_Address: '',
            Phone_Number: '',
            Id_Language: '',
            IsAdmin: 1,
            AllowDelete: 1,
            AllowInsert: 1,
            AllowEdit: 1,
            AllowExport: 1,
            IsRecruiter: false,
            IsActive: 1,
            idRol: 5,
            Password: null,
            fullname: null
        }
    }

    componentWillMount() {
        this.getCompany();
    }

    getUser = () => {
        this.props.client.query({
            query: GET_USER,
            variables: {
                Id_Entity: this.state.Id_Entity,
                manageApp: true
            },
            fetchPolicy: 'no-cache'
        })
            .then(({ data: { user } }) => {
                if (user.length > 0) {
                    let _ = user[0];
                    this.setState(() => ({
                        Id_User: _.Id,
                        _Username: _.Code_User,
                        _Password: ''
                    }))
                }
            })
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
                _Username: data.getbusinesscompanies[0].Code,
                email: data.getbusinesscompanies[0].Primary_Email,
                number: data.getbusinesscompanies[0].Phone_Number,
                _Password: 'TEMP'
            }, this.getUser);
        });
    }

    insertUser = () => {
        this.setState(() => ({
            saving: true
        }), () => {
            this.props.client.mutate({
                mutation: INSERT_USER_QUERY,
                variables: {
                    input: {
                        Id_Entity: this.state.Id_Entity,
                        Id_Contact: null,
                        Id_Roles: this.state.idRol,
                        Code_User: this.state._Username,
                        Full_Name: this.state.fullname,
                        Electronic_Address: this.state.email || '',
                        Phone_Number: this.state.number || '',
                        IsAdmin: true,
                        AllowDelete: true,
                        AllowInsert: true,
                        AllowEdit: true,
                        AllowExport: true,
                        IsRecruiter: false,
                        IdRegion: null,
                        IsActive: true,
                        User_Created: localStorage.getItem('LoginId'),
                        User_Updated: localStorage.getItem('LoginId'),
                        Date_Created: new Date(),
                        Date_Updated: new Date()
                    }
                }
            }).then(_ => {
                this.props.handleOpenSnackbar('success', 'User Inserted!');
                this.setState(() => ({ saving: false, _Password: '' }));
            }).catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error Inserting User');
                this.setState(() => ({ saving: false }));
            });
        }
        );
    };

    updateUser = () => {
        this.setState(() => ({
            saving: true
        }), () => {
            this.props.client.mutate({
                mutation: UPDATE_USER_QUERY,
                variables: {
                    input: {
                        Id: this.state.Id_User,
                        User_Updated: localStorage.getItem('LoginId'),
                        Date_Updated: new Date(),
                        Password: this.state._Password
                    }
                }
            }).then(_ => {
                this.setState(() => ({ saving: false, _Password: '' }));
                this.props.handleOpenSnackbar('success', 'User Updated!');
            }).catch((error) => {
                this.props.handleOpenSnackbar('error', 'Error Updting User');
                this.setState(() => ({ saving: false }));
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
        if (!this.state.Id_User)
            this.insertUser();
        else
            this.updateUser();
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
                                        <input type="text" id="_Username" name="_Username" className="form-control" required disabled={false} value={this.state._Username} />
                                    </div>
                                    <div className="col-md-12">
                                        <label htmlFor="">Password</label>
                                        <input type="password" id="_Password" name="_Password" className="form-control" required={!this.state.Id_User} onChange={this.handelChange} value={this.state._Password} />
                                    </div>
                                </div>
                            </div>
                            <div className="card-footer">
                                <button className="btn btn-success" type="submit">
                                    Save
                                    {!this.state.saving && <i className="far fa-save ml-2" />}
                                    {this.state.saving && <i className="fa fa-spinner fa-spin ml-2" />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="col-md-8">
                    <BreakRules />
                </div>
            </div>
        );
    }
}

export default withApollo(User);

import React, { Component } from 'react';
import './index.css';
import { Route } from 'react-router-dom';
import CompanyList from '../../Company/CompanyList/';
import CreateCompany from '../../Company/CreateCompany/CreateCompany';
import Contract from '../../Contract/Contract';
import CreateRole from '../../Security/Roles';
import CreateForms from '../../Security/Forms';
import CreateRolesForms from '../../Security/RolesForms';
import CreateUsers from '../../Security/Users';
import Catalogs from '../../Catalogs/';
import Signature from '../../Contract/Signature';
import ApplicationList from 'ApplyForm/ApplicationList/ApplicationList';
import ApplicationInfoFast from 'ApplyForm-Recruiter/Application/ApplicationInfo';
import ApplicationTabs from '../../ApplyForm/Application/ApplicationTabs';
import WorkOrders from '../../WorkOrders';
import ResetPassword from '../../ResetPassword/ResetPassword';
import Board from '../../Board-Manager/BoardManager';
import withApollo from "react-apollo/withApollo";
import { GET_ROLES_FORMS } from "../Queries";
import withGlobalContent from "../../Generic/Global";
import { GET_FORMS_QUERY } from "../../Security/DropdownForm/queries";
import NotFound from "../../NotFound/NotFound";


class Container extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userLoggedRol: 1,
            dataRolForm: [],
            dataForm: []
        }
    }

    getRolesFormsInfo = () => {
        this.setState({
            loading: true
        }, () => {
            this.props.client
                .query({
                    query: GET_ROLES_FORMS
                })
                .then(({ data }) => {
                    this.setState({
                        dataRolForm: data.getrolesforms,
                        loading: false
                    });
                })
                .catch(error => {
                    this.setState({
                        loading: false
                    });

                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to get data. Please, try again!',
                        'bottom',
                        'right'
                    );
                })
        });
    };

    getFormsInfo = () => {
        this.setState({
            loading: true
        }, () => {
            this.props.client
                .query({
                    query: GET_FORMS_QUERY
                })
                .then(({ data }) => {
                    this.setState({
                        dataForm: data.getforms,
                        loading: false
                    });
                })
                .catch(error => {
                    this.setState({
                        loading: false
                    });

                    this.props.handleOpenSnackbar(
                        'error',
                        'Error to get data. Please, try again!',
                        'bottom',
                        'right'
                    );
                })
        });
    };

    componentWillMount() {
        this.getRolesFormsInfo();
        this.getFormsInfo();
    }

    render() {
        if (this.state.loading) {
            return (
                <div className="container-fluid">
                </div>
            )
        }

        return (
            <div className="container-fluid">
                {
                    this.state.dataRolForm.map(item => {
                        if (item.IdRoles === this.state.userLoggedRol) {
                            return this.state.dataForm.map(formItem => {
                                if (item.IdForms == formItem.Id) {
                                    if (formItem.Value.trim() == "/home/company") {
                                        return (
                                            <Route exact path="/home/company" component={CompanyList} />
                                        )
                                    } else if (formItem.Value.trim() == "/home/company/edit") {
                                        return (
                                            <Route exact path="/home/company/edit" component={CreateCompany} />
                                        )
                                    } else if (formItem.Value.trim() == "/home/company/add") {
                                        return (
                                            <Route exact path="/home/company/add" component={CreateCompany} />
                                        )
                                    } else if (formItem.Value.trim() == "/home/application/info") {
                                        return (
                                            <Route exact path="/home/application/info" component={ApplicationTabs} />
                                        )
                                    } else if (formItem.Value.trim() == "/home/application/Form") {
                                        return (
                                            <Route exact path="/home/application/Form" component={ApplicationInfoFast} />
                                        )
                                    } else if (formItem.Value.trim() == "/home/contract/add") {
                                        return (
                                            <Route exact path="/home/contract/add" component={Contract} />
                                        )
                                    } else if (formItem.Value.trim() == "/home/application") {
                                        return (
                                            <Route exact path="/home/application" component={ApplicationList} />
                                        )
                                    } else if (formItem.Value.trim() == "/home/work-orders") {
                                        return (
                                            <Route exact path="/home/work-orders" component={WorkOrders} />
                                        )
                                    } else if (formItem.Value.trim() == "/home/Roles") {
                                        return (
                                            <Route exact path="/home/Roles" component={CreateRole} />
                                        )
                                    } else if (formItem.Value.trim() == "/home/RolesForms") {
                                        return (
                                            <Route exact path="/home/RolesForms" component={CreateRolesForms} />
                                        )
                                    } else if (formItem.Value.trim() == "/home/Forms") {
                                        return (
                                            <Route exact path="/home/Forms" component={CreateForms} />
                                        )
                                    } else if (formItem.Value.trim() == "/home/Users") {
                                        return (
                                            <Route exact path="/home/Users" component={CreateUsers} />
                                        )
                                    } else if (formItem.Value.trim() == "/home/catalogs") {
                                        return (
                                            <Route exact path="/home/catalogs" component={Catalogs} />
                                        )
                                    } else if (formItem.Value.trim() == "/home/signature") {
                                        return (
                                            <Route exact path="/home/signature" component={Signature} />
                                        )
                                    } else if (formItem.Value.trim() == "/home/board") {
                                        return (
                                            <Route exact path="/home/board" component={Board} />
                                        )
                                    }
                                }
                            })
                        }
                    })
                }

                <Route exact path="/home/RolesForms" component={CreateRolesForms} />
                <Route exact path="/Reset" component={ResetPassword} />
                <Route path='*' component={NotFound} />
            </div>
        );
    }
}

export default withApollo(withGlobalContent(Container));

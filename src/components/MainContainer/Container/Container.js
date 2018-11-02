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
import MainContract from '../../Contract/Main/MainContract/MainContract';
import ApplicationList from 'ApplyForm/ApplicationList/ApplicationList';
import ApplicationRecruiter from 'ApplyForm-Recruiter/ApplicationList/ApplicationList';
import ApplicationInfo from 'ApplyForm/Application/ApplicationInfo';
import ApplicationInfoFast from 'ApplyForm-Recruiter/Application/ApplicationInfo';
import ApplicantDocument from 'ApplyForm/Application/ApplicantDocuments/ApplicantDocument.js';
import ApplicationTabs from '../../ApplyForm/Application/ApplicationTabs';
import WorkOrders from '../../WorkOrders';
import ResetPassword from '../../ResetPassword/ResetPassword';
import Board from '../../Board-Manager/BoardManager';
import BoardRecruiter from '../../Board-Recruiter/BoardRecruiter';
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
                <Route exact path="/home/application/info" component={ApplicationTabs} />
                <Route exact path="/home/application/Form" component={ApplicationInfoFast} />
                <Route exact path="/home/contract/add" component={Contract} />
                <Route exact path="/home/contracts" component={MainContract} />
                <Route exact path="/home/company" component={CompanyList} />
                <Route exact path="/home/company/edit" component={CreateCompany} />
                <Route exact path="/home/company/add" component={CreateCompany} />
                <Route exact path="/home/application" component={ApplicationList} />
                <Route exact path="/home/recruiter" component={ApplicationRecruiter} />
                <Route exact path="/home/work-orders" component={WorkOrders} />

                <Route exact path="/home/Roles" component={CreateRole} />
                <Route exact path="/home/RolesForms" component={CreateRolesForms} />
                <Route exact path="/home/Forms" component={CreateForms} />
                <Route exact path="/home/Users" component={CreateUsers} />
                <Route exact path="/Reset" component={ResetPassword} />
                <Route exact path="/home/catalogs" component={Catalogs} />
                <Route exact path="/home/signature" component={Signature} />
                <Route exact path="/home/board" component={Board} />
                <Route exact path="/home/board-recruiter" component={BoardRecruiter} />
            </div>
        );
    }
}

export default withApollo(withGlobalContent(Container));
